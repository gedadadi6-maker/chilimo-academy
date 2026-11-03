import React, { useState } from 'react';
import { 
  ArrowRight, 
  Search, 
  Sparkles, 
  Award, 
  Users, 
  Bus, 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail,
  Lock
} from 'lucide-react';
import { Language, AppView } from '../types';
import { translations } from '../translations';
import { CHILIMO_INFO } from '../data/mockData';

interface HeroSectionProps {
  currentLang: Language;
  onNavigate: (view: AppView) => void;
  onQuickTrack: (code: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  onNavigate,
  onQuickTrack
}) => {
  const t = translations[currentLang];
  const [quickCode, setQuickCode] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickCode.trim()) {
      onQuickTrack(quickCode.trim());
    } else {
      onNavigate('status_check');
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0a1526] via-[#0f1e36] to-[#0f1e36] text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16 sm:pt-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.heroBadge}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-widest text-xs">
                <span>{CHILIMO_INFO.location}</span>
                <span>•</span>
                <span>{CHILIMO_INFO.grades}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                {CHILIMO_INFO.name}
              </h1>
              <p className="font-serif italic text-lg sm:text-xl text-amber-300 font-semibold">
                "{CHILIMO_INFO.motto}"
              </p>
            </div>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
              {t.heroDesc}
            </p>

            {/* Guest Actions (SRS Guest Features) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('register_admission')}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-[#0f1e36] font-black text-sm rounded-lg shadow-md hover:shadow-amber-500/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{t.heroCtaApply}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('status_check')}
                className="px-5 py-3 bg-[#172c4e] hover:bg-[#203c6b] border border-slate-700 text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>{t.heroCtaStatus}</span>
              </button>

              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-sm rounded-lg transition-colors flex items-center gap-2 cursor-pointer border border-white/10"
              >
                <Lock className="w-4 h-4 text-amber-300" />
                <span>Sign In (id: 1, 153, 151, 163)</span>
              </button>
            </div>

            {/* Quick Tracking Search Bar */}
            <div className="pt-3 max-w-lg">
              <form onSubmit={handleQuickSubmit} className="flex rounded-lg overflow-hidden border border-slate-700 bg-slate-800/80 p-1 shadow-inner focus-within:border-amber-400">
                <input
                  type="text"
                  value={quickCode}
                  onChange={(e) => setQuickCode(e.target.value)}
                  placeholder="Enter Tracking ID (e.g. CHA-2026-1049)"
                  className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-hidden uppercase font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#0f1e36] text-xs sm:text-sm font-bold rounded transition-colors whitespace-nowrap cursor-pointer"
                >
                  {t.heroCtaStatus}
                </button>
              </form>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400 font-mono">
                <span>Try sample code:</span>
                <button 
                  type="button"
                  onClick={() => onQuickTrack('CHA-2026-1049')}
                  className="text-amber-300 hover:underline cursor-pointer"
                >
                  CHA-2026-1049
                </button>
                <span>·</span>
                <button 
                  type="button"
                  onClick={() => onQuickTrack('CHA-2026-8812')}
                  className="text-amber-300 hover:underline cursor-pointer"
                >
                  CHA-2026-8812
                </button>
              </div>
            </div>

          </div>

          {/* Institutional Crest Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="bg-[#172c4e]/95 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center w-full max-w-lg ring-4 ring-amber-500/10">
              
              <div className="relative mb-4 flex justify-center py-2">
                <div className="relative p-3 bg-gradient-to-b from-white/10 to-transparent rounded-2xl">
                  <img 
                    src={CHILIMO_INFO.logoUrl} 
                    alt="Chilimo Academy Crest Emblem" 
                    className="w-64 h-64 sm:w-76 sm:h-76 md:w-80 md:h-80 object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)] hover:scale-105 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider mb-2">
                Official Crest • Asii Dhaabbataa
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-black text-white tracking-tight">
                {CHILIMO_INFO.name}
              </h3>
              <p className="text-amber-400 text-sm font-bold uppercase tracking-wider mt-1">
                {CHILIMO_INFO.motto}
              </p>
              <p className="text-slate-200 text-xs sm:text-sm mt-2 leading-relaxed">
                Kutaa 1-8 fi KG 1-3 • Burayu, Oromia, Ethiopia.
              </p>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-700/80 text-left">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-amber-400 mb-0.5">
                    <Users className="w-4 h-4" />
                    <span className="text-lg font-bold text-white">850+</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{t.heroStatStudents}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-emerald-400 mb-0.5">
                    <Award className="w-4 h-4" />
                    <span className="text-lg font-bold text-white">99%</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{t.heroStatPass}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-amber-400 mb-0.5">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-lg font-bold text-white">42+</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{t.heroStatTeachers}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-sky-400 mb-0.5">
                    <Bus className="w-4 h-4" />
                    <span className="text-lg font-bold text-white">6 Buses</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{t.heroStatBuses}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
