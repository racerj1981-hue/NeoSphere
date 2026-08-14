import React, { useState } from 'react';
import { GameCard } from './GameCard';
import { Sparkles, Gamepad2 } from 'lucide-react';

export const GameGrid = ({
  games,
  favorites,
  selectedCategory,
  searchQuery,
  showFavoritesOnly,
  onToggleFavorite,
  onPlayGame,
  onResetFilters,
  onOpenAddModal,
}) => {
  const [sortBy, setSortBy] = useState('popular');

  // Sort games
  const sortedGames = [...games].sort((a, b) => {
    if (sortBy === 'popular') return b.playCount - a.playCount;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
    if (sortBy === 'newest') return (b.releaseYear || 2020) - (a.releaseYear || 2020);
    return 0;
  });

  const featuredGames = games.filter((g) => g.featured);

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      
      {/* Featured Banner (Shown when no active search/category filter) */}
      {!searchQuery && selectedCategory === 'All' && !showFavoritesOnly && featuredGames.length > 0 && (
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-zinc-900 to-purple-950/80 border border-indigo-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold font-mono tracking-widest uppercase mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Featured Unblocked Highlight
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            <div className="lg:col-span-7 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {featuredGames[0].title}
              </h2>
              <p className="text-zinc-300 text-sm leading-relaxed max-w-xl">
                {featuredGames[0].description}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="featured-play-btn"
                  onClick={() => onPlayGame(featuredGames[0])}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Gamepad2 className="w-4 h-4" /> Play Now in Iframe
                </button>
                <div className="px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs text-amber-400 font-bold">
                  ★ {featuredGames[0].rating} Rating
                </div>
              </div>
            </div>

            <div 
              className="lg:col-span-5 relative aspect-video rounded-2xl overflow-hidden border border-zinc-700/60 shadow-xl cursor-pointer group"
              onClick={() => onPlayGame(featuredGames[0])}
            >
              <img
                src={featuredGames[0].thumbnail}
                alt={featuredGames[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-600/50">
                  <Gamepad2 className="w-7 h-7" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800/80">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <span>
              {showFavoritesOnly
                ? 'Your Saved Favorites'
                : selectedCategory === 'All'
                ? searchQuery
                  ? `Search results for "${searchQuery}"`
                  : 'All NeoSphere Games'
                : `${selectedCategory} Games`}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-indigo-400">
              {sortedGames.length}
            </span>
          </h2>
        </div>
      </div>

      {/* Game Cards Grid */}
      {sortedGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {sortedGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              isFavorite={favorites.includes(game.id)}
              onToggleFavorite={onToggleFavorite}
              onPlayGame={onPlayGame}
            />
          ))}
        </div>
      ) : (
        /* Empty Results State */
        <div className="p-12 text-center bg-zinc-900/40 border border-zinc-800/80 rounded-2xl max-w-lg mx-auto my-12">
          <Gamepad2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-zinc-200 mb-1">No Games Found</h3>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            There are currently no games matching your criteria or in the catalog. You can add your own custom game or reset your search filters!
          </p>
          <div className="flex items-center justify-center gap-3">
            {onOpenAddModal && (
              <button
                id="empty-add-game-btn"
                onClick={onOpenAddModal}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg transition-all"
              >
                + Add Game
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
