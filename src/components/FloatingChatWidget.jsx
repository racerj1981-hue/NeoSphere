import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';

export const FloatingChatWidget = ({ onOpen, unreadCount, onlineCount = 8 }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 select-none group">
      {/* Tooltip hint on hover */}
      <div className="hidden group-hover:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 shadow-xl animate-fadeIn">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>NeoSphere Lounge ({onlineCount} online)</span>
      </div>

      {/* Floating Action Button */}
      <button
        id="floating-chat-button"
        onClick={onOpen}
        className="relative px-4 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-indigo-600 to-indigo-700 hover:from-red-500 hover:to-indigo-500 text-white font-bold shadow-2xl shadow-indigo-600/40 border border-indigo-400/40 flex items-center gap-2.5 transition-all duration-300 transform hover:scale-105 active:scale-95"
        title="Open Multi-Room Chat Lounge"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2.5 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-mono font-extrabold border-2 border-zinc-950 shadow-md animate-bounce">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <span className="text-xs tracking-wide hidden sm:inline">Lounge</span>
      </button>
    </div>
  );
};
