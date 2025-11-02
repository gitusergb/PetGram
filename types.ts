export enum Category {
  Dog = 'dog',
  Cat = 'cat',
  Bird = 'bird',
  Other = 'other',
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar: string;
}

export interface Comment {
  id:string;
  userId: string;
  username: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  imageUrl: string;
  caption: string;
  hashtags: string[];
  likes: string[]; // Array of userIds who liked
  comments: Comment[];
  category: Category;
  timestamp: string;
  filter: string;
}

export interface NewPost {
  imageUrl: string;
  caption: string;
  category: Category;
  filter: string;
}

export interface NewComment {
  postId: string;
  text: string;
}
