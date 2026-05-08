import React, { useState } from 'react';
import { ExternalLink, Search, Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewsGrid({ news, loading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'source'

  const filteredNews = news
    .filter(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.publishedAt) - new Date(a.publishedAt);
      if (sortBy === 'source') return a.source.name.localeCompare(b.source.name);
      return 0;
    });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="glass rounded-3xl p-4 space-y-4 animate-pulse">
            <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search articles..." 
            className="w-full pl-12 pr-4 py-3 glass rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="glass rounded-2xl px-4 py-3 outline-none cursor-pointer"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="source">Sort by Source</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredNews.map((article, i) => (
            <motion.div 
              key={article.url + i}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-3xl p-4 flex flex-col group hover:shadow-2xl hover:shadow-primary-500/10 transition-all border-transparent hover:border-primary-500/30"
            >
              <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                <img 
                  src={article.urlToImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 glass-dark text-[10px] font-bold text-white uppercase rounded-lg">
                  {article.category || 'News'}
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(article.publishedAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><User size={12}/> {article.author?.split(',')[0] || 'Unknown'}</span>
                </div>
                
                <h3 className="font-bold text-lg leading-snug line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-sm opacity-70 line-clamp-3">
                  {article.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{article.source.name}</span>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-bold px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary-500 hover:text-white transition-all group/btn"
                >
                  Read More <ExternalLink size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {filteredNews.length === 0 && (
        <div className="text-center py-20 glass rounded-3xl">
          <p className="text-slate-400">No articles found matching your search.</p>
        </div>
      )}
    </div>
  );
}
