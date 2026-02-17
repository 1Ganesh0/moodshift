
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Mood, SessionLength, Game, GameType, Platform, MoodHistory } from './types';
import { INITIAL_GAMES } from './mockData';

// --- Types & Persistence ---

interface UserStats {
  history: MoodHistory[];
  lastVisit: number | null;
}

interface WebDiscovery {
  name: string;
  description: string;
  url: string;
  sources: { title?: string; uri?: string }[];
  id?: string;
}

const STORAGE_KEY = 'moodshift_v5_stats';

const loadStats = (): UserStats => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return { history: [], lastVisit: null };
    }
  }
  return { history: [], lastVisit: null };
};

const saveStats = (stats: UserStats) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

// --- Utils ---

const getMoodEmoji = (mood: Mood): string => {
  const map: Record<Mood, string> = {
    [Mood.Relaxed]: '✨',
    [Mood.Stressed]: '😤',
    [Mood.Tired]: '💀',
    [Mood.Competitive]: '⚡',
    [Mood.Bored]: '🥱',
    [Mood.Anxious]: '🌀',
  };
  return map[mood] || '🎮';
};

const getRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

interface DeviceInfo {
  platform: Platform;
  isIOS: boolean;
  isAndroid: boolean;
}

const detectDevice = (): DeviceInfo => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
  const isMobile = isAndroid || isIOS || /Mobi/i.test(userAgent);

  return {
    platform: isMobile ? Platform.Mobile : Platform.Web,
    isIOS,
    isAndroid
  };
};

// --- AI Search Service ---

const discoverWebGame = async (mood: Mood, time: SessionLength, platform: Platform): Promise<WebDiscovery> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const platformName = platform === Platform.Mobile ? "mobile (Google Play or iOS App Store)" : "browser-based web";
  const timeDesc = time === SessionLength.Short ? "15 minutes" : time === SessionLength.Medium ? "30 minutes" : "over an hour";
  
  const prompt = `Suggest exactly ONE specific, world-famous, extremely popular, and highly-rated game for ${platformName} that perfectly fits a ${mood} mood and a ${timeDesc} break. 
  DO NOT suggest niche or obscure indie games. Focus on major titles with millions of players.
  
  Provide the result in this format: 
  Game Name: [Name]
  Description: [One short catchy sentence explaining why this famous game is perfect for this exact mood]
  Primary URL: [Direct Official Store link or official website link]`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "";
  const nameMatch = text.match(/Game Name:\s*(.*)/i);
  const descMatch = text.match(/Description:\s*(.*)/i);
  const urlMatch = text.match(/Primary URL:\s*(.*)/i);
  
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.map(chunk => ({
      title: chunk.web?.title,
      uri: chunk.web?.uri
    })).filter(s => s.uri) || [];

  return {
    name: nameMatch ? nameMatch[1].trim() : "Popular Discovery",
    description: descMatch ? descMatch[1].trim() : "A world-renowned favorite to shift your mood.",
    url: urlMatch ? urlMatch[1].trim() : (sources[0]?.uri || "https://google.com/search?q=" + encodeURIComponent(nameMatch?.[1] || "popular games")),
    sources: sources.slice(0, 3)
  };
};

// --- UI Components ---

const Header: React.FC<{ 
  isReturning: boolean; 
  onHome: () => void; 
  onHistory: () => void;
  onBack?: () => void;
}> = ({ isReturning, onHome, onHistory, onBack }) => (
  <header className="pt-16 pb-12 flex flex-col items-center animate-in fade-in duration-1000 relative w-full">
    {/* Back Icon Button at Top Left */}
    {onBack && (
      <button 
        onClick={onBack}
        className="absolute left-0 top-16 p-2 text-slate-600 hover:text-white transition-colors group outline-none"
        title="Go Back"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="group-hover:translate-x-[-2px] transition-transform"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </button>
    )}

    {/* History Icon Button at Top Right */}
    <button 
      onClick={onHistory}
      className="absolute right-0 top-16 p-2 text-slate-600 hover:text-indigo-400 transition-colors group outline-none"
      title="View History"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="22" 
        height="22" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="group-hover:rotate-[-8deg] transition-transform"
      >
        <path d="M12 8v4l3 3" />
        <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
      </svg>
    </button>

    <button onClick={onHome} className="group outline-none focus:ring-0">
      <h1 className="text-4xl font-black tracking-tighter text-white group-hover:text-indigo-400 transition-all group-active:scale-95">
        MoodShift
      </h1>
    </button>
    <div className="flex items-center gap-3 mt-2">
      <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase">
        {isReturning ? "Good to see you" : "Intentional gaming"}
      </p>
    </div>
  </header>
);

