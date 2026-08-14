import React, { useEffect } from 'react';
import { BookOpen, Search, FileText, ArrowLeft, CheckCircle2, Power } from 'lucide-react';

export const PanicScreen = ({ config, onExit }) => {

  const handleCloseWebsite = () => {
    try {
      window.close();
    } catch (e) {}
    setTimeout(() => {
      const url = config.closeUrl || 'https://www.google.com';
      try {
        window.location.replace(url);
      } catch (e) {
        window.location.href = url;
      }
    }, 50);
  };

  // Dynamically change document title and favicon while Panic Mode is active
  useEffect(() => {
    const originalTitle = document.title;
    
    if (config.disguiseType === 'classroom') {
      document.title = 'Classes - Google Classroom';
    } else if (config.disguiseType === 'wikipedia') {
      document.title = 'Quantum Computing - Wikipedia';
    } else {
      document.title = 'Untitled Document - Google Docs';
    }

    return () => {
      document.title = originalTitle;
    };
  }, [config.disguiseType]);

  return (
    <div className="fixed inset-0 z-50 bg-white text-slate-800 font-sans overflow-auto selection:bg-blue-100">
      
      {/* Hidden Un-Panic & Close Triggers */}
      <div className="fixed bottom-3 right-3 z-50 group opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2">
        <button
          id="close-website-panic-btn"
          onClick={handleCloseWebsite}
          className="px-3 py-1.5 text-xs font-mono bg-red-600 text-white rounded-lg shadow-xl flex items-center gap-1.5 hover:bg-red-700 transition-colors"
        >
          <Power className="w-3.5 h-3.5" />
          <span>Close Website</span>
        </button>

        <button
          id="exit-panic-btn"
          onClick={onExit}
          className="px-3 py-1.5 text-xs font-mono bg-slate-900 text-white rounded-lg shadow-xl flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Portal ({config.triggerKey || 'ESC'})</span>
        </button>
      </div>

      {/* Disguise 1: Google Classroom */}
      {config.disguiseType === 'classroom' && (
        <div className="min-h-screen bg-slate-50 flex flex-col">
          {/* Classroom Header */}
          <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-md bg-emerald-600 text-white font-bold text-lg flex items-center justify-center">
                ≡
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-medium text-slate-700">Google Classroom</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-600 text-sm font-medium">
              <span>Stream</span>
              <span className="text-emerald-700 font-semibold border-b-2 border-emerald-700 pb-4 mt-4">Classwork</span>
              <span>People</span>
              <span>Grades</span>
            </div>
          </header>

          {/* Classroom Content */}
          <main className="max-w-4xl mx-auto w-full p-6 space-y-6">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-8 text-white shadow-md relative overflow-hidden">
              <h1 className="text-3xl font-bold">AP Computer Science Principles</h1>
              <p className="text-emerald-100 text-sm mt-1">Period 4 • Room 204</p>
              <div className="mt-6 inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-md text-xs font-mono">
                Class code: k9x2p4
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2">
                <h3 className="font-semibold text-slate-800 text-sm">Upcoming Due Dates</h3>
                <p className="text-xs text-slate-500">Woohoo, no work due soon!</p>
                <button className="text-xs text-emerald-700 font-bold hover:underline">View all</button>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-3 text-slate-500 text-sm">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                    S
                  </div>
                  <span>Announce something to your class...</span>
                </div>

                <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Mr. Davis posted a new assignment: Module 4 Quiz</p>
                      <p className="text-xs text-slate-400">Aug 11, 2026</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-12">
                    Please review Chapter 4 algorithms and complete the attached practice worksheet before Friday.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* Disguise 2: Wikipedia */}
      {config.disguiseType === 'wikipedia' && (
        <div className="min-h-screen bg-white text-slate-900 font-serif">
          <header className="border-b border-slate-300 p-4 max-w-6xl mx-auto flex items-center justify-between font-sans">
            <div className="flex items-center gap-3">
              <div className="font-serif font-black text-2xl tracking-tighter">WIKIPEDIA</div>
              <span className="text-xs text-slate-500">The Free Encyclopedia</span>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                readOnly
                value="Quantum computing"
                className="w-full pl-8 pr-3 py-1 text-xs border border-slate-300 rounded bg-slate-50"
              />
            </div>
          </header>

          <main className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 space-y-4">
              <h1 className="text-4xl font-normal border-b border-slate-300 pb-2">Quantum computing</h1>
              <p className="text-sm leading-relaxed">
                <strong>Quantum computing</strong> is a rapidly-emerging technology that harnesses the laws of quantum mechanics to solve problems too complex for classical computers. Today, IBM Quantum makes real quantum hardware available to thousands of developers.
              </p>
              <h2 className="text-xl font-bold font-sans border-b border-slate-300 pb-1 mt-6">Principles of Operation</h2>
              <p className="text-sm leading-relaxed">
                While classical computers encode information into binary bits that can either be 0 or 1, quantum computers utilize <em>qubits</em> which can exist in superpositions.
              </p>
            </div>

            <div className="md:col-span-4 p-4 border border-slate-300 bg-slate-50 rounded text-xs space-y-3 font-sans">
              <h3 className="font-bold text-center border-b border-slate-300 pb-2 text-sm">Quantum Computer Overview</h3>
              <div className="aspect-video bg-slate-200 rounded flex items-center justify-center text-slate-500 font-mono">
                [ Cryostat Hardware Diagram ]
              </div>
              <div className="space-y-1 text-slate-700">
                <p><strong>Primary units:</strong> Qubits</p>
                <p><strong>Operating temp:</strong> 15 milliKelvin</p>
                <p><strong>Common paradigms:</strong> Superconducting, Ion trap</p>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* Disguise 3: Google Docs */}
      {config.disguiseType === 'docs' && (
        <div className="min-h-screen bg-slate-100 flex flex-col">
          <header className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <input
                  type="text"
                  readOnly
                  value="History Essay - World War II Era"
                  className="font-medium text-slate-800 text-sm focus:outline-none"
                />
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>File</span>
                  <span>Edit</span>
                  <span>View</span>
                  <span>Insert</span>
                  <span>Format</span>
                  <span>Tools</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Saved to Drive
              </span>
            </div>
          </header>

          <main className="flex-1 max-w-3xl mx-auto my-8 bg-white shadow-md border border-slate-200 p-12 min-h-[700px] text-slate-800 leading-relaxed font-serif">
            <h1 className="text-2xl font-bold mb-4 font-sans text-center">The Economic Effects of Innovation in the 20th Century</h1>
            <p className="text-justify text-sm mb-4">
              Throughout the twentieth century, technological breakthroughs fundamentally altered global communication and industrial manufacturing. The introduction of assembly lines alongside digital computing architectures catalyzed unprecedented productivity growth.
            </p>
            <p className="text-justify text-sm">
              As telecommunications expanded, international markets became increasingly interconnected, paving the way for instant data exchange and distributed production networks across continents...
            </p>
          </main>
        </div>
      )}

    </div>
  );
};
