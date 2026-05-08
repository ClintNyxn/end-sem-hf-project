import React from 'react';
import { Users, User } from 'lucide-react';

export default function AstronautsList({ astronauts }) {
  return (
    <div className="glass rounded-3xl p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">People in Space</h3>
        <div className="bg-primary-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
          {astronauts.count} Total
        </div>
      </div>
      
      <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
        {astronauts.people.map((person, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-primary-300 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-colors">
              <User size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold">{person.name}</p>
              <p className="text-[10px] opacity-50 uppercase">{person.craft}</p>
            </div>
          </div>
        ))}
        {astronauts.count === 0 && (
          <div className="text-center py-4 opacity-50 italic text-sm">
            Fetching astronaut data...
          </div>
        )}
      </div>
    </div>
  );
}
