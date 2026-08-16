import React, { useState, useEffect } from 'react';
import { Play, Star, Sparkles, Gamepad2, ExternalLink } from 'lucide-react';
import { APP_VERSION } from './ChangelogModal';

const withCacheBuster = (url) => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  const cleanUrl = url.split('?')[0];
  return `${cleanUrl}?v=${APP_VERSION}`;
};

export const GameCard = ({
  game,
  isFavorite,
  onToggleFavorite,
  onPlayGame,
}) => {
  const isExternalLink = game.isExternal || Boolean(game.redirectUrl) || game.id === 'request-games';
  const [imgSrc, setImgSrc] = useState(() => withCacheBuster(game.thumbnail));
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    setImgSrc(withCacheBuster(game.thumbnail));
    setErrorCount(0);
  }, [game.thumbnail, game.id]);

  const handleImageError = () => {
    if (errorCount === 0) {
      // Try alternate local paths if relative path failed
      const baseThumb = game.thumbnail ? game.thumbnail.split('?')[0] : '';
      if (baseThumb.endsWith('.png')) {
        setImgSrc(withCacheBuster(baseThumb.replace('.png', '.jpg')));
      } else if (baseThumb.endsWith('.jpg')) {
        setImgSrc(withCacheBuster(baseThumb.replace('.jpg', '.png')));
      } else {
        setImgSrc(withCacheBuster(`./assets/games/${game.id}.png`));
      }
      setErrorCount(1);
    } else if (errorCount === 1) {
      // Try root-relative fallback
      setImgSrc(withCacheBuster(`./assets/games/${game.id}.jpg`));
      setErrorCount(2);
    }
  };

  if (isExternalLink) {
    const targetUrl = game.redirectUrl || game.iframeUrl || 'https://forms.gle/CnvnG9kwxg5T4Kk18';
    return (
      <a
        id={`game-card-${game.id}`}
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 transform-gpu backface-hidden isolate no-underline text-inherit"
      >
        {/* Thumbnail Container */}
        <div className="relative w-full aspect-video bg-zinc-950 overflow-hidden rounded-t-2xl transform-gpu">
          {imgSrc && errorCount < 3 ? (
            <img
              src={imgSrc}
              alt={game.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 transform-gpu backface-hidden"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950/80 via-zinc-900 to-zinc-950 p-4 text-center select-none">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-2">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-zinc-300 line-clamp-1">{game.title}</span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

          {/* Top Badges */}
          <div className="absolute top-2.5 right-2.5 flex items-center justify-end z-10">
            <button
              id={`fav-btn-${game.id}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(e, game.id);
              }}
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

          <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[10px] font-bold">
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span>GOOGLE FORM</span>
          </div>

          {/* Center Hover Action Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl scale-90 group-hover:scale-100 transition-transform bg-blue-600 text-white shadow-blue-600/50">
              <ExternalLink className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 flex flex-col justify-between flex-1 gap-2">
          <div>
            <h3 className="text-base font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors line-clamp-1 flex items-center gap-1.5">
              <span>{game.title}</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            </h3>
            <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
              {game.description}
            </p>
          </div>

          {/* Footer Meta Stats */}
          <div className="pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400 font-medium">
            <div className="flex items-center gap-1.5 text-blue-400/90 font-medium text-[11px]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              <span>Feedback & Ideas</span>
            </div>

            <div className="flex items-center gap-1 font-mono text-[11px] text-blue-400 font-semibold" title="Open Google Form in New Tab">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Form</span>
            </div>
          </div>
        </div>
      </a>
    );
  }

  return (
    <div
      id={`game-card-${game.id}`}
      onClick={() => onPlayGame(game)}
      className="group relative bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 transform-gpu backface-hidden isolate"
    >
      {/* Thumbnail Container */}
      <div className="relative w-full aspect-video bg-zinc-950 overflow-hidden rounded-t-2xl transform-gpu">
        {imgSrc && errorCount < 3 ? (
          <img
            src={imgSrc}
            alt={game.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 transform-gpu backface-hidden"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950/80 via-zinc-900 to-zinc-950 p-4 text-center select-none">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-2">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-zinc-300 line-clamp-1">{game.title}</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 right-2.5 flex items-center justify-end z-10">
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

        {/* Featured / Custom / Form Badge */}
        {game.featured && (
          <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>FEATURED</span>
          </div>
        )}

        {isExternalLink && !game.featured && (
          <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[10px] font-bold">
            <ExternalLink className="w-3 h-3 text-blue-400" />
            <span>GOOGLE FORM</span>
          </div>
        )}

        {game.isCustom && (
          <div className="absolute bottom-2.5 left-2.5 z-10 px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-bold font-mono">
            CUSTOM IFRAME
          </div>
        )}

        {/* Center Hover Action Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl scale-90 group-hover:scale-100 transition-transform ${
            isExternalLink 
              ? 'bg-blue-600 text-white shadow-blue-600/50' 
              : 'bg-indigo-600 text-white shadow-indigo-600/50'
          }`}>
            {isExternalLink ? (
              <ExternalLink className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 fill-white ml-0.5" />
            )}
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
          {game.rating != null && !isExternalLink && game.id !== 'request-games' ? (
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{typeof game.rating === 'number' ? game.rating.toFixed(1) : game.rating}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-blue-400/90 font-medium text-[11px]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              <span>Feedback & Ideas</span>
            </div>
          )}

          <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-500" title={isExternalLink ? 'Open Google Form in New Tab' : `${(game.playCount || 0).toLocaleString()} plays`}>
            {isExternalLink ? (
              <>
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-blue-400 font-semibold">Open in New Tab</span>
              </>
            ) : (
              <>
                <Gamepad2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>{(game.playCount || 0).toLocaleString()} plays</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
