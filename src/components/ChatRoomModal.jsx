import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Smile, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  X, 
  Hash, 
  Users, 
  Sparkles, 
  Settings, 
  Trash2, 
  Copy, 
  Check, 
  Reply, 
  Minimize2, 
  Maximize2,
  BookOpen,
  Pin,
  Search,
  RotateCcw,
  Bot,
  Radio,
  Wifi
} from 'lucide-react';
import { ONLINE_MEMBERS } from '../data/chatData.js';

const CHANNELS = [
  { id: 'general', name: 'general', desc: 'Main NeoSphere live gaming hangout & chat', icon: '💬' },
  { id: 'game-tips', name: 'game-tips', desc: 'Secret tricks, high scores & walkthroughs', icon: '🎮' },
  { id: 'paper-io-2', name: 'paper-io-2', desc: 'Paper.io 2 territory domination strats', icon: '⚡' },
  { id: 'stealth-mode', name: 'stealth-mode', desc: 'Linewize bypasses & school stealth lifehacks', icon: '🛡️' },
  { id: 'off-topic', name: 'off-topic', desc: 'Casual memes, jokes and after-school talk', icon: '🎲' },
];

const AVATARS = ['🎮', '⚡', '🤖', '👾', '🕶️', '🔥', '👑', '🚀', '🐱', '🛡️', '💎', '🐉'];

const COLOR_THEMES = [
  { name: 'Cyber Red', color: '#ef4444' },
  { name: 'Neon Blue', color: '#38bdf8' },
  { name: 'Emerald', color: '#34d399' },
  { name: 'Electric Violet', color: '#c084fc' },
  { name: 'Solar Amber', color: '#fbbf24' },
  { name: 'Rose Pink', color: '#f472b6' },
];

const EMOJI_PICKER = ['🔥', '👑', '🚀', '💀', '❤️', '😂', '🎮', '💯', '✨', '⚡', '👀', '👍'];

// Fake study notes for instant Stealth Disguise
const DISGUISE_NOTES = [
  { user: 'Mr. Davis (Teacher)', time: '8:45 AM', text: 'Please review Chapter 4: Quadratic equations and complete questions 1-15 for homework.' },
  { user: 'Sarah Miller', time: '8:52 AM', text: 'Does anyone understand problem #7 on the worksheet about graphing parabolas?' },
  { user: 'Alex Chen', time: '9:05 AM', text: 'You need to find the vertex first: x = -b / (2a), then plug x back into the equation to get y.' },
  { user: 'Emily Watson', time: '9:12 AM', text: 'Thanks Alex! Also remember the Google Classroom doc submission deadline is 11:59 PM tonight.' },
  { user: 'Marcus Vance', time: '9:20 AM', text: 'Group 3 biology lab report outline has been shared to everyone\'s Google Drive.' }
];

