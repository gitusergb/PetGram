import React from 'react';
import type { Post, Category, NewComment, User } from '../types';
import { PostCard } from './PostCard';
import { Filter } from './Filter';

interface FeedProps {
  posts: Post[];
  currentUser: User;
  isLoading: boolean;
  activeFilter: Category | 'all';
  setActiveFilter: (filter: Category | 'all') => void;
  onToggleLike: (postId: string) => void;
  onAddComment: (comment: NewComment) => void;
}

export const Feed: React.FC<FeedProps> = ({ posts, currentUser, isLoading, activeFilter, setActiveFilter, onToggleLike, onAddComment }) => {
  if (isLoading) {
    return (
      <div className="text-center p-10">
        <p className="text-gray-500 dark:text-gray-400">Loading paw-some posts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Filter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      {posts.length > 0 ? (
        posts.map(post => (
          <PostCard 
            key={post.id} 
            post={post}
            currentUser={currentUser}
            onToggleLike={onToggleLike}
            onAddComment={onAddComment}
          />
        ))
      ) : (
        <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-10">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No posts found!</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Be the first to share a cute pet moment in this category!
          </p>
        </div>
      )}
    </div>
  );
};
