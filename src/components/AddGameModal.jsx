import React, { useState } from 'react';
import { X, Plus, Gamepad2, Link } from 'lucide-react';

const CATEGORY_OPTIONS = [
  'Action',
  'Puzzle',
  'Arcade',
  'Retro',
  'Strategy',
  'Driving',
  'Sports',
  'Casual',
];

export const AddGameModal = ({ onAddGame, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Action');
  const [iframeUrl, setIframeUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [controlsInput, setControlsInput] = useState('Arrow Keys - Move, Space - Action');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !iframeUrl.trim()) {
      setError('Please fill in both the Game Title and Iframe URL.');
      return;
    }

    // Clean up iframe URL if user pasted full <iframe src="..."> tag
    let cleanUrl = iframeUrl.trim();
    if (cleanUrl.includes('<iframe') && cleanUrl.includes('src=')) {
      const match = cleanUrl.match(/src=["']([^"']+)["']/);
      if (match && match[1]) {
        cleanUrl = match[1];
      }
    }

    const newGame = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Custom unblocked iframe game added by user.',
      category,
      iframeUrl: cleanUrl,
      thumbnail: thumbnail.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      controls: controlsInput.split(',').map((c) => c.trim()).filter(Boolean),
      author: author.trim() || 'Custom Creator',
      rating: 5.0,
      playCount: 1,
      isCustom: true,
      sandbox: 'allow-scripts allow-same-origin allow-popups',
      allow: 'autoplay; fullscreen',
      releaseYear: new Date().getFullYear(),
    };

    onAddGame(newGame);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Add Custom Iframe Game</h2>
              <p className="text-xs text-zinc-400">Store new game URL into local JSON database</p>
            </div>
          </div>

          <button
            id="close-add-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Game Title *
            </label>
            <input
              id="add-game-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Space Odyssey 3D"
              className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Iframe URL or Embed Code *
            </label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                id="add-game-url-input"
                type="text"
                required
                value={iframeUrl}
                onChange={(e) => setIframeUrl(e.target.value)}
                placeholder="https://example.com/game or <iframe src=...>"
                className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Paste the web link or iframe tag for any HTML5 unblocked game.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Category
              </label>
              <select
                id="add-game-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Thumbnail Image URL (Optional)
              </label>
              <input
                id="add-game-thumb-input"
                type="text"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://images.com/cover.jpg"
                className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Description
            </label>
            <textarea
              id="add-game-desc-input"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary of the game..."
              className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Controls (comma separated)
            </label>
            <input
              id="add-game-controls-input"
              type="text"
              value={controlsInput}
              onChange={(e) => setControlsInput(e.target.value)}
              placeholder="Arrow Keys - Move, Space - Jump"
              className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-all"
            >
              Cancel
            </button>
            <button
              id="submit-add-game-btn"
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Save to JSON State
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
