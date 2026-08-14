import React from 'react';
import { X, Sparkles, Tag, GitCommit, CheckCircle2 } from 'lucide-react';

export const APP_VERSION = 'v2.14.0';

export const ChangelogModal = ({ onClose }) => {
  const versions = [
    {
      version: 'v2.14.0',
      date: 'August 14, 2026',
      tag: 'Latest Release',
      changes: [
        'Removed the Featured Unblocked Highlight banner for a cleaner, full-width game catalog layout.'
      ]
    },
    {
      version: 'v2.13.0',
      date: 'August 14, 2026',
      changes: [
        'Added Linewize & School Filter Safe games: Cyber Slope 3D and Cyber Flap.',
        'Zero external domain requests: built with 100% local canvas rendering & real-time Web Audio API sound synthesis.',
        'Added "LINEWIZE SAFE" verified shield badge across game cards.'
      ]
    },
    {
      version: 'v2.12.0',
      date: 'August 13, 2026',
      changes: [
        'Added "Made by Jace" creator branding to the main header and footer.'
      ]
    },
    {
      version: 'v2.11.0',
      date: 'August 13, 2026',
      changes: [
        'Added new game: Stickman Hook — swing through dynamic courses using grappling momentum and physics acrobatic jumps.'
      ]
    },
    {
      version: 'v2.10.0',
      date: 'August 13, 2026',
      changes: [
        'Removed the Recently Played shelf and history tracking to streamline the home interface.'
      ]
    },
    {
      version: 'v2.9.0',
      date: 'August 13, 2026',
      changes: [
        'Removed the Arcade category filter button from the navigation category bar.'
      ]
    },
    {
      version: 'v2.8.0',
      date: 'August 13, 2026',
      changes: [
        'Updated Slope game thumbnail to custom neon grid art.'
      ]
    },
    {
      version: 'v2.7.0',
      date: 'August 13, 2026',
      changes: [
        'Added new game: Slope — high-speed 3D endless obstacle runner with responsive controls and full sandbox support.'
      ]
    },
    {
      version: 'v2.6.0',
      date: 'August 13, 2026',
      changes: [
        'Restored the original signature NeoSphere glowing concentric red gradient orb icon in the header and footer while keeping custom website tab favicon.'
      ]
    },
    {
      version: 'v2.5.0',
      date: 'August 13, 2026',
      changes: [
        'Updated Geometry Dash Lite controls list to remove the Pause shortcut key reference.'
      ]
    },
    {
      version: 'v2.4.0',
      date: 'August 13, 2026',
      changes: [
        'Removed redundant Done Settings button in Panic Mode settings modal while preserving top X close trigger.'
      ]
    },
    {
      version: 'v2.3.0',
      date: 'August 13, 2026',
      changes: [
        'Updated Geometry Dash Lite game cover art and expanded description with level details.',
        'Customized website branding with new favicon, browser tab icon, and header logo icon.',
        'Enhanced image resilience with automatic fallback handlers across all game components.'
      ]
    },
    {
      version: 'v2.2.0',
      date: 'August 13, 2026',
      changes: [
        'Added "Recently Played" quick-launch shelf with game history and instant resume.',
        'Removed the Surprise Me random launcher button for a cleaner toolbar.'
      ]
    },
    {
      version: 'v2.1.0',
      date: 'August 12, 2026',
      changes: [
        'Added "Surprise Me 🎲" random game launcher button in top header menu.'
      ]
    },
    {
      version: 'v1.8.4',
      date: 'August 12, 2026',
      changes: [
        'Removed "Copy Iframe Code" button from game player modal.'
      ]
    },
    {
      version: 'v1.8.3',
      date: 'August 12, 2026',
      changes: [
        'Removed "Inspect games.json" button from the bottom right footer.'
      ]
    },
    {
      version: 'v1.8.2',
      date: 'August 12, 2026',
      changes: [
        'Removed redundant "Release Notes" link from the bottom right footer.'
      ]
    },
    {
      version: 'v1.8.1',
      date: 'August 12, 2026',
      changes: [
        'Removed the bottom Close button in Version History modal while keeping top X close icon.'
      ]
    },
    {
      version: 'v1.8.0',
      date: 'August 12, 2026',
      changes: [
        'Rebranded platform header and footer cleanly to "NeoSphere".',
        'Updated Geometry Dash Lite artwork thumbnail to custom high-res poster image.',
        'Extended version history connecting lines across all release nodes.',
        'Optimized GitHub Actions deployment workflow for Node.js 22.'
      ]
    },
    {
      version: 'v1.7.2',
      date: 'August 12, 2026',
      changes: [
        'Fixed card hover animation subpixel rendering issue and white line flicker artifact.',
        'Added solid background color on HTML root element and GPU transform isolation.'
      ]
    },
    {
      version: 'v1.7.1',
      date: 'August 12, 2026',
      changes: [
        'Removed Sandboxed Iframe badge text from game player interface for a cleaner UI.'
      ]
    },
    {
      version: 'v1.7.0',
      date: 'August 12, 2026',
      changes: [
        'Persistent Local Play Counts: Every play increment is saved in local browser storage.',
        'Real-time Cross-Tab Sync: Plays update live across all open tabs & windows via BroadcastChannel.',
        'Updated Game Header: Displaying live play counter inside the game player header bar.'
      ]
    },
    {
      version: 'v1.6.0',
      date: 'August 12, 2026',
      changes: [
        'Removed the Linwize unblocked native game per user request.',
        'Cleaned up game catalog data and player bundle.'
      ]
    },
    {
      version: 'v1.5.0',
      date: 'August 12, 2026',
      changes: [
        'Added Cyber Defender 2099 — 100% Native Offline HTML5 game built specifically to bypass Linwize & Hapara school filters.',
        'Zero external domain/iframe network requests — guaranteed unblocked on Chromebooks.',
        'Added Web Audio API procedural sound synthesizer and particle explosion engine.',
        'Built-in quick stealth disguise overlay toggle inside game (press ESC or ~ tilde).'
      ]
    },
    {
      version: 'v1.4.0',
      date: 'August 12, 2026',
      changes: [
        'Added instant Website Exit & Close option when triggering Panic (ESC key).',
        'Added customizable Panic exit destinations (Google Search, Classroom, or about:blank).',
        'Added persistent user preferences for Panic mode and tab cloaking.',
        'Added automatic version tracking in header & footer.'
      ]
    },
    {
      version: 'v1.3.0',
      date: 'August 11, 2026',
      changes: [
        'Added visible Website Version badge in Header and Footer.',
        'Added Version & Changelog release tracker modal.',
        'Added Chromebook Linewize stealth Cloaker (Classroom, Docs, Canvas, Drive tab disguises).',
        'Added About:Blank popup window launcher to hide game URL address history.',
        'Added live exact Game Play Counters on cards (e.g. 3,850 plays).'
      ]
    },
    {
      version: 'v1.2.0',
      date: 'August 10, 2026',
      changes: [
        'Updated Favorites counter badge to always display active favorited items count.',
        'Added Category filtering and live search query matching.',
        'Improved iframe sandbox security and fullscreen capability.'
      ]
    },
    {
      version: 'v1.1.0',
      date: 'August 08, 2026',
      changes: [
        'Added Instant Panic Disguise Mode triggered by Escape key (ESC).',
        'Added customizable Panic screens (Google Docs, Classroom, Wikipedia).',
        'Added custom Game import modal via iframe link.'
      ]
    },
    {
      version: 'v1.0.0',
      date: 'August 01, 2026',
      changes: [
        'Initial launch of NeoSphere Arcade Portal.',
        'Embedded retro & modern unblocked iframe games catalog.'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="bg-zinc-900 px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Version History</h2>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30 rounded-full">
                  {APP_VERSION}
                </span>
              </div>
              <p className="text-xs text-zinc-400">Release updates & change logs</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs">
          <div className="space-y-6">
            {versions.map((item, index) => (
              <div key={item.version} className="relative pl-6 space-y-2">
                {/* Connecting Line from this ball to the next ball (or extending down for v1.0.0) */}
                <div
                  className={`absolute left-[6px] top-3 w-0.5 bg-zinc-700/80 z-0 ${
                    index === versions.length - 1 ? 'h-10' : '-bottom-6'
                  }`}
                />

                {/* Timeline Dot / Ball */}
                <div
                  className={`absolute left-0 top-1 z-10 w-3.5 h-3.5 rounded-full border transition-all ${
                    index === 0
                      ? 'bg-red-500 border-red-400 shadow-md shadow-red-500/50 ring-2 ring-zinc-950'
                      : 'bg-zinc-700 border-zinc-400 shadow-sm ring-2 ring-zinc-950 hover:border-zinc-200 hover:bg-zinc-600'
                  }`}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-sm text-white">{item.version}</span>
                    {item.tag && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">{item.date}</span>
                </div>

                <ul className="space-y-1.5 pt-1 text-zinc-300">
                  {item.changes.map((change, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-2 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-900/60 border-t border-zinc-800 flex justify-center items-center text-xs">
          <span className="text-zinc-500 font-mono">Current Build: {APP_VERSION}</span>
        </div>

      </div>
    </div>
  );
};
