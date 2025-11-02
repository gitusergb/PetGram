import React from 'react';
import { UploadIcon, SunIcon, MoonIcon, LogoutIcon } from './icons/Icons';
import type { User } from '../types';

interface HeaderProps {
  user: User;
  onUploadClick: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onUploadClick, onLogout, isDarkMode, toggleDarkMode }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 max-w-2xl flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
          Pet<span className="text-brand-500">Gram</span>
        </h1>
        <div className="flex items-center space-x-4">
           <span className="text-sm font-medium hidden sm:inline">Hi, {user.username}!</span>
           <button
            onClick={onUploadClick}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
            aria-label="Upload new post"
          >
            <UploadIcon />
          </button>
          <button
            onClick={toggleDarkMode}
            className="text-gray-600 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>
           <button
            onClick={onLogout}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            aria-label="Logout"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </header>
  );
};
