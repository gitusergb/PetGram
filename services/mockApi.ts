import type { Post, NewPost, User, NewComment, Comment } from '../types';
import { DUMMY_POSTS } from '../constants';
import { auth, database } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import {
  ref,
  set,
  get,
  push,
  update,
  onValue,
  off,
  DataSnapshot,
} from 'firebase/database';

const POSTS_PATH = 'posts';
const USERS_PATH = 'users';

// Helper function to convert Firebase user to our User type
const firebaseUserToUser = async (firebaseUser: FirebaseUser | null): Promise<User | null> => {
  if (!firebaseUser) return null;

  // Get user data from Realtime Database
  const userRef = ref(database, `${USERS_PATH}/${firebaseUser.uid}`);
  const snapshot = await get(userRef);
  
  if (snapshot.exists()) {
    const userData = snapshot.val();
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      username: userData.username || firebaseUser.displayName || 'User',
      avatar: userData.avatar || firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/48/48`,
    };
  } else {
    // If user data doesn't exist in database, create it
    const defaultUser: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      username: firebaseUser.displayName || 'User',
      avatar: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/48/48`,
    };
    await set(userRef, {
      username: defaultUser.username,
      avatar: defaultUser.avatar,
    });
    return defaultUser;
  }
};

// --- Auth Functions ---
export const getCurrentUser = async (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
      unsubscribe();
      const user = await firebaseUserToUser(firebaseUser);
      resolve(user);
    });
  });
};

export const signUp = async (email: string, password: string, username: string): Promise<User> => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update display name
    await updateProfile(firebaseUser, { displayName: username });

    // Create user data in Realtime Database
    const userRef = ref(database, `${USERS_PATH}/${firebaseUser.uid}`);
    const avatar = `https://picsum.photos/seed/${username}/48/48`;
    await set(userRef, {
      username,
      avatar,
    });

    return await firebaseUserToUser(firebaseUser) as User;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('User with this email already exists.');
    }
    throw new Error(error.message || 'Failed to sign up.');
  }
};

export const logIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return await firebaseUserToUser(userCredential.user) as User;
  } catch (error: any) {
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('Invalid email or password.');
    }
    throw new Error(error.message || 'Failed to log in.');
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to log out.');
  }
};

// A simple event system to notify App.tsx of auth changes
export const onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
  return firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
    const user = await firebaseUserToUser(firebaseUser);
    callback(user);
  });
};

// --- Post Functions ---
export const getPosts = async (): Promise<Post[]> => {
  try {
    const postsRef = ref(database, POSTS_PATH);
    const snapshot = await get(postsRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    const postsData = snapshot.val();
    const posts: Post[] = Object.keys(postsData).map(key => {
      const post = postsData[key];
      // Ensure arrays are always arrays (Firebase returns null if not set)
      return {
        ...post,
        id: key,
        likes: Array.isArray(post.likes) ? post.likes : [],
        comments: Array.isArray(post.comments) ? post.comments : [],
        hashtags: Array.isArray(post.hashtags) ? post.hashtags : [],
      };
    });

    return posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const addPost = async (newPost: NewPost): Promise<Post> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('User not authenticated');

  // Get user data
  const user = await firebaseUserToUser(currentUser);
  if (!user) throw new Error('User data not found');

  const hashtags = newPost.caption.match(/#\w+/g) || [];
  
  const post: Omit<Post, 'id'> = {
    userId: user.id,
    username: user.username,
    userAvatar: user.avatar,
    timestamp: new Date().toISOString(),
    likes: [],
    comments: [],
    hashtags,
    ...newPost,
  };
  
  try {
    const postsRef = ref(database, POSTS_PATH);
    const newPostRef = push(postsRef);
    await set(newPostRef, post);
    
    return {
      ...post,
      id: newPostRef.key || `post_${Date.now()}`,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to add post.');
  }
};

export const toggleLike = async (postId: string, userId: string): Promise<Post | undefined> => {
  try {
    const postRef = ref(database, `${POSTS_PATH}/${postId}`);
    const snapshot = await get(postRef);
    
    if (!snapshot.exists()) {
      return undefined;
    }

    const post = { ...snapshot.val(), id: postId } as Post;
    const likes = post.likes || [];
    const likeIndex = likes.indexOf(userId);

    let updatedLikes: string[];
    if (likeIndex === -1) {
      updatedLikes = [...likes, userId];
    } else {
      updatedLikes = likes.filter(id => id !== userId);
    }

    await update(postRef, { likes: updatedLikes });
    
    return {
      ...post,
      likes: updatedLikes,
    };
  } catch (error: any) {
    console.error('Error toggling like:', error);
    return undefined;
  }
};

export const addComment = async (newComment: NewComment): Promise<Post | undefined> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('User not authenticated');

  // Get user data
  const user = await firebaseUserToUser(currentUser);
  if (!user) throw new Error('User data not found');

  try {
    const postRef = ref(database, `${POSTS_PATH}/${newComment.postId}`);
    const snapshot = await get(postRef);
    
    if (!snapshot.exists()) {
      return undefined;
    }

    const post = { ...snapshot.val(), id: newComment.postId } as Post;
    const comments = post.comments || [];
    
    const comment: Comment = {
      id: `comment_${Date.now()}`,
      userId: user.id,
      username: user.username,
      text: newComment.text,
      timestamp: new Date().toISOString(),
    };

    const updatedComments = [...comments, comment];
    await update(postRef, { comments: updatedComments });
    
    return {
      ...post,
      comments: updatedComments,
    };
  } catch (error: any) {
    console.error('Error adding comment:', error);
    return undefined;
  }
};

// --- Migration/Seed Function ---
export const seedInitialData = async (): Promise<void> => {
  try {
    const postsRef = ref(database, POSTS_PATH);
    const snapshot = await get(postsRef);
    
    // Only seed if database is empty
    if (!snapshot.exists() || Object.keys(snapshot.val()).length === 0) {
      console.log('Seeding initial data to Firebase...');
      const updates: { [key: string]: Omit<Post, 'id'> } = {};
      
      DUMMY_POSTS.forEach(post => {
        const postId = post.id;
        const { id, ...postData } = post;
        updates[postId] = postData;
      });

      await set(postsRef, updates);
      console.log('Initial data seeded successfully!');
    } else {
      console.log('Database already contains data. Skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
    throw error;
  }
};

// Force seed function for testing (overwrites existing data)
export const forceSeedInitialData = async (): Promise<void> => {
  try {
    console.log('Force seeding initial data to Firebase...');
    const postsRef = ref(database, POSTS_PATH);
    const updates: { [key: string]: Omit<Post, 'id'> } = {};
    
    DUMMY_POSTS.forEach(post => {
      const postId = post.id;
      const { id, ...postData } = post;
      updates[postId] = postData;
    });

    await set(postsRef, updates);
    console.log('Initial data force-seeded successfully!');
    console.log(`Uploaded ${DUMMY_POSTS.length} posts to Firebase.`);
  } catch (error) {
    console.error('Error force seeding initial data:', error);
    throw error;
  }
};