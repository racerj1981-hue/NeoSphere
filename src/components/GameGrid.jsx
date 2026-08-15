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
    if (sortBy === 'popular') return (b.playCount || 0) - (a.playCount || 0);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
    if (sortBy === 'newest') return (b.releaseYear || 2020) - (a.releaseYear || 2020);
    return 0;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
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
