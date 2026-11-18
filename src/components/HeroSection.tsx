import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Lock,
  Building2
} from 'lucide-react';
import { Language, AppView } from '../types';
import { translations, pickLang } from '../translations';
import { CHILIMO_INFO, getStoredSchoolPhotos, getSchoolLogoUrl } from '../data/mockData';
import heroCampusImg from '../assets/images/chilimo_hero_campus_1794896696148.jpg';

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
  const [imgFailed, setImgFailed] = useState(false);

  const pickHeroPhoto = () => {
    const customHero = getStoredSchoolPhotos().find(
      p => p.placement === 'hero_banner' && p.featured && p.imageDataUrl
    );
    return customHero?.imageDataUrl || heroCampusImg;
  };

  const [heroImgSrc, setHeroImgSrc] = useState<string>(pickHeroPhoto);
  const [logoUrl, setLogoUrl] = useState<string>(getSchoolLogoUrl);

  useEffect(() => {
    const syncHeroPhoto = () => {
      setHeroImgSrc(pickHeroPhoto());
      setLogoUrl(getSchoolLogoUrl());
      setImgFailed(false);
    };
    window.addEventListener('chilimo:data-updated', syncHeroPhoto);
    return () => window.removeEventListener('chilimo:data-updated', syncHeroPhoto);
  }, []);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickCode.trim()) {
      onQuickTrack(quickCode.trim());
    } else {
      onNavigate('status_check');
    }
  };

  return (
    <section className="relative bg-[#0b172a] text-white overflow-hidden border-b border-slate-800">
      {/* Full-bleed Architectural Campus Photography with Directional Contrast Scrim */}
      <div className="relative min-h-[580px] lg:min-h-[640px] flex items-center">
        {!imgFailed ? (
          <img
            src={heroImgSrc}
            alt="Chilimo Academy Burayu Highland Campus"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b172a] via-[#13294b] to-[#0b172a] flex items-center justify-center opacity-40">
            <Building2 className="w-32 h-32 text-slate-600" />
          </div>
        )}

        {/* Measured Contrast Scrim */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#071120]/95 via-[#0b172a]/85 to-[#0b172a]/35"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#071120] via-transparent to-[#071120]/40"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Dominant Editorial Column */}
            <div className="lg:col-span-8 space-y-6 max-w-3xl">
              {/* Quiet Unboxed Institutional Metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-amber-300">
                <span>{CHILIMO_INFO.location}</span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span>{CHILIMO_INFO.grades}</span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span>{t.heroBadge}</span>
              </div>

              <div className="space-y-3">
                <h1 className="font-serif font-bold tracking-tight text-white leading-[1.08] text-[clamp(2.25rem,4.2vw,3.75rem)]">
                  {t.heroHeading}
                </h1>
                <p className="font-serif italic text-lg sm:text-xl text-amber-300/95">
                  "{CHILIMO_INFO.motto}"
                </p>
              </div>

              <p className="text-slate-200 text-base sm:text-lg max-w-2xl leading-relaxed font-normal">
                {t.heroDesc}
              </p>

              {/* Action Row — 1 Primary CTA + 1 Portal Sign In (Tracking Bar right below) */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('register_admission')}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-[#071120] font-bold text-sm rounded-lg transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>{t.heroCtaApply}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('login')}
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>{t.navLogin}</span>
                </button>
              </div>

              {/* Clean Application Tracking Lookup */}
              <div className="pt-4 max-w-lg">
                <form
                  onSubmit={handleQuickSubmit}
                  className="flex rounded-lg overflow-hidden border border-white/20 bg-[#0b172a]/85 backdrop-blur-md p-1 focus-within:border-amber-400 transition-colors"
                >
                  <input
                    type="text"
                    value={quickCode}
                    onChange={(e) => setQuickCode(e.target.value)}
                    placeholder={pickLang(currentLang, 'Koodii Galmee (fkn. CHA-2026-1049)', 'Tracking ID (e.g. CHA-2026-1049)', 'የምዝገባ መከታተያ ቁጥር (CHA-2026-1049)')}
                    className="w-full bg-transparent px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#071120] text-xs font-bold rounded transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {t.heroCtaStatus}
                  </button>
                </form>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
                  <span>{pickLang(currentLang, 'Fakkeenya:', 'Sample tracking:', 'ምሳሌ ቁጥር:')}</span>
                  <button
                    type="button"
                    onClick={() => onQuickTrack('CHA-2026-1049')}
                    className="font-mono text-amber-300 hover:underline cursor-pointer"
                  >
                    CHA-2026-1049
                  </button>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={() => onQuickTrack('CHA-2026-8812')}
                    className="font-mono text-amber-300 hover:underline cursor-pointer"
                  >
                    CHA-2026-8812
                  </button>
                </div>
              </div>
            </div>

            {/* Right Crest Seal Card — Subtle Editorial Frame */}
            <div className="hidden lg:flex lg:col-span-4 justify-end">
              <div className="bg-[#0b172a]/80 backdrop-blur-md border border-white/15 rounded-2xl p-7 text-center w-full max-w-xs">
                <img
                  src={logoUrl}
                  alt="Chilimo Academy Crest"
                  className="w-40 h-40 mx-auto object-contain drop-shadow-xl mb-4"
                />
                <div className="text-xs text-amber-300 font-medium tracking-wide">
                  Burayu, Oromia
                </div>
                <h2 className="font-serif text-xl font-bold text-white mt-1">
                  {CHILIMO_INFO.name}
                </h2>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  KG 1–3 & Grades 1–8 · Afaan Oromoo, English & Amharic
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Quantitative Proof Strip below Hero */}
      <div className="relative z-10 bg-[#071120] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:divide-x md:divide-white/10">
            <div className="md:pr-6">
              <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">850+</div>
              <div className="text-xs text-slate-300 mt-1">{t.heroStatStudents}</div>
            </div>
            <div className="md:px-6">
              <div className="text-2xl sm:text-3xl font-bold text-amber-400 tabular-nums">99%</div>
              <div className="text-xs text-slate-300 mt-1">{t.heroStatPass}</div>
            </div>
            <div className="md:px-6">
              <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">42+</div>
              <div className="text-xs text-slate-300 mt-1">{t.heroStatTeachers}</div>
            </div>
            <div className="md:pl-6">
              <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">6</div>
              <div className="text-xs text-slate-300 mt-1">{t.heroStatBuses}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
