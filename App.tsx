
import React, { useState, useCallback, useEffect } from 'react';
import { Profession, RewriteResponse } from './types';
import { PROFESSION_DETAILS } from './constants';
import { humanizerService } from './services/geminiService';
import { StatCard } from './components/StatCard';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedProfession, setSelectedProfession] = useState<Profession>(Profession.ENGINEER);
  const [customProfession, setCustomProfession] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<RewriteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      setError("Please provide some text to humanize.");
      return;
    }
    if (inputText.length < 50) {
      setError("Input text is too short. Please provide at least 50 characters for effective analysis.");
      return;
    }

    const professionToSend = selectedProfession === Profession.OTHER 
      ? customProfession.trim() || 'Professional' 
      : selectedProfession;

    if (selectedProfession === Profession.OTHER && !customProfession.trim()) {
      setError("Please specify your custom profession.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const response = await humanizerService.humanizeText(inputText, professionToSend);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.humanizedText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="min-h-screen text-slate-200 p-4 md:p-8 lg:p-12 selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
              <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/20">
                <i className="fa-solid fa-wand-magic-sparkles text-2xl text-white"></i>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white">Human<span className="gradient-text">Flow</span></h1>
            </div>
            <p className="text-slate-400 text-lg">Professional ML-driven text humanization & adversarial AI-bypass.</p>
          </div>
          <div className="flex gap-4 items-center justify-center md:justify-end">
            <div className="px-4 py-2 glass rounded-full flex items-center gap-2 border-slate-700">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-slate-300">Gemini 3 Pro Engine</span>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Controls & Input */}
          <div className="lg:col-span-5 space-y-8">
            <section className="glass rounded-3xl p-6 shadow-2xl">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                <i className="fa-solid fa-sliders text-blue-400"></i>
                Configuration
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Target Profession</label>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.values(Profession).map((prof) => (
                      <button
                        key={prof}
                        onClick={() => setSelectedProfession(prof)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all duration-200 ${
                          selectedProfession === prof 
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-900/20' 
                            : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        <i className={`fa-solid ${PROFESSION_DETAILS[prof].icon} text-lg`}></i>
                        <span className="text-[10px] font-bold uppercase tracking-tight text-center">{prof === Profession.OTHER ? 'Custom' : prof.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedProfession === Profession.OTHER && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider">Specify Profession</label>
                    <input
                      type="text"
                      value={customProfession}
                      onChange={(e) => setCustomProfession(e.target.value)}
                      placeholder="e.g. Theoretical Physicist, Yoga Instructor..."
                      className="w-full bg-slate-900/50 border border-blue-500/30 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                )}

                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 italic text-sm text-slate-400">
                  <i className="fa-solid fa-circle-info mr-2 text-blue-400"></i>
                  {PROFESSION_DETAILS[selectedProfession].description}
                </div>
              </div>
            </section>

            <section className="glass rounded-3xl p-6 shadow-2xl relative">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                <i className="fa-solid fa-align-left text-blue-400"></i>
                Source Text
              </h2>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste AI-generated text here (Minimum 50 characters)..."
                className="w-full h-80 bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none mono-font text-sm leading-relaxed"
              />
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-mono">{inputText.length} characters</span>
                <button
                  onClick={handleHumanize}
                  disabled={isProcessing || !inputText.trim()}
                  className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                    isProcessing 
                      ? 'bg-slate-700 cursor-not-allowed text-slate-500' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {isProcessing ? (
                    <><i className="fa-solid fa-circle-notch animate-spin"></i> Processing...</>
                  ) : (
                    <><i className="fa-solid fa-bolt"></i> Humanize Engine</>
                  )}
                </button>
              </div>
              {error && (
                <div className="absolute -bottom-16 left-0 right-0 p-3 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-center gap-2 z-10">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  {error}
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Results & Analysis */}
          <div className="lg:col-span-7 space-y-8">
            <section className={`glass rounded-3xl p-6 shadow-2xl min-h-[500px] flex flex-col transition-opacity duration-300 ${!result && !isProcessing ? 'opacity-50' : 'opacity-100'}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                  <i className="fa-solid fa-sparkles text-amber-400"></i>
                  Humanized Output
                </h2>
                {result && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-colors border border-slate-700"
                  >
                    <i className={`fa-solid ${copySuccess ? 'fa-check text-emerald-400' : 'fa-copy'}`}></i>
                    {copySuccess ? 'Copied!' : 'Copy Results'}
                  </button>
                )}
              </div>

              <div className="flex-grow bg-slate-900/50 border border-slate-700 rounded-2xl p-6 overflow-y-auto max-h-[600px]">
                {!result && !isProcessing && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                    <i className="fa-solid fa-microchip text-5xl opacity-20"></i>
                    <p className="text-center max-w-sm">Configure your profession and paste some text to begin the transformation.</p>
                  </div>
                )}
                {isProcessing && (
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <div className="relative w-20 h-20">
                      <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                    <div className="animate-pulse space-y-2 text-center">
                      <p className="text-blue-400 font-medium">Bypassing AI Detectors...</p>
                      <p className="text-slate-500 text-xs">Injecting Perplexity & Burstiness</p>
                    </div>
                  </div>
                )}
                {result && (
                  <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
                    {result.humanizedText}
                  </div>
                )}
              </div>

              {result && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <i className="fa-solid fa-chart-line text-blue-400"></i>
                      Original AI Profile
                    </h3>
                    <div className="grid grid-cols-1 gap-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                      <StatCard label="Perplexity" value={result.originalStats.perplexity} maxValue={100} color="bg-rose-500" />
                      <StatCard label="Burstiness" value={result.originalStats.burstiness} maxValue={100} color="bg-rose-500" />
                      <StatCard label="AI Certainty" value={result.originalStats.aiLikelihood} maxValue={100} color="bg-rose-500" suffix="%" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <i className="fa-solid fa-chart-simple text-emerald-400"></i>
                      Humanized Profile
                    </h3>
                    <div className="grid grid-cols-1 gap-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                      <StatCard label="Perplexity" value={result.humanizedStats.perplexity} maxValue={100} color="bg-emerald-500" />
                      <StatCard label="Burstiness" value={result.humanizedStats.burstiness} maxValue={100} color="bg-emerald-500" />
                      <StatCard label="Human Score" value={100 - result.humanizedStats.aiLikelihood} maxValue={100} color="bg-emerald-500" suffix="%" />
                    </div>
                  </div>
                </div>
              )}
            </section>

            {result && (
              <section className="glass rounded-3xl p-6 shadow-2xl animate-fade-in">
                <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                  <i className="fa-solid fa-list-check text-blue-400"></i>
                  Linguistic Transformations Applied
                </h2>
                <div className="flex flex-wrap gap-2">
                  {result.changesMade.map((change, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-medium text-blue-300">
                      {change}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>

        <footer className="mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>© 2024 HumanFlow Linguistic Intelligence Platform. Built with Google Gemini 3 Pro.</p>
          <div className="mt-4 flex justify-center gap-6">
            <span className="flex items-center gap-1"><i className="fa-solid fa-shield-halved text-xs"></i> 100% Secure</span>
            <span className="flex items-center gap-1"><i className="fa-solid fa-microchip text-xs"></i> ML Optimized</span>
            <span className="flex items-center gap-1"><i className="fa-solid fa-cloud-arrow-up text-xs"></i> Low Latency</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
