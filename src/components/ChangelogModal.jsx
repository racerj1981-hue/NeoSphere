import React from 'react';
import { X, Sparkles, Tag, GitCommit, CheckCircle2 } from 'lucide-react';

export const APP_VERSION = 'v2.46.0';

export const ChangelogModal = ({ onClose }) => {
  const versions = [
    {
      version: 'v2.46.0',
      date: 'August 16, 2026',
      tag: 'Latest Release',
      changes: [
        'Updated Drift Boss cover artwork to the requested icon.'
      ]
    },
    {
      version: 'v2.45.0',
      date: 'August 16, 2026',
      changes: [
        'Added authentic unblocked Drift Boss (MarketJS) 3D timing & drifting game with full vehicle unlocks, powerups, and sound effects.',
        '100% self-hosted locally inside the hub — completely unblockable and safe on Linewize, Securly, and school networks.',
        'Bundled official 512px Drift Boss cover artwork with Driving, Arcade, and Action category filtering.'
      ]
    },
    {
      version: 'v2.44.0',
      date: 'August 16, 2026',
      changes: [
        'Added authentic unblocked Moto X3M (MadPuffers) physics stunt bike racing game with 25+ obstacle courses, loop-de-loops, and nitro boosts.',
        '100% self-hosted locally inside the hub — completely unblockable and safe on Linewize, Securly, and school networks.',
        'Bundled official 512px Moto X3M cover artwork and integrated Driving / Action category navigation.'
      ]
    },
    {
      version: 'v2.43.0',
      date: 'August 16, 2026',
      changes: [
        'Updated Hole.io cover artwork to the requested icon.'
      ]
    },
    {
      version: 'v2.42.0',
      date: 'August 16, 2026',
      changes: [
        'Added authentic unblocked Hole.io (VOODOO) 3D multiplayer black hole game with full city destruction mechanics.',
        '100% offline self-hosted locally inside the hub — completely immune to Linewize, Securly, and school network filters.',
        'Bundled official 512px Hole.io cover artwork and added dedicated "Multiplayer" category navigation tab.'
      ]
    },
    {
      version: 'v2.41.0',
      date: 'August 16, 2026',
      changes: [
        'Added "Retro" category to Block Blast! for classic arcade & retro puzzle filtering.'
      ]
    },
    {
      version: 'v2.40.0',
      date: 'August 16, 2026',
      changes: [
        'Added authentic unblocked Block Blast! puzzle game (Hungry Studio) featuring full 8x8 grid mechanics, endless mode, combos, sound effects, and Linewize school-filter compatibility.',
        'Bundled high-definition 512px Block Blast artwork locally with instant cache-busting.'
      ]
    },
    {
      version: 'v2.39.0',
      date: 'August 16, 2026',
      changes: [
        'Updated Drive Mad cover artwork to the requested high-definition 3D monster truck logo icon.'
      ]
    },
    {
      version: 'v2.38.0',
      date: 'August 16, 2026',
      changes: [
        'Added "Puzzle" category to both Drive Mad and Stickman Hook for physics puzzle navigation.',
        'Added "Driving" category to Drive Mad for dedicated vehicle game filtering.'
      ]
    },
    {
      version: 'v2.37.0',
      date: 'August 16, 2026',
      changes: [
        'Updated Request Games cover artwork to the requested official Google Forms icon.'
      ]
    },
    {
      version: 'v2.36.0',
      date: 'August 16, 2026',
      changes: [
        'Updated Slope cover artwork to the requested high-definition Slope icon.'
      ]
    },
    {
      version: 'v2.35.0',
      date: 'August 16, 2026',
      changes: [
        'Updated Paper.io cover artwork to the requested vibrant high-definition logo icon.'
      ]
    },
    {
      version: 'v2.34.0',
      date: 'August 16, 2026',
      changes: [
        'Permanently committed and bundled all game cover artworks into local repository storage so checkpoint reverts never reset images.',
        'Repaired git integrity and verified image integrity across all titles (Geometry Dash Lite, Monkey Mart, Stickman Hook, Drive Mad, Slope, Paper.io 2).'
      ]
    },
    {
      version: 'v2.33.0',
      date: 'August 16, 2026',
      changes: [
        'Added official Drive Mad (Fancade) 3D physics stunt driver game with all 100 levels.',
        'Optimized with school filter-safe GitHub CDN hosting and bundled high-res cover art.'
      ]
    },
    {
      version: 'v2.32.0',
      date: 'August 16, 2026',
      changes: [
        'Fixed Request Games overlay issue: converted Request Games into a direct native new-tab link (target="_blank") so that returning to the hub keeps your game catalog perfectly clean without any modal overlay stuck on screen.',
        'Hardened player state handling to guarantee external forms never trigger or block the app view.'
      ]
    },
    {
      version: 'v2.31.0',
      date: 'August 16, 2026',
      changes: [
        'Added dynamic version cache-busting to game card image loaders to prevent browser cache from showing outdated icons/thumbnails.',
        'Ensured official game artwork and custom additions always synchronize with the latest bundled assets immediately.'
      ]
    },
    {
      version: 'v2.30.0',
      date: 'August 16, 2026',
      changes: [
        'Updated Stickman Hook cover artwork to the requested vibrant swinging stickman game banner.'
      ]
    },
    {
      version: 'v2.29.0',
      date: 'August 16, 2026',
      changes: [
        'Updated Monkey Mart cover artwork to the requested vibrant official game banner artwork.'
      ]
    },
    {
      version: 'v2.28.0',
      date: 'August 16, 2026',
      changes: [
        'Updated Geometry Dash Lite cover artwork to the requested official yellow cube icon art.'
      ]
    },
    {
      version: 'v2.27.0',
      date: 'August 16, 2026',
      changes: [
        'Updated the Slope game artwork/icon to the requested official neon 3D runner graphic.'
      ]
    },
    {
      version: 'v2.26.0',
      date: 'August 16, 2026',
      changes: [
        'Updated the Request Games icon to the requested official Google Forms icon artwork.'
      ]
    },
    {
      version: 'v2.25.0',
      date: 'August 16, 2026',
      changes: [
        'Removed the plays counter from the Request Games card.',
        'Configured Request Games to open the official Google Form in a new tab/page rather than inside the in-app player.'
      ]
    },
    {
      version: 'v2.24.0',
      date: 'August 16, 2026',
      changes: [
        'Updated Paper.io 2 cover artwork to requested vibrant official 3D paper avatar cover art.'
      ]
    },
    {
      version: 'v2.23.0',
      date: 'August 16, 2026',
      changes: [
        'Fixed game cover images resetting by creating permanent, local high-resolution artwork for all games including Slope.',
        'Added dual format (.png & .jpg) local image fallbacks and resilient in-app rendering.',
        'Prevented external image placeholder resets under restrictive school networks and filters.'
      ]
    },
    {
      version: 'v2.22.0',
      date: 'August 15, 2026',
      changes: [
        'Removed "Request Games" form link from Action, Casual, and Strategy category filters so it appears exclusively under the All view.'
      ]
    },
    {
      version: 'v2.21.0',
      date: 'August 15, 2026',
      changes: [
        'Bundled authentic Geometry Dash Lite (RobTop Games) with 15 classic levels and complete full soundtrack locally.',
        '100% Linwize and school-filter safe: Local WASM engine, zero external network calls, Web Audio auto-unlock, and touch/keyboard support.',
        'Updated game metadata and controls for Geometry Dash Lite.'
      ]
    },
    {
      version: 'v2.20.0',
      date: 'August 15, 2026',
      changes: [
        'Added "Request Games" quick-access card redirecting directly to the official Google Form (forms.gle/CnvnG9kwxg5T4Kk18).',
        'Added custom icon artwork for Request Games.',
        'Updated Stickman Hook icon artwork to high-contrast graphic.'
      ]
    },
    {
      version: 'v2.19.0',
      date: 'August 15, 2026',
      changes: [
        'Added authentic 3D Unity WebGL Slope game: Fully bundled locally (zero external CDNs or unblocked sites needed).',
        'Hardened for Linwize and school filters: 100% offline-ready, no ads or tracking requests, safe Web Audio auto-play wrapper, and error interceptors.',
        'Optimized WebGL memory allocation (512MB) for instant loading on school Chromebooks and lower-spec laptops.',
        'Integrated touch / mobile steer controls and crisp high-contrast neon cover artwork.'
      ]
    },
    {
      version: 'v2.18.4',
      date: 'August 15, 2026',
      changes: [
        'Fixed Monkey Mart click interaction crash: Added full GameAnalytics & RemoteConfigs stub implementation with remote listener support.',
        'Added PokiSDK error capture & shareable URL mock hooks to prevent runtime WASM table callback exceptions on first interaction.',
        'Hardened school filter compatibility: Cleaned all tracking / UBG signatures, added unhandled error interceptors, and wrapped AudioContext resume for Linwize and Chromebooks.'
      ]
    },
    {
      version: 'v2.18.3',
      date: 'August 15, 2026',
      changes: [
        'Updated Geometry Dash Lite cover art with new authentic high-contrast icon.'
      ]
    },
    {
      version: 'v2.18.2',
      date: 'August 15, 2026',
      changes: [
        'Updated Paper.io 2 cover art image with the new high-resolution game artwork.'
      ]
    },
    {
      version: 'v2.18.1',
      date: 'August 15, 2026',
      changes: [
        'Fixed Monkey Mart offline Defold engine loader, IndexedDB persistent storage, and GameAnalytics mock hooks.'
      ]
    },
    {
      version: 'v2.18.0',
      date: 'August 14, 2026',
      changes: [
        'Added authentic Monkey Mart by TinyDobbins — 100% self-hosted and bundled locally for smooth play across school networks.'
      ]
    },
    {
      version: 'v2.17.2',
      date: 'August 14, 2026',
      changes: [
        'Removed all Linewize Safe badges, titles, and mentions across game cards, dataset, and game headers.'
      ]
    },
    {
      version: 'v2.17.1',
      date: 'August 14, 2026',
      changes: [
        'Updated Geometry Dash Lite official game icon to the requested high-res art asset.'
      ]
    },
    {
      version: 'v2.17.0',
      date: 'August 14, 2026',
      changes: [
        'Updated Paper.io 2 official game icon with high-res art asset.',
        'Removed the "Featured" tag/badge from the catalog layout for a clean, uniform grid appearance.'
      ]
    },
    {
      version: 'v2.16.1',
      date: 'August 14, 2026',
      changes: [
        'Updated Paper.io 2 official game icon / cover art in the game catalog and header view.'
      ]
    },
    {
      version: 'v2.16.0',
      date: 'August 14, 2026',
      changes: [
        'Reset all default game play counts to 0 plays across the entire catalog and JSON dataset.'
      ]
    },
    {
      version: 'v2.15.1',
      date: 'August 14, 2026',
      changes: [
        'Fixed Paper.io 2 execution: neutralized anti-debugging freeze loop, replaced remote SDK with instant offline mock provider, and fixed DOM element initialization order.',
        'Paper.io 2 now loads instantaneously and runs 100% offline without external network blocks.'
      ]
    },
    {
      version: 'v2.15.0',
      date: 'August 14, 2026',
      changes: [
        'Added authentic Paper.io 2 (by Voodoo) — 100% self-hosted and Linewize/School Firewall safe.',
        'Bundled complete HTML5 canvas engine, textures, and bot multiplayer logic directly in the application with 0 external network requests.'
      ]
    },
    {
      version: 'v2.14.0',
      date: 'August 14, 2026',
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
