import React from 'react';
// FIX: Import Category as a value to use its enum members.
import { Category } from '../types';

interface FilterProps {
  activeFilter: Category | 'all';
  setActiveFilter: (filter: Category | 'all') => void;
}

// FIX: Use Category enum members instead of string literals.
const filters: (Category | 'all')[] = ['all', Category.Dog, Category.Cat, Category.Bird, Category.Other];

export const Filter: React.FC<FilterProps> = ({ activeFilter, setActiveFilter }) => {
  return (
    <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
      {filters.map(filter => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-all duration-200 ${
            activeFilter === filter
              ? 'bg-brand-500 text-white shadow'
              : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
          }`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
};