export const ChatRoomModal = ({
  isOpen,
  onClose,
  messages = [],
  onSendMessage,
  onDeleteMessage,
  onAddReaction,
  onResetChat,
  userProfile,
  onUpdateProfile,
  soundEnabled,
  onToggleSound,
  onlineUsers = [],
  onlineCount = 1,
  isServerConnected = true,
}) => {
  const [activeChannel, setActiveChannel] = useState('general');
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showMembersList, setShowMembersList] = useState(false);
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [isDisguised, setIsDisguised] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of active channel messages
  const scrollToBottom = () => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {}
  };

  useEffect(() => {
    if (isOpen && !isDisguised) {
      scrollToBottom();
    }
  }, [messages, activeChannel, isOpen, isDisguised]);

  // Focus input on channel switch or open
  useEffect(() => {
    if (isOpen && !showProfileSettings && !isDisguised) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, activeChannel, showProfileSettings, isDisguised]);

  if (!isOpen) return null;

  const safeMessages = Array.isArray(messages) ? messages : [];

  // Filter messages by channel & search query
  const channelMessages = safeMessages.filter((m) => {
    if (!m) return false;
    const inChan = (m.channel || 'general') === activeChannel;
    if (!inChan) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (m.text && m.text.toLowerCase().includes(q)) ||
      (m.sender && m.sender.toLowerCase().includes(q))
    );
  });

  const handleSend = (e) => {
    if (e) e.preventDefault();
    const textToSend = inputText.trim();
    if (!textToSend) return;

    onSendMessage({
      text: textToSend,
      channel: activeChannel,
      replyTo: replyingTo ? { id: replyingTo.id, sender: replyingTo.sender, text: replyingTo.text } : null,
    });

    setInputText('');
    setReplyingTo(null);
    setShowEmojiBar(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyMessage = (msg) => {
    if (!msg?.text) return;
    try {
      navigator.clipboard.writeText(msg.text);
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {}
  };

  const handleQuickInsertText = (text) => {
    setInputText((prev) => prev + text);
    inputRef.current?.focus();
  };

  const activeChannelInfo = CHANNELS.find((c) => c.id === activeChannel) || CHANNELS[0];

  // Combined real connected peers + virtual community members
  const remotePeers = onlineUsers.filter(u => u.nickname !== userProfile.nickname);
  const totalLiveGamers = Math.max(onlineCount, remotePeers.length + 1, ONLINE_MEMBERS.length);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div 
        className={`w-full bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl transition-all duration-200 ${
          isExpanded ? 'max-w-6xl h-[92vh]' : 'max-w-4xl h-[84vh]'
        }`}
      >
        {/* Top Header Bar */}
        <div className={`px-4 py-3 border-b flex items-center justify-between gap-3 select-none transition-colors ${
          isDisguised 
            ? 'bg-emerald-950/90 border-emerald-800/60 text-emerald-200' 
            : 'bg-zinc-900 border-zinc-800 text-zinc-100'
        }`}>
          {isDisguised ? (
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-sm text-emerald-100 flex items-center gap-2">
                  <span>Period 3 Algebra & Science Study Workspace</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-800/60 text-emerald-300 font-mono">Google Classroom Sync</span>
                </h3>
                <p className="text-[11px] text-emerald-400/80">Class Notes & Homework Discussion Board</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-red-600/20 text-lg">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                    <span>NeoSphere</span>
                    <span className="text-red-500 font-bold">Lounge</span>
                  </h3>
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live ({totalLiveGamers} Online)</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-emerald-300 flex items-center gap-0.5">
                      <Wifi className="w-2.5 h-2.5 text-emerald-400" /> Cross-School Sync
                    </span>
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <span>#{activeChannelInfo.name}</span>
                  <span>•</span>
                  <span className="truncate max-w-[180px] sm:max-w-xs">{activeChannelInfo.desc}</span>
                </p>
              </div>
            </div>
          )}

          {/* Action Tools */}
          <div className="flex items-center gap-1.5">
            {/* Stealth Disguise Button */}
            <button
              onClick={() => setIsDisguised(!isDisguised)}
              title={isDisguised ? "Exit Classroom Disguise" : "Instant Study Group Disguise (Hides game chat)"}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                isDisguised 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400' 
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700 hover:border-emerald-500/40 hover:text-emerald-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{isDisguised ? 'Exit Disguise' : 'Stealth Disguise'}</span>
            </button>

            {!isDisguised && (
              <>
                {/* Toggle Online Members List */}
                <button
                  onClick={() => setShowMembersList(!showMembersList)}
                  title="View Live Online Gamers across devices"
                  className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-xs font-semibold ${
                    showMembersList 
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300' 
                      : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                  }`}
                >
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span className="hidden sm:inline text-xs">{totalLiveGamers}</span>
                </button>

                {/* Sound Toggle */}
                <button
                  onClick={onToggleSound}
                  title={soundEnabled ? "Disable message chime sound" : "Enable message chime sound"}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 transition-colors"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
                </button>

                {/* Profile Settings */}
                <button
                  onClick={() => {
                    setShowProfileSettings(!showProfileSettings);
                    if (!showProfileSettings) setShowMembersList(false);
                  }}
                  title="Customize Gamer Tag, Avatar & Chat Theme"
                  className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-xs font-semibold ${
                    showProfileSettings 
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300' 
                      : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                  }`}
                >
                  <span className="text-sm">{userProfile.avatar}</span>
                  <Settings className="w-3.5 h-3.5" />
                </button>

                {/* Reset Chat Button */}
                {onResetChat && (
                  <button
                    onClick={onResetChat}
                    title="Reset Chat Messages"
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Expand / Minimize Modal Toggle */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Collapse" : "Expand size"}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 transition-colors hidden md:block"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </>
            )}

            {/* Close Modal */}
            <button
              onClick={onClose}
              title="Close Chat"
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950 hover:border-red-500/40 hover:text-red-200 border border-zinc-700 text-zinc-400 transition-all ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Disguise Body View */}
        {isDisguised ? (
          <div className="flex-1 bg-zinc-900 p-6 overflow-y-auto font-sans text-zinc-200 space-y-4">
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
              <span>📚 Viewing Shared Study Notes. Click "Exit Disguise" at the top to return to NeoSphere Lounge.</span>
            </div>
            <div className="space-y-3">
              {DISGUISE_NOTES.map((note, i) => (
                <div key={i} className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                    <span className="font-semibold text-emerald-400">{note.user}</span>
                    <span className="text-[10px] font-mono">{note.time}</span>
                  </div>
                  <p className="text-sm text-zinc-200">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Normal Chat Body */
          <div className="flex-1 flex overflow-hidden">
            
            {/* Left Channel Sidebar */}
            <div className="w-44 sm:w-52 bg-zinc-950/90 border-r border-zinc-800/80 flex flex-col justify-between shrink-0">
              <div className="p-3 space-y-3 overflow-y-auto">
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-2 flex items-center justify-between">
                  <span>Channels ({CHANNELS.length})</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Server Live" />
                </div>

                <div className="space-y-1">
                  {CHANNELS.map((chan) => {
                    const isActive = activeChannel === chan.id;
                    const chanUnread = safeMessages.filter(
                      (m) => (m.channel || 'general') === chan.id && m.sender !== userProfile.nickname && !m.seen
                    ).length;

                    return (
                      <button
                        key={chan.id}
                        onClick={() => {
                          setActiveChannel(chan.id);
                          setShowProfileSettings(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                            : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-sm">{chan.icon}</span>
                          <span className="truncate">#{chan.name}</span>
                        </div>
                        {chanUnread > 0 && !isActive && (
                          <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-mono font-bold">
                            {chanUnread}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* User Profile Mini Bar at bottom of sidebar */}
              <div className="p-3 border-t border-zinc-800/80 bg-zinc-900/50 flex items-center justify-between gap-2">
                <div 
                  className="flex items-center gap-2 truncate cursor-pointer group flex-1"
                  onClick={() => setShowProfileSettings(true)}
                  title="Click to edit profile"
                >
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm group-hover:scale-105 transition-transform shrink-0">
                    {userProfile.avatar}
                  </div>
                  <div className="truncate text-left">
                    <p className="text-xs font-bold text-zinc-200 truncate group-hover:text-indigo-400 transition-colors" style={{ color: userProfile.chatColor }}>
                      {userProfile.nickname}
                    </p>
                    <p className="text-[10px] text-zinc-500 truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      <span>{userProfile.status || 'Online'}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-zinc-900/40 relative overflow-hidden">
              
              {/* Channel Subheader / Search */}
              <div className="px-4 py-2 bg-zinc-950/60 border-b border-zinc-800/60 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
                  <Hash className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-bold text-zinc-200">{activeChannelInfo.name}</span>
                  <span className="hidden sm:inline text-[10px] text-zinc-500 font-mono">
                    (Multi-User Live)
                  </span>
                </div>

                {/* Message Search Bar */}
                <div className="relative max-w-[180px] sm:max-w-xs w-full">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search channel..."
                    className="w-full pl-7 pr-3 py-1 text-[11px] bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Profile Settings Drawer */}
              {showProfileSettings ? (
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-zinc-950/80 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Settings className="w-4 h-4 text-indigo-400" />
                      <span>Customize Your Chat Identity</span>
                    </h4>
                    <button
                      onClick={() => setShowProfileSettings(false)}
                      className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800"
                    >
                      Done
                    </button>
                  </div>

                  {/* Nickname Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Gamer Nickname (Visible to all players)</label>
                    <input
                      type="text"
                      maxLength={18}
                      value={userProfile.nickname}
                      onChange={(e) => onUpdateProfile({ nickname: e.target.value.trim() || 'NeoGamer' })}
                      className="w-full px-3.5 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  {/* Status message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Status Message</label>
                    <select
                      value={userProfile.status}
                      onChange={(e) => onUpdateProfile({ status: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Playing NeoSphere 🎮">Playing NeoSphere 🎮</option>
                      <option value="Paper.io 2 Grinding ⚡">Paper.io 2 Grinding ⚡</option>
                      <option value="In Class (Stealth Mode) 🤫">In Class (Stealth Mode) 🤫</option>
                      <option value="Looking for Teammates 🚀">Looking for Teammates 🚀</option>
                      <option value="AFK / Lurking 💤">AFK / Lurking 💤</option>
                    </select>
                  </div>

                  {/* Avatar Picker */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Choose Avatar Icon</label>
                    <div className="grid grid-cols-6 gap-2">
                      {AVATARS.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => onUpdateProfile({ avatar: av })}
                          className={`h-11 rounded-xl text-xl flex items-center justify-center transition-all border ${
                            userProfile.avatar === av
                              ? 'bg-indigo-600/30 border-indigo-500 scale-105 shadow-md shadow-indigo-600/20'
                              : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Theme Picker */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Gamer Tag Color Theme</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {COLOR_THEMES.map((theme) => (
                        <button
                          key={theme.name}
                          type="button"
                          onClick={() => onUpdateProfile({ chatColor: theme.color })}
                          className={`p-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                            userProfile.chatColor === theme.color
                              ? 'bg-zinc-800 border-indigo-500 ring-2 ring-indigo-500/30'
                              : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.color }} />
                          <span className="text-[10px] text-zinc-400">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : showMembersList ? (
                /* Online Members View across all real devices */
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-zinc-950/80 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-400" />
                      <span>Live Arcade Gamers ({totalLiveGamers})</span>
                    </h4>
                    <button
                      onClick={() => setShowMembersList(false)}
                      className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800"
                    >
                      Back to Chat
                    </button>
                  </div>

                  {/* Current User */}
                  <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-indigo-500/60 flex items-center justify-center text-lg">
                        {userProfile.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm" style={{ color: userProfile.chatColor }}>{userProfile.nickname}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">YOU (THIS DEVICE)</span>
                        </div>
                        <p className="text-xs text-zinc-400">{userProfile.status}</p>
                      </div>
                    </div>
                  </div>

                  {/* Real Connected Remote Devices */}
                  {remotePeers.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Connected Peers ({remotePeers.length})</span>
                      </p>
                      {remotePeers.map((peer) => (
                        <div
                          key={peer.id}
                          onClick={() => {
                            handleQuickInsertText(`@${peer.nickname} `);
                            setShowMembersList(false);
                          }}
                          className="p-2.5 rounded-xl bg-zinc-900 border border-emerald-500/30 hover:border-emerald-400 flex items-center justify-between cursor-pointer transition-all group"
                          title={`Click to tag @${peer.nickname}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-base">
                              {peer.avatar || '🎮'}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs group-hover:underline" style={{ color: peer.chatColor || '#38bdf8' }}>{peer.nickname}</span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-800">ONLINE</span>
                              </div>
                              <p className="text-[11px] text-zinc-400">{peer.status || 'Playing NeoSphere'}</p>
                            </div>
                          </div>
                          <span className="text-[11px] text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            Tag @
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Virtual Community Helpers */}
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Community & Guides</p>
                    {ONLINE_MEMBERS.map((member) => (
                      <div 
                        key={member.name}
                        onClick={() => {
                          handleQuickInsertText(`@${member.name} `);
                          setShowMembersList(false);
                        }}
                        className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-indigo-500/40 hover:bg-zinc-900 flex items-center justify-between cursor-pointer transition-all group"
                        title={`Click to tag @${member.name}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-base">
                            {member.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs group-hover:underline" style={{ color: member.chatColor }}>{member.name}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">{member.badge}</span>
                            </div>
                            <p className="text-[11px] text-zinc-500">{member.status}</p>
                          </div>
                        </div>
                        <span className="text-[11px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          Tag @
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Messages Stream */
                <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
                  {/* Channel Welcome Banner */}
                  <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl mb-4 text-center space-y-1">
                    <span className="text-2xl">{activeChannelInfo.icon}</span>
                    <h4 className="text-sm font-extrabold text-zinc-100">Welcome to #{activeChannelInfo.name}!</h4>
                    <p className="text-xs text-zinc-400">{activeChannelInfo.desc}</p>
                    <p className="text-[10px] text-indigo-400 font-mono pt-1">
                      💡 Real-time live multi-user chat. Messages sent here appear immediately on all other devices & computers!
                    </p>
                  </div>

                  {channelMessages.length === 0 ? (
                    <div className="py-12 text-center text-zinc-500 text-xs">
                      No messages in #{activeChannelInfo.name} yet. Send a message to start chatting with other players!
                    </div>
                  ) : (
                    channelMessages.map((msg) => {
                      const isMe = msg.sender === userProfile.nickname;

                      return (
                        <div 
                          key={msg.id} 
                          className={`group flex items-start gap-2.5 transition-all ${
                            isMe ? 'flex-row-reverse' : 'flex-row'
                          }`}
                        >
                          {/* Avatar */}
                          <div 
                            className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm shrink-0 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => handleQuickInsertText(`@${msg.sender} `)}
                            title={`Click to @tag ${msg.sender}`}
                          >
                            {msg.avatar || '🎮'}
                          </div>

                          {/* Message Bubble Container */}
                          <div className={`max-w-[85%] sm:max-w-[75%] space-y-1 ${isMe ? 'items-end text-right' : 'items-start text-left'}`}>
                            {/* Sender Info & Timestamp */}
                            <div className={`flex items-center gap-1.5 text-[11px] ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <span 
                                className="font-bold cursor-pointer hover:underline"
                                style={{ color: msg.chatColor || '#38bdf8' }}
                                onClick={() => handleQuickInsertText(`@${msg.sender} `)}
                              >
                                {msg.sender}
                              </span>
                              {msg.badge && (
                                <span className="px-1.5 py-0.2 rounded bg-indigo-600/30 text-indigo-300 text-[9px] font-mono uppercase font-bold border border-indigo-500/30">
                                  {msg.badge}
                                </span>
                              )}
                              <span className="text-zinc-500 text-[10px] font-mono">{msg.timestamp || 'Just now'}</span>
                            </div>

                            {/* Replied Message Context Preview */}
                            {msg.replyTo && (
                              <div className={`px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800/80 text-[10px] text-zinc-400 flex items-center gap-1.5 mb-1 ${
                                isMe ? 'border-r-2 border-r-indigo-500' : 'border-l-2 border-l-indigo-500'
                              }`}>
                                <Reply className="w-3 h-3 text-indigo-400 shrink-0" />
                                <span className="font-semibold text-zinc-300">{msg.replyTo.sender}:</span>
                                <span className="truncate">{msg.replyTo.text}</span>
                              </div>
                            )}

                            {/* Message Text Bubble */}
                            <div 
                              className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed break-words relative shadow-md transition-all ${
                                isMe
                                  ? 'bg-indigo-600 text-white rounded-tr-none'
                                  : 'bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-tl-none'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{msg.text}</p>

                              {/* Hover Message Action Bar */}
                              <div className={`absolute top-1 hidden group-hover:flex items-center gap-0.5 bg-zinc-900 border border-zinc-700 px-1 py-0.5 rounded-lg shadow-lg z-10 ${
                                isMe ? 'right-full mr-1.5' : 'left-full ml-1.5'
                              }`}>
                                <button
                                  onClick={() => setReplyingTo(msg)}
                                  title="Reply to message"
                                  className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded"
                                >
                                  <Reply className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleCopyMessage(msg)}
                                  title="Copy text"
                                  className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded"
                                >
                                  {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                                <button
                                  onClick={() => onAddReaction(msg.id, '🔥')}
                                  title="React Fire"
                                  className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded text-[11px]"
                                >
                                  🔥
                                </button>
                                <button
                                  onClick={() => onAddReaction(msg.id, '👑')}
                                  title="React Crown"
                                  className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded text-[11px]"
                                >
                                  👑
                                </button>
                                {isMe && (
                                  <button
                                    onClick={() => onDeleteMessage(msg.id)}
                                    title="Delete message"
                                    className="p-1 hover:bg-red-950 text-zinc-400 hover:text-red-400 rounded"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Message Reactions Badges */}
                            {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                              <div className={`flex flex-wrap gap-1 pt-0.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                {Object.entries(msg.reactions).map(([emoji, count]) => (
                                  <button
                                    key={emoji}
                                    onClick={() => onAddReaction(msg.id, emoji)}
                                    className="px-2 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 hover:border-indigo-500/50 text-[10px] font-mono text-zinc-300 flex items-center gap-1 transition-all"
                                  >
                                    <span>{emoji}</span>
                                    <span className="text-indigo-400 font-bold">{count}</span>
                                  </button>
                                ))}
                              </div>
                            )}

                          </div>
                        </div>
                      );
                    })
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Replying Context Bar */}
              {replyingTo && !showProfileSettings && !showMembersList && (
                <div className="px-4 py-1.5 bg-indigo-950/60 border-t border-indigo-800/40 text-xs flex items-center justify-between text-indigo-200">
                  <div className="flex items-center gap-1.5 truncate">
                    <Reply className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Replying to <strong className="text-white">{replyingTo.sender}</strong>:</span>
                    <span className="italic truncate max-w-xs text-zinc-400">"{replyingTo.text}"</span>
                  </div>
                  <button 
                    onClick={() => setReplyingTo(null)}
                    className="p-0.5 hover:bg-indigo-900 rounded text-zinc-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Emoji Quick Picker Row */}
              {showEmojiBar && !showProfileSettings && !showMembersList && (
                <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2 overflow-x-auto select-none">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Quick Emojis:</span>
                  {EMOJI_PICKER.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleQuickInsertText(emoji)}
                      className="p-1 hover:bg-zinc-800 rounded-lg text-base hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Message Input Bar */}
              {!showProfileSettings && !showMembersList && (
                <form 
                  onSubmit={handleSend}
                  className="p-3 bg-zinc-950 border-t border-zinc-800/80 flex items-center gap-2"
                >
                  {/* Emoji Bar Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowEmojiBar(!showEmojiBar)}
                    className={`p-2 rounded-xl border transition-colors ${
                      showEmojiBar
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800'
                    }`}
                    title="Toggle Emojis"
                  >
                    <Smile className="w-4 h-4" />
                  </button>

                  {/* Input Box */}
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`Message #${activeChannelInfo.name}... (Press Enter to send live)`}
                      maxLength={400}
                      autoComplete="off"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans"
                    />
                  </div>

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className={`p-2.5 rounded-xl font-bold flex items-center justify-center transition-all ${
                      inputText.trim()
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 active:scale-95 cursor-pointer'
                        : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                    }`}
                    title="Send Message to all connected players"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
