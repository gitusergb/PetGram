import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Feed } from './components/Feed';
import { UploadModal } from './components/UploadModal';
import { Auth } from './components/Auth';
import { getPosts, addPost as apiAddPost, toggleLike as apiToggleLike, addComment as apiAddComment, onAuthStateChanged, logOut, seedInitialData, forceSeedInitialData } from './services/mockApi';
import type { Post, Category, NewPost, NewComment, User } from './types';
import { useDarkMode } from './hooks/useDarkMode';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<Category | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    try {
      let timeoutId: NodeJS.Timeout;
      const unsubscribe = onAuthStateChanged(user => {
        setCurrentUser(user);
        setIsAuthLoading(false);
        if (timeoutId) clearTimeout(timeoutId);
      });
      
      // Safety timeout: if auth doesn't respond in 5 seconds, stop loading
      timeoutId = setTimeout(() => {
        console.warn('Auth state check timed out, continuing anyway...');
        setIsAuthLoading(false);
      }, 5000);
      
      return () => {
        unsubscribe();
        if (timeoutId) clearTimeout(timeoutId);
      };
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setIsAuthLoading(false);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const allPosts = await getPosts();
      setPosts(allPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      // Seed initial data if database is empty (only runs once)
      seedInitialData().catch(console.error);
      fetchPosts();
      
      // Expose force seed function to window for manual testing (dev only)
      if (typeof window !== 'undefined') {
        (window as any).forceSeedData = forceSeedInitialData;
        console.log('💡 Tip: You can manually seed data by running: forceSeedData()');
      }
    }
  }, [currentUser, fetchPosts]);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === activeFilter));
    }
  }, [posts, activeFilter]);

  const handleAddPost = async (newPost: NewPost) => {
    try {
      await apiAddPost(newPost);
      await fetchPosts();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const handleToggleLike = async (postId: string) => {
    if (!currentUser) return;
    try {
      await apiToggleLike(postId, currentUser.id);
      await fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  
  const handleAddComment = async (newComment: NewComment) => {
    try {
      await apiAddComment(newComment);
      await fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isAuthLoading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;
  }

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <Header 
          user={currentUser}
          onUploadClick={() => setIsModalOpen(true)}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Feed 
            posts={filteredPosts} 
            currentUser={currentUser}
            isLoading={isLoading} 
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onToggleLike={handleToggleLike}
            onAddComment={handleAddComment}
          />
        </main>
        {isModalOpen && (
          <UploadModal 
            onClose={() => setIsModalOpen(false)} 
            onAddPost={handleAddPost}
          />
        )}
      </div>
    </div>
  );
};

export default App;
