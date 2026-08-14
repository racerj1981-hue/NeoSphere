import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header.jsx';
import { CategoryBar } from './components/CategoryBar.jsx';
import { GameGrid } from './components/GameGrid.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { PanicScreen } from './components/PanicScreen.jsx';
import { PanicSettingsModal } from './components/PanicSettingsModal.jsx';
import { JsonViewerModal } from './components/JsonViewerModal.jsx';
import { ChangelogModal, APP_VERSION } from './components/ChangelogModal.jsx';
import { ChatRoomModal } from './components/ChatRoomModal.jsx';
import { FloatingChatWidget } from './components/FloatingChatWidget.jsx';
import defaultGamesData from './data/games.json';
import { INITIAL_CHAT_MESSAGES, playChatChime } from './data/chatData.js';
import { Gamepad2, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';

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
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Chat sound setting
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const s = localStorage.getItem('ub_chat_sound');
      return s !== null ? JSON.parse(s) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ub_chat_sound', JSON.stringify(soundEnabled));
    } catch {}
  }, [soundEnabled]);

  // Stable Unique Client User ID for cross-device presence & identification
  const [userId] = useState(() => {
    try {
      let id = localStorage.getItem('ub_chat_user_id');
      if (!id) {
        id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('ub_chat_user_id', id);
      }
      return id;
    } catch {
      return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
  });

  // User chat profile
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('ub_chat_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const avatars = ['🎮', '⚡', '🤖', '👾', '🕶️', '🔥', '👑', '🚀', '🐱', '🐉'];
    const colors = ['#ef4444', '#38bdf8', '#34d399', '#c084fc', '#fbbf24', '#f472b6'];
    return {
      nickname: `CyberGamer_${randomSuffix}`,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      chatColor: colors[Math.floor(Math.random() * colors.length)],
      status: 'Playing NeoSphere 🎮'
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('ub_chat_profile', JSON.stringify(userProfile));
    } catch {}
  }, [userProfile]);

  // Real-time live messages list
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('ub_chat_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_CHAT_MESSAGES;
  });

  // Real-time online gamers list & count across all devices
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineCount, setOnlineCount] = useState(1);
  const [isServerConnected, setIsServerConnected] = useState(true);

  const lastServerFetchRef = useRef(0);

  // Sync messages to localStorage for offline cache
  useEffect(() => {
    try {
      localStorage.setItem('ub_chat_messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Reset chat messages handler
  const handleResetChat = () => {
    setMessages(INITIAL_CHAT_MESSAGES);
    try {
      localStorage.setItem('ub_chat_messages', JSON.stringify(INITIAL_CHAT_MESSAGES));
    } catch {}
  };

  // Unread messages count
  const unreadChatCount = useMemo(() => {
    if (isChatOpen) return 0;
    return messages.filter((m) => m && m.sender !== userProfile.nickname && !m.seen).length;
  }, [messages, isChatOpen, userProfile.nickname]);

  // Mark messages as seen when chat opens
  const handleOpenChat = () => {
    setIsChatOpen(true);
    setMessages((prev) =>
      prev.map((m) => (m?.seen ? m : { ...m, seen: true }))
    );
  };

  // Multi-Device Real-Time Sync Engine (HTTP Polling + SSE + BroadcastChannel)
  useEffect(() => {
    let isMounted = true;
    let sseSource = null;

    // 1. Initial & periodic message fetch
    const fetchLatestMessages = async () => {
      try {
        const res = await fetch('/api/chat/messages');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.messages) && isMounted) {
            setIsServerConnected(true);
            setOnlineCount(data.onlineCount || 1);
            if (data.onlineUsers) setOnlineUsers(data.onlineUsers);

            setMessages((prev) => {
              const prevMap = new Map(prev.map((m) => [m.id, m]));
              let hasNew = false;
              data.messages.forEach((serverMsg) => {
                if (!prevMap.has(serverMsg.id)) {
                  hasNew = true;
                  prevMap.set(serverMsg.id, serverMsg);
                } else {
                  // Merge reactions & fields
                  const existing = prevMap.get(serverMsg.id);
                  prevMap.set(serverMsg.id, { ...existing, ...serverMsg, seen: existing.seen ?? true });
                }
              });

              if (hasNew && soundEnabled && !document.hidden) {
                playChatChime('receive');
              }
              return Array.from(prevMap.values()).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
            });

            lastServerFetchRef.current = data.serverTime || Date.now();
          }
        }
      } catch (err) {
        // Fallback for purely offline mode
      }
    };

    // 2. Heartbeat to report this device presence
    const sendHeartbeat = async () => {
      try {
        const res = await fetch('/api/chat/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            nickname: userProfile.nickname,
            avatar: userProfile.avatar,
            chatColor: userProfile.chatColor,
            status: activeGame ? `Playing ${activeGame.title} 🎮` : userProfile.status,
            channel: 'general',
          }),
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.onlineCount) setOnlineCount(data.onlineCount);
          if (data.onlineUsers) setOnlineUsers(data.onlineUsers);
        }
      } catch (e) {}
    };

    fetchLatestMessages();
    sendHeartbeat();

    // 3. Connect to Server-Sent Events (SSE) stream for instantaneous pushes
    try {
      if (typeof window !== 'undefined' && 'EventSource' in window) {
        sseSource = new EventSource('/api/chat/stream');

        sseSource.addEventListener('NEW_MESSAGE', (event) => {
          try {
            const newMsg = JSON.parse(event.data);
            if (!newMsg || !isMounted) return;

            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              const next = [...prev, { ...newMsg, seen: isChatOpen || newMsg.sender === userProfile.nickname }];
              if (newMsg.sender !== userProfile.nickname && soundEnabled) {
                playChatChime('receive');
              }
              return next;
            });
          } catch (e) {}
        });

        sseSource.addEventListener('UPDATE_REACTION', (event) => {
          try {
            const { msgId, reactions } = JSON.parse(event.data);
            if (!msgId || !isMounted) return;
            setMessages((prev) =>
              prev.map((m) => (m.id === msgId ? { ...m, reactions } : m))
            );
          } catch (e) {}
        });

        sseSource.addEventListener('DELETE_MESSAGE', (event) => {
          try {
            const { id } = JSON.parse(event.data);
            if (!id || !isMounted) return;
            setMessages((prev) => prev.filter((m) => m.id !== id));
          } catch (e) {}
        });

        sseSource.onerror = () => {
          // SSE dropped or restricted by school filter, fallback to fast polling
          setIsServerConnected(false);
        };
      }
    } catch (e) {
      console.warn('SSE setup:', e);
    }

    // 4. Robust auto-polling timer (every 2.5s) to guarantee updates on school networks/Linewize
    const pollInterval = setInterval(() => {
      fetchLatestMessages();
    }, 2500);

    const heartbeatInterval = setInterval(() => {
      sendHeartbeat();
    }, 8000);

    // 5. Cross-tab BroadcastChannel
    let bc = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('neosphere_chat_channel');
        bc.onmessage = (event) => {
          const { type, payload } = event.data || {};
          if (type === 'NEW_MESSAGE' && payload) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === payload.id)) return prev;
              return [...prev, payload];
            });
            if (soundEnabled && payload.sender !== userProfile.nickname) {
              playChatChime('receive');
            }
          } else if (type === 'DELETE_MESSAGE' && payload?.id) {
            setMessages((prev) => prev.filter((m) => m.id !== payload.id));
          } else if (type === 'ADD_REACTION' && payload) {
            setMessages((prev) =>
              prev.map((m) => {
                if (m.id === payload.msgId) {
                  const reactions = { ...(m.reactions || {}) };
                  reactions[payload.emoji] = (reactions[payload.emoji] || 0) + 1;
                  return { ...m, reactions };
                }
                return m;
              })
            );
          }
        };
      }
    } catch (e) {}

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      clearInterval(heartbeatInterval);
      if (sseSource) sseSource.close();
      if (bc) {
        try {
          bc.close();
        } catch (e) {}
      }
    };
  }, [soundEnabled, userId, userProfile, activeGame, isChatOpen]);

  // Send new message handler (Multi-Device Broadcast & Server Persist)
  const handleSendMessage = async ({ text, channel, replyTo }) => {
    const formatTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    };

    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      channel: channel || 'general',
      sender: userProfile.nickname,
      avatar: userProfile.avatar,
      chatColor: userProfile.chatColor,
      status: userProfile.status,
      text,
      timestamp: formatTime(),
      createdAt: Date.now(),
      replyTo: replyTo || null,
      reactions: {},
      seen: true,
    };

    // Optimistic local add
    setMessages((prev) => [...prev, newMsg]);

    if (soundEnabled) {
      playChatChime('send');
    }

    // Broadcast to local tabs
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('neosphere_chat_channel');
        bc.postMessage({ type: 'NEW_MESSAGE', payload: newMsg });
        bc.close();
      }
    } catch (e) {}

    // POST to real-time server endpoint so all other school devices receive it!
    try {
      await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: newMsg.channel,
          sender: newMsg.sender,
          avatar: newMsg.avatar,
          chatColor: newMsg.chatColor,
          status: newMsg.status,
          text: newMsg.text,
          replyTo: newMsg.replyTo,
        }),
      });
    } catch (err) {
      console.warn('Network send error:', err);
    }
  };

  // Delete message handler
  const handleDeleteMessage = async (msgId) => {
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('neosphere_chat_channel');
        bc.postMessage({ type: 'DELETE_MESSAGE', payload: { id: msgId } });
        bc.close();
      }
    } catch {}

    try {
      await fetch(`/api/chat/messages/${msgId}`, { method: 'DELETE' });
    } catch (e) {}
  };

  // Reaction handler
  const handleAddReaction = async (msgId, emoji) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId) {
          const reactions = { ...(m.reactions || {}) };
          reactions[emoji] = (reactions[emoji] || 0) + 1;
          return { ...m, reactions };
        }
        return m;
      })
    );

    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('neosphere_chat_channel');
        bc.postMessage({ type: 'ADD_REACTION', payload: { msgId, emoji } });
        bc.close();
      }
    } catch {}

    try {
      await fetch('/api/chat/reaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msgId, emoji, user: userProfile.nickname }),
      });
    } catch (e) {}
  };

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
      const customGamesSaved = localStorage.getItem('ub_custom_games');
      const customGames = customGamesSaved ? JSON.parse(customGamesSaved) : [];
      
      const storedPlayCountsRaw = localStorage.getItem('ub_play_counts');
      const storedPlayCounts = storedPlayCountsRaw ? JSON.parse(storedPlayCountsRaw) : {};

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

    let bc = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('ub_plays_channel');
        bc.onmessage = (event) => {
          if (event.data?.type === 'UB_PLAY_COUNT_UPDATED' && event.data.gameId) {
            handleRemotePlayUpdate(event.data.gameId, event.data.newPlayCount);
          }
        };
      }
    } catch (e) {}

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
      if (bc) {
        try {
          bc.close();
        } catch (e) {}
      }
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

  // Play game handler
  const handlePlayGame = (gameToPlay) => {
    let updatedCount = 0;

    setGames((prevGames) => {
      const updatedGames = prevGames.map((g) => {
        if (g.id === gameToPlay.id) {
          updatedCount = (g.playCount || 0) + 1;
          return { ...g, playCount: updatedCount };
        }
        return g;
      });

      try {
        const storedRaw = localStorage.getItem('ub_play_counts');
        const stored = storedRaw ? JSON.parse(storedRaw) : {};
        stored[gameToPlay.id] = updatedCount;
        localStorage.setItem('ub_play_counts', JSON.stringify(stored));

        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
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

    try {
      const existingCustom = localStorage.getItem('ub_custom_games');
      const list = existingCustom ? JSON.parse(existingCustom) : [];
      localStorage.setItem('ub_custom_games', JSON.stringify([newGame, ...list]));
    } catch (err) {
      console.warn('LocalStorage custom games error:', err);
    }

    setIsAddModalOpen(false);
    setActiveGame(newGame);
  };

  // Filter games based on search, category, and favorites
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
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

      const matchesCategory =
        selectedCategory === 'All' || gameCategories.includes(selectedCategory);

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white relative">
      
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
        onOpenChat={handleOpenChat}
        unreadChatCount={unreadChatCount}
        onlineCount={onlineCount}
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
              className="ml-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-zinc-900 hover:bg-zinc-800 text-red-400 border border-zinc-800 hover:border-red-500/30 rounded-md transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-red-400" />
              <span>{APP_VERSION} Updates</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleOpenChat}
              className="hover:text-indigo-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-500" /> NeoSphere Lounge ({onlineCount} live)
            </button>
            <button
              onClick={() => setIsPanicSettingsOpen(true)}
              className="hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> Panic Mode Config
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Bottom-Right Chat Launcher */}
      <FloatingChatWidget
        onOpen={handleOpenChat}
        unreadCount={unreadChatCount}
        onlineCount={onlineCount}
      />

      {/* Multi-Device Multi-Room Chat Lounge Modal */}
      <ChatRoomModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        onSendMessage={handleSendMessage}
        onDeleteMessage={handleDeleteMessage}
        onAddReaction={handleAddReaction}
        onResetChat={handleResetChat}
        userProfile={userProfile}
        onUpdateProfile={(updates) => setUserProfile((prev) => ({ ...prev, ...updates }))}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onlineUsers={onlineUsers}
        onlineCount={onlineCount}
        isServerConnected={isServerConnected}
      />

      {/* Game Player Modal */}
      {activeGame && (
        <GamePlayer
          game={activeGame}
          isFavorite={favorites.includes(activeGame.id)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setActiveGame(null)}
          onOpenChat={handleOpenChat}
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
