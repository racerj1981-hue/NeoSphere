import React from 'react';
import { Play, Star, Sparkles, Gamepad2, Shield } from 'lucide-react';

export const GameCard = ({
  game,
  isFavorite,
  onToggleFavorite,
  onPlayGame,
}) => {
  return (
    <div
      id={`game-card-${game.id}`}
      onClick={() => onPlayGame(game)}
      className="group relative bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 transform-gpu backface-hidden isolate"
    >
      {/* Thumbnail Container */}
      <div className="relative w-full aspect-video bg-zinc-950 overflow-hidden rounded-t-2xl transform-gpu">
        <img
          src={game.thumbnail}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 transform-gpu backface-hidden"
          onError={(e) => {
            // Fallback thumbnail if image breaks
            e.target.src =
              'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          {/* Linewize Safe Badge */}
          {game.isLinewizeSafe ? (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold backdrop-blur-md">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>LINEWIZE SAFE</span>
            </div>
          ) : (
            <div />
          )}

          {/* Favorite Star Button */}
          <button
            id={`fav-btn-${game.id}`}
            onClick={(e) => onToggleFavorite(e, game.id)}
            title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            className={`p-1.5 rounded-lg backdrop-blur-md border transition-all ${
              isFavorite
                ? 'bg-amber-500/30 border-amber-500/50 text-amber-400'
                : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-amber-400 hover:bg-zinc-900'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Featured / Custom Badge */}
        {game.featured && (
          <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>FEATURED</span>
          </div>
        )}

        {game.isCustom && (
          <div className="absolute bottom-2.5 left-2.5 z-10 px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-bold font-mono">
            CUSTOM IFRAME
          </div>
        )}

        {/* Center Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-600/50 scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-2">
        <div>
          <h3 className="text-base font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
            {game.title}
          </h3>
          <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Footer Meta Stats */}
        <div className="pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400 font-medium">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{game.rating.toFixed(1)}</span>
          </div>

          <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-500" title={`${(game.playCount || 0).toLocaleString()} plays`}>
            <Gamepad2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>{(game.playCount || 0).toLocaleString()} plays</span>
          </div>
        </div>
      </div>
    </div>
  );
};
