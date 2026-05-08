import React, { useState, useEffect } from 'react';
import { useISSData } from './hooks/useISSData';
import { useNewsData } from './hooks/useNewsData';
import ISSMap from './components/ISS/ISSMap';
import SpeedChart from './components/ISS/SpeedChart';
import NewsGrid from './components/News/NewsGrid';
import NewsChart from './components/News/NewsChart';
import Chatbot from './components/Chatbot/Chatbot';
import Header from './components/UI/Header';
import { Toaster } from 'react-hot-toast';
import AstronautsList from './components/ISS/AstronautsList';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const { currentPos, history, speed, nearestPlace, astronauts, loading: issLoading, refresh: refreshISS } = useISSData();
  const { news, loading: newsLoading, refresh: refreshNews } = useNewsData();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-['Outfit']">
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* ISS Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-3xl p-1 h-[500px] overflow-hidden relative group">
              <ISSMap currentPos={currentPos} history={history} loading={issLoading} />
              <div className="absolute top-4 left-4 z-[1000] glass px-4 py-2 rounded-2xl max-w-[300px] shadow-2xl border-primary-500/30">
                 <h2 className="text-sm font-semibold text-primary-600 dark:text-primary-400">Live ISS Tracker</h2>
                 <p className="text-[11px] font-bold opacity-90">{nearestPlace}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <SpeedChart history={history} />
               <AstronautsList astronauts={astronauts} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-3xl p-6">
              <h3 className="text-xl font-bold mb-4">ISS Real-time Stats</h3>
              <div className="space-y-4">
                <StatCard label="Current Location" value={nearestPlace} highlight />
                <div className="grid grid-cols-2 gap-4">
                  <StatCard label="Latitude" value={currentPos?.lat?.toFixed(4) || '---'} />
                  <StatCard label="Longitude" value={currentPos?.lng?.toFixed(4) || '---'} />
                </div>
                <StatCard label="Current Speed" value={`${speed} km/h`} highlight />
                <StatCard label="Positions Tracked" value={history.length} />
              </div>
              <button 
                onClick={refreshISS}
                className="w-full mt-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl transition-all shadow-lg active:scale-95"
              >
                Refresh Location
              </button>
            </div>
            <NewsChart news={news} />
          </div>
        </section>

        {/* News Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">Global Space News</h2>
            <button 
              onClick={() => refreshNews()}
              className="px-4 py-2 glass rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              Refresh News
            </button>
          </div>
          <NewsGrid news={news} loading={newsLoading} />
        </section>
      </main>

      <Chatbot dashboardData={{ iss: { ...currentPos, speed, astronauts, nearestPlace }, news }} />
      <Toaster position="bottom-left" />
    </div>
  );
}

function StatCard({ label, value, highlight }) {
  return (
    <div className={`p-4 rounded-2xl border transition-all ${highlight ? 'bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}>
      <p className="text-xs uppercase tracking-wider opacity-60 font-semibold">{label}</p>
      <p className={`text-xl font-bold ${highlight ? 'text-primary-600 dark:text-primary-400' : ''} leading-tight`}>{value}</p>
    </div>
  );
}

export default App;
