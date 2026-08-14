import React from 'react';
import { APP_VERSION } from './ChangelogModal.jsx';
import { 
  Gamepad2, 
  Search, 
  PlusCircle, 
  ShieldAlert, 
  Star
} from 'lucide-react';

export const Header = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  showFavoritesOnly,
  setShowFavoritesOnly,
  favoritesCount,
  onOpenAddModal,
  onOpenPanicSettings,
  onTriggerPanic,
  onOpenJsonViewer,
  onOpenChangelog
}) => {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => {
                setSearchQuery('');
                setShowFavoritesOnly(false);
              }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 p-1 shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full bg-red-950/40 rounded-full flex items-center justify-center border border-red-400/30">
                  <div className="w-5 h-5 rounded-full bg-white shadow-inner flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-red-600" />
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight">
                  <span className="text-red-500">NEO</span>
                  <span className="text-white">SPHERE</span>
                </h1>
                <p className="text-[10px] font-medium text-zinc-400 -mt-0.5 tracking-wider">
                  Made by <span className="text-red-400 font-semibold">Jace</span>
                </p>
              </div>
            </div>

            {/* Version Badge button */}
            <button
              id="header-version-badge"
              onClick={onOpenChangelog}
              title="Click to view Version History & What's New"
              className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-full transition-all flex items-center gap-1 active:scale-95"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{APP_VERSION}</span>
            </button>
          </div>

          {/* Mobile Panic Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="mobile-panic-btn"
              onClick={onTriggerPanic}
              title="Quick Panic Button (Disguise Screen)"
              className="p-2 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-900/80 active:scale-95 transition-all"
            >
              <ShieldAlert className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Section: Search Bar & Add Game Button */}
        <div className="flex-1 flex items-center justify-center gap-3 w-full md:max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              id="game-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NeoSphere games, genres, or keywords..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-900/90 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800 px-1.5 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {/* Add Game Button in Middle */}
          <button
            id="add-custom-game-btn"
            onClick={onOpenAddModal}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 text-white shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all whitespace-nowrap active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Game</span>
          </button>
        </div>

        {/* Quick Action Tools & Modals */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end overflow-x-auto pb-1 md:pb-0">
          
          {/* Favorites Filter Button */}
          <button
            id="favorites-toggle-btn"
            onClick={() => {
              const next = !showFavoritesOnly;
              setShowFavoritesOnly(next);
              if (next && setSelectedCategory) {
                setSelectedCategory('All');
              }
            }}
            className={`px-3 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 border transition-all whitespace-nowrap ${
              showFavoritesOnly
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/10'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-amber-400 text-amber-400' : 'text-zinc-400'}`} />
            <span>Favorites</span>
            <span
              className={`px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-full ${
                showFavoritesOnly
                  ? 'bg-amber-400/30 text-amber-200'
                  : 'bg-zinc-800 text-amber-400/90'
              }`}
            >
              {favoritesCount}
            </span>
          </button>

          {/* Panic Disguise Button */}
          <button
            id="panic-trigger-btn"
            onClick={onTriggerPanic}
            onContextMenu={(e) => {
              e.preventDefault();
              onOpenPanicSettings();
            }}
            title="Panic Disguise Mode (Right click for Settings)"
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 flex items-center gap-1.5 transition-all whitespace-nowrap active:scale-95 shadow-md shadow-red-950/50"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>Panic [ESC]</span>
          </button>

        </div>

      </div>
    </header>
  );
};
