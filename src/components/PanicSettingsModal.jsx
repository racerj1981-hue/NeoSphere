import React from 'react';
import { X, ShieldAlert, Key, Monitor, Check, ExternalLink, Power } from 'lucide-react';

export const PanicSettingsModal = ({
  config,
  onUpdateConfig,
  tabCloak,
  onUpdateTabCloak,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-950/80 text-red-400 border border-red-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Stealth & Panic Settings</h2>
              <p className="text-xs text-zinc-400">Configure instant ESC key response & cloaking</p>
            </div>
          </div>

          <button
            id="close-panic-settings-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="space-y-4">

          {/* Panic Action Mode Choice */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
              <Power className="w-4 h-4 text-red-400" /> Panic Response Action
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="panic-mode-close-btn"
                onClick={() => onUpdateConfig({ ...config, mode: 'close' })}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex flex-col gap-1 ${
                  (config.mode || 'close') === 'close'
                    ? 'bg-red-500/20 border-red-500 text-red-200 shadow-md ring-1 ring-red-500/50'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-white font-extrabold">
                    <Power className="w-3.5 h-3.5 text-red-400" /> Close Website
                  </span>
                  {(config.mode || 'close') === 'close' && <Check className="w-4 h-4 text-red-400" />}
                </div>
                <span className="text-[10px] text-zinc-400 font-normal">
                  Instantly closes tab or redirects to Google / school site
                </span>
              </button>

              <button
                id="panic-mode-disguise-btn"
                onClick={() => onUpdateConfig({ ...config, mode: 'disguise' })}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex flex-col gap-1 ${
                  config.mode === 'disguise'
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 shadow-md ring-1 ring-indigo-500/50'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-white font-extrabold">
                    <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" /> Fake Overlay
                  </span>
                  {config.mode === 'disguise' && <Check className="w-4 h-4 text-indigo-400" />}
                </div>
                <span className="text-[10px] text-zinc-400 font-normal">
                  Overlay screen with fake Google Classroom / Docs
                </span>
              </button>
            </div>
          </div>

          {/* If Mode is Close: Target URL */}
          {(config.mode || 'close') === 'close' && (
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4 text-emerald-400" /> Exit & Redirect Destination
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'https://www.google.com', label: 'Google Search' },
                  { id: 'https://classroom.google.com', label: 'Classroom' },
                  { id: 'about:blank', label: 'Blank Page' },
                ].map((target) => (
                  <button
                    key={target.id}
                    id={`redirect-target-${target.label.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => onUpdateConfig({ ...config, closeUrl: target.id })}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                      (config.closeUrl || 'https://www.google.com') === target.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span>{target.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Persistent Tab Cloaker */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-indigo-400" /> Persistent Tab Cloaker (Tab Title & Favicon)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'default', label: 'Default Portal' },
                { id: 'classroom', label: 'Classroom' },
                { id: 'docs', label: 'Google Docs' },
                { id: 'canvas', label: 'Canvas LMS' },
                { id: 'drive', label: 'Google Drive' },
              ].map((tc) => (
                <button
                  key={tc.id}
                  id={`tab-cloak-opt-${tc.id}`}
                  onClick={() => onUpdateTabCloak(tc.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    tabCloak === tc.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 shadow-md'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {tabCloak === tc.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  <span>{tc.label}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">
              Disguises the browser tab name and icon continuously while browsing or playing games.
            </p>
          </div>
          
          {/* Panic Screen Disguise Type (if Disguise Mode selected) */}
          {config.mode === 'disguise' && (
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" /> Disguise Overlay Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'classroom', label: 'Classroom' },
                  { id: 'wikipedia', label: 'Wikipedia' },
                  { id: 'docs', label: 'Google Docs' },
                ].map((dt) => (
                  <button
                    key={dt.id}
                    id={`disguise-opt-${dt.id}`}
                    onClick={() =>
                      onUpdateConfig({
                        ...config,
                        disguiseType: dt.id,
                      })
                    }
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      config.disguiseType === dt.id
                        ? 'bg-amber-600/30 border-amber-500 text-amber-200 shadow-md'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {config.disguiseType === dt.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{dt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-400" /> Panic Hotkey Trigger
            </label>
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between text-xs text-zinc-300 font-mono">
              <span>Press <strong className="text-amber-400">Escape (ESC)</strong> anytime</span>
              <span className="px-2 py-1 bg-zinc-800 rounded text-amber-300 font-bold">ESC</span>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 leading-relaxed pt-1">
            Hitting Escape or the Panic button instantly closes or exits the site. You can also use the <strong>About:Blank Launcher</strong> on game windows to hide external URLs from tab address history.
          </p>

        </div>

      </div>
    </div>
  );
};
