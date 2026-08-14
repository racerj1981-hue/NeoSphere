import React, { useState } from 'react';
import { X, Copy, Check, FileJson, Download } from 'lucide-react';

export const JsonViewerModal = ({ games, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Format JSON payload
  const jsonString = JSON.stringify(
    games.map(({ id, title, description, category, iframeUrl, thumbnail, controls, rating, playCount, sandbox, allow }) => ({
      id,
      title,
      description,
      category,
      iframeUrl,
      thumbnail,
      controls,
      rating,
      playCount,
      sandbox: sandbox || 'allow-scripts allow-same-origin',
      allow: allow || 'autoplay; fullscreen',
    })),
    null,
    2
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-3xl w-full h-[80vh] flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="bg-zinc-900 px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>games.json</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-emerald-400">
                  {games.length} Games Stored
                </span>
              </h2>
              <p className="text-xs text-zinc-400">Live JSON iframe catalog structure</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="download-json-file-btn"
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" /> Download games.json
            </button>

            <button
              id="copy-json-code-btn"
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy JSON
                </>
              )}
            </button>

            <button
              id="close-json-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-all ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Content View */}
        <div className="flex-1 p-4 bg-zinc-950 overflow-auto font-mono text-xs text-indigo-300 leading-relaxed selection:bg-indigo-900">
          <pre>{jsonString}</pre>
        </div>

      </div>
    </div>
  );
};
