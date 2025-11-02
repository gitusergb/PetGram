import React, { useState } from 'react';
import type { Post, NewComment, User } from '../types';
import { HeartIcon, HeartFilledIcon, CommentIcon } from './icons/Icons';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onToggleLike: (postId: string) => void;
  onAddComment: (comment: NewComment) => void;
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m";
  return Math.floor(seconds) + "s";
};

const CommentForm: React.FC<{ postId: string, onAddComment: (comment: NewComment) => void }> = ({ postId, onAddComment }) => {
    const [commentText, setCommentText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onAddComment({
                postId,
                text: commentText.trim(),
            });
            setCommentText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
            <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow bg-transparent text-sm focus:outline-none"
            />
            <button type="submit" className="text-brand-500 hover:text-brand-600 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled={!commentText.trim()}>
                Post
            </button>
        </form>
    );
};


export const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onToggleLike, onAddComment }) => {
  const { id, username, userAvatar, imageUrl, caption, hashtags, likes, comments, timestamp, filter } = post;
  // Ensure likes, comments, and hashtags are arrays (Firebase might return null)
  const likesArray = Array.isArray(likes) ? likes : [];
  const commentsArray = Array.isArray(comments) ? comments : [];
  const hashtagsArray = Array.isArray(hashtags) ? hashtags : [];
  const isLiked = likesArray.includes(currentUser.id);

  const handleLikeClick = () => {
    onToggleLike(id);
  };
  
  const renderCaption = () => {
    const parts = caption.split(/(#\w+)/g);
    return parts.map((part, index) =>
      part.startsWith('#') ? (
        <span key={index} className="text-brand-500 font-medium cursor-pointer">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 flex items-center space-x-3">
        <img src={userAvatar} alt={username} className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-100">{username}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(timestamp)}</p>
        </div>
      </div>
      <img src={imageUrl} alt="Pet post" className="w-full h-auto object-cover" style={{ filter }} />
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <button onClick={handleLikeClick} className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors">
            {isLiked ? <HeartFilledIcon /> : <HeartIcon />}
          </button>
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
            <CommentIcon />
          </div>
        </div>
        <p className="font-semibold mt-2 text-sm">{likesArray.length} {likesArray.length === 1 ? 'like' : 'likes'}</p>
        <p className="mt-1 text-sm">
          <span className="font-semibold mr-2">{username}</span>
          {renderCaption()}
        </p>
         <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {commentsArray.length > 0 && (
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {commentsArray.map(comment => (
                <div key={comment.id}>
                  <span className="font-semibold mr-2">{comment.username}</span>
                  <span>{comment.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-3">
           <CommentForm postId={id} onAddComment={onAddComment} />
        </div>
      </div>
    </div>
  );
};
