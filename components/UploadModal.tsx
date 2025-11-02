import React, { useState, useRef, ChangeEvent } from 'react';
import { Category, type NewPost } from '../types';
import { CloseIcon } from './icons/Icons';

interface UploadModalProps {
  onClose: () => void;
  onAddPost: (post: NewPost) => void;
}

const imageFilters = [
  { name: 'None', value: 'none' },
  { name: 'Grayscale', value: 'grayscale(1)' },
  { name: 'Sepia', value: 'sepia(0.6)' },
  { name: 'Bright', value: 'brightness(1.2)' },
  { name: 'Contrast', value: 'contrast(1.4)' },
];

export const UploadModal: React.FC<UploadModalProps> = ({ onClose, onAddPost }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<Category>(Category.Dog);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('none');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file.');
        return;
      }
      setError('');
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !preview) {
      setError('Please select an image to upload.');
      return;
    }

    onAddPost({
      imageUrl: preview,
      caption,
      category,
      filter: activeFilter,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-full overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold">New Post</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {!preview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-10 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <p className="text-gray-500 dark:text-gray-400">Click to upload a photo</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="mb-4">
                <img src={preview} alt="Preview" className="w-full rounded-lg" style={{ filter: activeFilter }} />
                <div className="mt-2 text-center">
                    <button type="button" onClick={() => {setPreview(null); setFile(null); if(fileInputRef.current) fileInputRef.current.value = "";}} className="text-sm text-red-500 hover:underline">
                        Change Photo
                    </button>
                </div>
              </div>
            )}
            
            {preview && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filters</label>
                 <div className="flex space-x-2 overflow-x-auto pb-2">
                    {imageFilters.map(f => (
                        <button key={f.value} type="button" onClick={() => setActiveFilter(f.value)} className={`px-3 py-1 text-sm rounded-full ${activeFilter === f.value ? 'bg-brand-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>
                            {f.name}
                        </button>
                    ))}
                 </div>
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Caption</label>
              <textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-500 focus:ring-brand-500 bg-gray-50 dark:bg-gray-700 text-sm"
                placeholder="Write a caption... add #hashtags"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-500 focus:ring-brand-500 bg-gray-50 dark:bg-gray-700 text-sm"
              >
                {Object.values(Category).map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700">
            <button
              type="submit"
              className="w-full bg-brand-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50"
              disabled={!file}
            >
              Share
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
