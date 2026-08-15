import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header.jsx';
import { CategoryBar } from './components/CategoryBar.jsx';
import { GameGrid } from './components/GameGrid.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { PanicScreen } from './components/PanicScreen.jsx';
import { PanicSettingsModal } from './components/PanicSettingsModal.jsx';
import { JsonViewerModal } from './components/JsonViewerModal.jsx';
import { ChangelogModal, APP_VERSION } from './components/ChangelogModal.jsx';
import defaultGamesData from './data/games.json';
import { Gamepad2, ShieldAlert, Sparkles } from 'lucide-react';

export default function App() {
  const [games, setGames] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('ub_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const [activeGame, setActiveGame] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonViewerOpen, setIsJsonViewerOpen] = useState(false);
  const [isPanicSettingsOpen, setIsPanicSettingsOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  // Panic Mode Stealth state
  const [panicConfig, setPanicConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ub_panic_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      active: false,
      mode: 'close',
      disguiseType: 'classroom',
      closeUrl: 'https://www.google.com',
      triggerKey: 'Escape',
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('ub_panic_config', JSON.stringify(panicConfig));
    } catch {}
  }, [panicConfig]);

  // Tab Cloaking preset state
  const [tabCloak, setTabCloak] = useState(() => {
    try {
      return localStorage.getItem('ub_tab_cloak') || 'default';
    } catch {
      return 'default';
    }
  });

  // Dynamic Tab Title and Favicon Cloaker Effect
  useEffect(() => {
    try {
      localStorage.setItem('ub_tab_cloak', tabCloak);
    } catch {}

    const cloakMap = {
      classroom: {
        title: 'Classes - Google Classroom',
        icon: 'https://ssl.gstatic.com/classroom/favicon.png',
      },
      docs: {
        title: 'Google Docs',
        icon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
      },
      canvas: {
        title: 'Dashboard - Canvas LMS',
        icon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico',
      },
      drive: {
        title: 'My Drive - Google Drive',
        icon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png',
      },
      default: {
        title: 'NeoSphere Arcade Portal',
        icon: 'https://i.ibb.co/YTPzPZkW/Screenshot-2026-08-13-181943.png',
      },
    };

    const selected = cloakMap[tabCloak] || cloakMap.default;

    if (panicConfig.active) {
      if (panicConfig.disguiseType === 'classroom') {
        document.title = 'Classes - Google Classroom';
      } else if (panicConfig.disguiseType === 'docs') {
        document.title = 'Untitled document - Google Docs';
      } else if (panicConfig.disguiseType === 'wikipedia') {
        document.title = 'Computer science - Wikipedia';
      }
    } else {
      document.title = selected.title;
    }

    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    if (selected.icon) {
      link.href = selected.icon;
    }
  }, [tabCloak, panicConfig.active, panicConfig.disguiseType]);

  // Load games from JSON & localStorage with persistent play counts
  useEffect(() => {
    try {
      // Load stored custom games from localstorage
      const customGamesSaved = localStorage.getItem('ub_custom_games');
      const customGames = customGamesSaved ? JSON.parse(customGamesSaved) : [];
      
      // Load stored play counts
      const storedPlayCountsRaw = localStorage.getItem('ub_play_counts');
      const storedPlayCounts = storedPlayCountsRaw ? JSON.parse(storedPlayCountsRaw) : {};

      // Combine default JSON games + custom games and merge play counts
      const combined = [...defaultGamesData, ...customGames].map((g) => ({
        ...g,
        playCount: storedPlayCounts[g.id] !== undefined ? storedPlayCounts[g.id] : (g.playCount || 0),
      }));

      setGames(combined);
    } catch {
      setGames(defaultGamesData);
    }
  }, []);

  // Live real-time play count listener across open tabs & windows
  useEffect(() => {
    const handleRemotePlayUpdate = (gameId, newPlayCount) => {
      setGames((prevGames) =>
        prevGames.map((g) =>
          g.id === gameId ? { ...g, playCount: newPlayCount } : g
        )
      );
      setActiveGame((prevActive) => {
        if (prevActive && prevActive.id === gameId) {
          return { ...prevActive, playCount: newPlayCount };
        }
        return prevActive;
      });
    };

    // 1. BroadcastChannel listener (instant sync between open tabs)
    let bc = null;
    if (window.BroadcastChannel) {
      bc = new BroadcastChannel('ub_plays_channel');
      bc.onmessage = (event) => {
        if (event.data?.type === 'UB_PLAY_COUNT_UPDATED' && event.data.gameId) {
          handleRemotePlayUpdate(event.data.gameId, event.data.newPlayCount);
        }
      };
    }

    // 2. Storage event listener (multi-tab sync fallback)
    const handleStorageChange = (e) => {
      if (e.key === 'ub_play_counts' && e.newValue) {
        try {
          const counts = JSON.parse(e.newValue);
          setGames((prevGames) =>
            prevGames.map((g) => ({
              ...g,
              playCount: counts[g.id] !== undefined ? counts[g.id] : (g.playCount || 0),
            }))
          );
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ub_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [favorites]);

  // Close website / redirect action
  const executeCloseWebsite = () => {
    try {
      window.close();
    } catch (e) {}
    setTimeout(() => {
      const url = panicConfig.closeUrl || 'https://www.google.com';
      try {
        window.location.replace(url);
      } catch (e) {
        window.location.href = url;
      }
    }, 50);
  };

  const handleTriggerPanic = () => {
    if ((panicConfig.mode || 'close') === 'close') {
      executeCloseWebsite();
    } else {
      setPanicConfig((prev) => ({ ...prev, active: !prev.active }));
    }
  };

  // Global key listener for ESC Panic Trigger
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleTriggerPanic();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panicConfig]);

  // Favorite toggle handler
  const handleToggleFavorite = (e, gameId) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId]
    );
  };

  // Play game handler (increments play count, persists locally, and broadcasts across tabs/windows)
  const handlePlayGame = (gameToPlay) => {
    // If it is an external link or form redirect (like Request Games), redirect immediately
    if (gameToPlay.redirectUrl || gameToPlay.isExternal) {
      const targetUrl = gameToPlay.redirectUrl || gameToPlay.iframeUrl;
      try {
        const win = window.open(targetUrl, '_blank', 'noopener,noreferrer');
        if (!win) {
          window.location.href = targetUrl;
        }
      } catch (err) {
        window.location.href = targetUrl;
      }
      return;
    }

    let updatedCount = 0;

    setGames((prevGames) => {
      const updatedGames = prevGames.map((g) => {
        if (g.id === gameToPlay.id) {
          updatedCount = (g.playCount || 0) + 1;
          return { ...g, playCount: updatedCount };
        }
        return g;
      });

      // Persist play counts locally
      try {
        const storedRaw = localStorage.getItem('ub_play_counts');
        const stored = storedRaw ? JSON.parse(storedRaw) : {};
        stored[gameToPlay.id] = updatedCount;
        localStorage.setItem('ub_play_counts', JSON.stringify(stored));

        // Broadcast to other open tabs / windows
        if (window.BroadcastChannel) {
          const bc = new BroadcastChannel('ub_plays_channel');
          bc.postMessage({
            type: 'UB_PLAY_COUNT_UPDATED',
            gameId: gameToPlay.id,
            newPlayCount: updatedCount,
          });
          bc.close();
        }
      } catch (err) {
        console.warn('Play count local save error:', err);
      }

      return updatedGames;
    });

    setActiveGame({
      ...gameToPlay,
      playCount: (gameToPlay.playCount || 0) + 1,
    });
  };

  // Add custom game handler
  const handleAddGame = (newGame) => {
    const updated = [newGame, ...games];
    setGames(updated);

    // Save custom games in localStorage
    try {
      const existingCustom = localStorage.getItem('ub_custom_games');
      const list = existingCustom ? JSON.parse(existingCustom) : [];
      localStorage.setItem('ub_custom_games', JSON.stringify([newGame, ...list]));
    } catch (err) {
      console.warn('LocalStorage custom games error:', err);
    }

    setIsAddModalOpen(false);
    setActiveGame(newGame); // Automatically open new game
  };

  // Filter games based on search, category, and favorites
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      // Search match
      const q = searchQuery.toLowerCase().trim();
      const gameCategories = Array.isArray(game.category)
        ? game.category
        : typeof game.category === 'string'
        ? game.category.split(',').map((c) => c.trim())
        : [game.category];

      const matchesSearch =
        !q ||
        game.title.toLowerCase().includes(q) ||
        game.description.toLowerCase().includes(q) ||
        gameCategories.some((c) => c.toLowerCase().includes(q)) ||
        (game.author && game.author.toLowerCase().includes(q));

      // Category match
      const matchesCategory =
        selectedCategory === 'All' || gameCategories.includes(selectedCategory);

      // Favorites match
      const matchesFavorite = !showFavoritesOnly || favorites.includes(game.id);

      return matchesSearch && matchesCategory && matchesFavorite;
    });
  }, [games, searchQuery, selectedCategory, showFavoritesOnly, favorites]);

  // Category counts calculation
  const categoryCounts = useMemo(() => {
    const counts = { All: games.length };
    games.forEach((g) => {
      const cats = Array.isArray(g.category)
        ? g.category
        : typeof g.category === 'string'
        ? g.category.split(',').map((c) => c.trim())
        : [g.category];
      cats.forEach((cat) => {
        if (cat) counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return counts;
  }, [games]);

  // Reset filters helper
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setShowFavoritesOnly(false);
  };

  // Render Stealth Panic View
  if (panicConfig.active) {
    return (
      <PanicScreen
        config={panicConfig}
        onExit={() => setPanicConfig((prev) => ({ ...prev, active: false }))}
      />
    );
  }

  const favoritedGamesCount = useMemo(() => {
    return games.filter((g) => favorites.includes(g.id)).length;
  }, [games, favorites]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        favoritesCount={favoritedGamesCount}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenPanicSettings={() => setIsPanicSettingsOpen(true)}
        onTriggerPanic={handleTriggerPanic}
        onOpenJsonViewer={() => setIsJsonViewerOpen(true)}
        onOpenChangelog={() => setIsChangelogOpen(true)}
      />

      {/* Category Pills Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        showFavoritesOnly={showFavoritesOnly}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setShowFavoritesOnly(false);
        }}
        categoryCounts={categoryCounts}
      />

      {/* Main Game Catalog Grid */}
      <main className="flex-1">
        <GameGrid
          games={filteredGames}
          favorites={favorites}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorite={handleToggleFavorite}
          onPlayGame={handlePlayGame}
          onResetFilters={handleResetFilters}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-zinc-950 border-t border-zinc-900 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 p-0.5 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <span className="font-semibold text-zinc-300">NeoSphere</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">Made by <span className="text-zinc-200 font-semibold">Jace</span></span>
            <button
              id="footer-version-btn"
              onClick={() => setIsChangelogOpen(true)}
              className="ml-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-zinc-900 hover:bg-zinc-800 text-red-400 border border-zinc-800 hover:border-red-500/30 rounded-md transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-red-400" />
              <span>{APP_VERSION} Updates</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPanicSettingsOpen(true)}
              className="hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> Panic Mode Config
            </button>
          </div>
        </div>
      </footer>

      {/* Game Player Modal */}
      {activeGame && (
        <GamePlayer
          game={activeGame}
          isFavorite={favorites.includes(activeGame.id)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setActiveGame(null)}
        />
      )}

      {/* Add Custom Game Modal */}
      {isAddModalOpen && (
        <AddGameModal
          onAddGame={handleAddGame}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {/* JSON Viewer Modal */}
      {isJsonViewerOpen && (
        <JsonViewerModal
          games={games}
          onClose={() => setIsJsonViewerOpen(false)}
        />
      )}

      {/* Panic Settings Modal */}
      {isPanicSettingsOpen && (
        <PanicSettingsModal
          config={panicConfig}
          onUpdateConfig={setPanicConfig}
          tabCloak={tabCloak}
          onUpdateTabCloak={setTabCloak}
          onClose={() => setIsPanicSettingsOpen(false)}
        />
      )}

      {/* Changelog & Version Modal */}
      {isChangelogOpen && (
        <ChangelogModal
          onClose={() => setIsChangelogOpen(false)}
        />
      )}

    </div>
  );
}