const ScreenWrapper: React.FC<{ children: React.ReactNode; title: string; subtitle?: string }> = ({ children, title, subtitle }) => (
  <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
    <div className="text-center mb-10 px-4">
      <h2 className="text-3xl font-bold text-white tracking-tight leading-tight">{title}</h2>
      {subtitle && <p className="text-slate-500 mt-2 text-sm font-medium">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const MoodSelection: React.FC<{ onSelect: (m: Mood) => void }> = ({ onSelect }) => {
  const moods = [
    { label: 'Relaxed', value: Mood.Relaxed, color: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Stressed', value: Mood.Stressed, color: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'Tired', value: Mood.Tired, color: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Competitive', value: Mood.Competitive, color: 'bg-indigo-500/10 border-indigo-500/20' },
    { label: 'Bored', value: Mood.Bored, color: 'bg-slate-500/10 border-slate-500/20' },
    { label: 'Anxious', value: Mood.Anxious, color: 'bg-cyan-500/10 border-cyan-500/20' },
  ];
  return (
    <ScreenWrapper title="How do you feel?">
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {moods.map((m) => (
          <button key={m.value} onClick={() => onSelect(m.value)} className={`${m.color} border p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group shadow-xl hover:bg-white/5`}>
            <span className="text-4xl group-hover:scale-110 transition-transform">{getMoodEmoji(m.value)}</span>
            <span className="font-bold text-slate-200 text-xs uppercase tracking-widest">{m.label}</span>
          </button>
        ))}
      </div>
    </ScreenWrapper>
  );
};

const TimeSelection: React.FC<{ onSelect: (t: SessionLength) => void }> = ({ onSelect }) => {
  const times = [
    { label: '15 Minutes', value: SessionLength.Short, icon: '⏱️' },
    { label: '30 Minutes', value: SessionLength.Medium, icon: '⏳' },
    { label: '60+ Minutes', value: SessionLength.Long, icon: '🚀' },
  ];
  return (
    <ScreenWrapper title="Got time?">
      <div className="space-y-4 w-full max-w-sm">
        {times.map((t) => (
          <button key={t.value} onClick={() => onSelect(t.value)} className="w-full bg-white/5 hover:bg-white/10 p-7 rounded-[2rem] flex items-center justify-between border border-white/5 shadow-sm active:scale-[0.98] transition-all group">
            <div className="flex items-center gap-4">
              <span className="text-2xl">{t.icon}</span>
              <span className="font-bold text-xl text-slate-100 group-hover:text-indigo-400 transition-colors">{t.label}</span>
            </div>
            <div className="text-slate-600 group-hover:text-indigo-500">→</div>
          </button>
        ))}
      </div>
    </ScreenWrapper>
  );
};

const History: React.FC<{ history: MoodHistory[] }> = ({ history }) => {
  const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <ScreenWrapper title="History" subtitle="Your journey of intentional play.">
      <div className="w-full max-w-sm space-y-3">
        {sortedHistory.length === 0 ? (
          <div className="py-12 text-center bg-white/5 rounded-[2rem] border border-white/5">
            <p className="text-slate-500 text-sm font-medium">No breaks yet.<br/>Take your first intentional break.</p>
          </div>
        ) : (
          sortedHistory.map((item) => (
            <div key={item.id} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 flex items-center justify-between group">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl flex-shrink-0">
                  {getMoodEmoji(item.mood)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-white font-bold text-sm truncate">{item.recommendedGameName}</h4>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{item.mood} • {item.timeSelected}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-600 flex-shrink-0 whitespace-nowrap">
                {getRelativeTime(item.timestamp)}
              </span>
            </div>
          ))
        )}
      </div>
    </ScreenWrapper>
  );
};

const Recommendation: React.FC<{ 
  mood: Mood, 
  time: SessionLength, 
  device: DeviceInfo, 
  onReset: () => void, 
  seenIds: Set<string>, 
  onShow: (id: string) => void, 
  onLog: (id: string, name: string) => void 
}> = ({ mood, time, device, onReset, seenIds, onShow, onLog }) => {
  const [iteration, setIteration] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [webResult, setWebResult] = useState<WebDiscovery | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const localMatches = useMemo(() => {
    return INITIAL_GAMES.filter(g => g.active && g.moodTag === mood && g.sessionLength === time && g.platform === device.platform && !seenIds.has(g.id));
  }, [mood, time, device.platform, seenIds]);

  const currentGame = localMatches[0];
  const currentResult = webResult || (currentGame ? { name: currentGame.name, description: currentGame.description, url: (device.isIOS && currentGame.appStoreUrl) ? currentGame.appStoreUrl : currentGame.url, id: currentGame.id, sources: [] } : null);

  useEffect(() => {
    if (currentResult) {
      onLog(currentResult.id || 'ai_discovery', currentResult.name);
    }
  }, [currentResult?.name]);

  const handleNext = async () => {
    if (localMatches.length > 1 && !webResult) {
      setIteration(i => i + 1);
      onShow(localMatches[0].id);
    } else {
      setIsSearching(true);
      try {
        const result = await discoverWebGame(mood, time, device.platform);
        setWebResult(result);
      } catch (e) {
        console.error("Search failed", e);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleLaunch = (url: string) => {
    setIsConfirming(true);
    setTimeout(() => {
      window.open(url, '_blank');
      setIsConfirming(false);
    }, 1200);
  };

  if (isSearching) {
    return (
      <ScreenWrapper title="Finding Icons..." subtitle="Looking for world-class games to match your energy.">
        <div className="mt-12 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mb-8"></div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] animate-pulse">Deep discovery in progress</p>
        </div>
      </ScreenWrapper>
    );
  }

  if (!currentResult) {
    return (
      <ScreenWrapper title="All Set" subtitle="You've explored all our standard picks.">
        <button onClick={handleNext} className="mt-10 bg-indigo-600 text-white px-8 py-5 rounded-[2rem] font-bold text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all">
          Find Worldwide Hits
        </button>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper title="The Choice" subtitle="A world-famous pick for your break.">
      <div className="bg-white/5 p-10 rounded-[3.5rem] border border-white/10 shadow-3xl max-w-sm w-full relative overflow-hidden flex flex-col items-center backdrop-blur-2xl animate-in zoom-in-95 duration-700">
        {isConfirming && (
          <div className="absolute inset-0 bg-slate-900 z-30 flex flex-col items-center justify-center p-10 animate-in fade-in duration-300 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <p className="text-white font-black text-2xl mb-2">Excellent move.</p>
            <p className="text-slate-500 text-sm">Opening your break...</p>
          </div>
        )}

        <div className="flex gap-2 mb-8">
          <span className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-indigo-400">{mood}</span>
          <span className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-indigo-400">{time}</span>
        </div>
        
        <h2 className="text-4xl font-black mb-6 text-white text-center leading-tight tracking-tighter">{currentResult.name}</h2>
        <p className="text-slate-400 mb-12 text-center font-medium text-sm leading-relaxed px-2">"{currentResult.description}"</p>
        
        <button onClick={() => handleLaunch(currentResult.url)} className="w-full bg-white text-black hover:bg-slate-200 py-6 rounded-[2.5rem] font-black shadow-2xl transition-all active:scale-95 uppercase tracking-[0.2em] text-[10px]">
          Launch Now
        </button>

        <button onClick={handleNext} className="mt-6 text-slate-500 hover:text-slate-300 font-bold text-[10px] uppercase tracking-[0.2em] transition-colors">
          Try another famous hit?
        </button>

        {currentResult.sources && currentResult.sources.length > 0 && (
          <div className="mt-10 pt-8 border-t border-white/5 w-full">
            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-3 text-center">Verified Discovery Sources</p>
            <div className="flex flex-col gap-2">
              {currentResult.sources.map((s, idx) => (
                <a key={idx} href={s.uri} target="_blank" rel="noopener" className="text-[9px] text-indigo-400/60 hover:text-indigo-400 transition-colors truncate text-center block">
                  {s.title || "Game Source"}
                </a>
              ))}
            </div>
          </div>
        )}

        <button onClick={onReset} className="mt-10 text-slate-700 hover:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
          Change vibe
        </button>
      </div>
    </ScreenWrapper>
  );
};

// --- Main App ---

export default function App() {
  const [step, setStep] = useState<'mood' | 'time' | 'result' | 'history'>('mood');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedTime, setSelectedTime] = useState<SessionLength | null>(null);
  const [stats, setStats] = useState<UserStats>(loadStats());
  const deviceInfo = useMemo(() => detectDevice(), []);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  const isReturning = useMemo(() => stats.lastVisit ? (Date.now() - stats.lastVisit < 24 * 3600000) : false, [stats.lastVisit]);
  const breaksThisWeek = useMemo(() => stats.history.filter(h => h.timestamp > Date.now() - 7 * 86400000).length, [stats.history]);

  useEffect(() => {
    const s = loadStats();
    setStats({ ...s, lastVisit: Date.now() });
    saveStats({ ...s, lastVisit: Date.now() });
  }, []);

  const handleMoodSelect = (m: Mood) => { setSelectedMood(m); setStep('time'); };
  const handleTimeSelect = (t: SessionLength) => { setSelectedTime(t); setStep('result'); };
  
  const handleReset = () => { 
    setSelectedMood(null); 
    setSelectedTime(null); 
    setStep('mood'); 
    setSeenIds(new Set());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (step === 'time') setStep('mood');
    else if (step === 'result') setStep('time');
    else if (step === 'history') setStep('mood');
  };
  
  const handleLogHistory = (gameId: string, gameName: string) => {
    if (!selectedMood || !selectedTime) return;
    
    const lastEntry = stats.history[stats.history.length - 1];
    if (lastEntry && lastEntry.recommendedGameId === gameId && Date.now() - lastEntry.timestamp < 5000) return;

    const newRecord: MoodHistory = {
      id: Math.random().toString(36).substring(7),
      userId: 'local_user',
      mood: selectedMood,
      timeSelected: selectedTime,
      recommendedGameId: gameId,
      recommendedGameName: gameName,
      timestamp: Date.now()
    };

    const updated = { ...stats, history: [...stats.history, newRecord] };
    setStats(updated);
    saveStats(updated);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center px-6 pb-24 selection:bg-indigo-500/30 overflow-x-hidden">
      <div className="w-full max-w-md">
        <Header 
          isReturning={isReturning} 
          onHome={handleReset} 
          onHistory={() => setStep('history')} 
          onBack={step !== 'mood' ? handleBack : undefined}
        />
        <main>
          {step === 'mood' && <MoodSelection onSelect={handleMoodSelect} />}
          {step === 'time' && <TimeSelection onSelect={handleTimeSelect} />}
          {step === 'result' && selectedMood && selectedTime && (
            <Recommendation 
              mood={selectedMood} 
              time={selectedTime} 
              device={deviceInfo} 
              seenIds={seenIds} 
              onShow={id => setSeenIds(s => new Set(s).add(id))} 
              onReset={handleReset} 
              onLog={handleLogHistory} 
            />
          )}
          {step === 'history' && <History history={stats.history} />}
        </main>
        <footer className="mt-24 text-center">
          {breaksThisWeek > 0 && (
            <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
              <span className="text-amber-400 text-xs">✦</span>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{breaksThisWeek} intentional breaks this week</p>
            </div>
          )}
          <p className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-800">MoodShift • Mindful Gaming</p>
        </footer>
      </div>
    </div>
  );
}
