import React, { useState, useRef } from 'react';
import { 
  Maximize2, 
  RotateCcw, 
  X, 
  Star, 
  Check, 
  Layers, 
  Keyboard, 
  Code,
  ExternalLink,
  Shield,
  Gamepad2
} from 'lucide-react';

export const GamePlayer = ({
  game,
  isFavorite,
  onToggleFavorite,
  onClose,
}) => {
  const [useFallback, setUseFallback] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [key, setKey] = useState(0); // key for force iframe reload
  const playerContainerRef = useRef(null);

  // Handle Launch in About:Blank window for URL disguise
  const handleOpenAboutBlank = () => {
    try {
      const win = window.open('about:blank', '_blank');
      if (!win) return;
      const doc = win.document;
      doc.title = game.title || 'Classes - Google Classroom';
      doc.body.style.margin = '0';
      doc.body.style.height = '100vh';
      doc.body.style.overflow = 'hidden';
      doc.body.style.backgroundColor = '#000';
      const iframe = doc.createElement('iframe');
      iframe.style.width = '100vw';
      iframe.style.height = '100vh';
      iframe.style.border = 'none';
      if (useFallback && game.fallbackHtml) {
        iframe.srcdoc = game.fallbackHtml;
      } else {
        iframe.src = game.iframeUrl;
      }
      doc.body.appendChild(iframe);
    } catch (e) {
      console.error('About:Blank launch error:', e);
    }
  };

  // Handle Fullscreen request
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch((err) => {
        console.warn("Fullscreen request error:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn("Exit fullscreen error:", err);
      });
    }
  };

  // Reload Iframe
  const handleReload = () => {
    setKey((prev) => prev + 1);
  };

  // Copy Iframe embed tag
  const handleCopyEmbed = () => {
    const embedCode = `<iframe src="${game.iframeUrl}" width="800" height="600" frameborder="0" allow="${game.allow || 'autoplay; fullscreen'}" sandbox="${game.sandbox || 'allow-scripts allow-same-origin'}"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine iframe source
  const iframeSrc = useFallback && game.fallbackHtml
    ? `data:text/html;charset=utf-8,${encodeURIComponent(game.fallbackHtml)}`
    : game.iframeUrl;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn">
      
      {/* Player Wrapper Container */}
      <div 
        ref={playerContainerRef}
        className={`w-full bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl transition-all ${
          isTheaterMode ? 'max-w-7xl h-[92vh]' : 'max-w-5xl h-[85vh]'
        }`}
      >
        {/* Top Control Bar */}
        <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between gap-3 select-none">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span>{game.title}</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-medium flex items-center gap-1" title="Live play counter">
                <Gamepad2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{(game.playCount || 0).toLocaleString()} plays</span>
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Toggle Fallback engine */}
            {game.fallbackHtml && (
              <button
                id="toggle-fallback-engine-btn"
                onClick={() => setUseFallback(!useFallback)}
                title="Switch between live web iframe and embedded offline canvas engine"
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                  useFallback
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{useFallback ? 'Canvas Mode' : 'Web Iframe'}</span>
              </button>
            )}

            {/* About:Blank Stealth Window Button */}
            <button
              id="player-about-blank-btn"
              onClick={handleOpenAboutBlank}
              className="px-2 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-indigo-500/50 text-zinc-300 hover:text-indigo-300 transition-all flex items-center gap-1 text-xs font-semibold"
              title="Open Game in about:blank Popup Window (Hides URL from browser address history)"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">About:Blank</span>
            </button>

            {/* Favorite Button */}
            <button
              id="player-fav-btn"
              onClick={(e) => onToggleFavorite(e, game.id)}
              className={`p-1.5 rounded-lg border transition-all ${
                isFavorite
                  ? 'bg-amber-500/30 border-amber-500/50 text-amber-400'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-amber-400'
              }`}
              title="Save to Favorites"
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Reload Button */}
            <button
              id="player-reload-btn"
              onClick={handleReload}
              className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all"
              title="Reload Game Iframe"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Theater Mode Toggle */}
            <button
              id="player-theater-btn"
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              className={`p-1.5 rounded-lg border transition-all hidden sm:block ${
                isTheaterMode
                  ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
              }`}
              title="Theater Mode Expand"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Fullscreen Button */}
            <button
              id="player-fullscreen-btn"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 text-white transition-all shadow"
              title="Full Screen Mode"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Close Modal Button */}
            <button
              id="player-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-200 transition-all ml-1"
              title="Close Player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Iframe Canvas Area */}
        <div className="relative flex-1 bg-black w-full h-full min-h-[300px] overflow-hidden">
          <iframe
            key={key}
            id="game-element"
            name="gameFrame"
            src={useFallback && game.fallbackHtml ? undefined : iframeSrc}
            srcDoc={useFallback && game.fallbackHtml ? game.fallbackHtml : undefined}
            title={game.title}
            className="w-full h-full border-none"
            scrolling="no"
            allowFullScreen
            allow={game.allow || 'autoplay; fullscreen; pointer-lock; gamepad'}
            sandbox={game.sandbox || 'allow-scripts allow-same-origin allow-popups'}
          />
        </div>

        {/* Bottom Game Details Bar */}
        <div className="bg-zinc-900 p-4 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs text-zinc-300">
          
          {/* Game Info & Controls */}
          <div className="md:col-span-8 space-y-2">
            <p className="text-zinc-300 leading-relaxed font-medium">
              {game.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-zinc-400 font-bold flex items-center gap-1">
                <Keyboard className="w-3.5 h-3.5 text-indigo-400" /> Controls:
              </span>
              {game.controls.map((ctrl, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-indigo-300 font-mono text-[11px]">
                  {ctrl}
                </span>
              ))}
            </div>
          </div>

          {/* Security Badge & Release Year */}
          <div className="md:col-span-4 flex flex-col justify-center items-start md:items-end border-t md:border-t-0 md:border-l border-zinc-800 pt-2 md:pt-0 md:pl-4">
            <span className="text-[11px] text-zinc-400">Released: {game.releaseYear || 2021}</span>
          </div>

        </div>

      </div>
    </div>
  );
};
