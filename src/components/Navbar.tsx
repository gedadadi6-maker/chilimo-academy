import React, { useState, useEffect } from 'react';
import {
  Globe,
  Menu,
  X,
  Phone,
  Mail,
  ChevronDown,
  ShieldCheck,
  Lock,
  LogOut,
  MapPin,
  Compass,
  BookOpen
} from 'lucide-react';
import { Language, AppView, UserAccount } from '../types';
import { translations, pickLang } from '../translations';
import { CHILIMO_INFO, getSchoolLogoUrl } from '../data/mockData';
import { NotificationBellDrawer } from './NotificationCenter';
import { PWAInstallButton } from './PWAInstallControls';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onQuickTrack?: (code: string) => void;
  currentUser: UserAccount | null;
  onLogout: () => void;
  onOpenTour3D?: () => void;
  onOpenEBook?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activeView,
  onNavigate,
  onQuickTrack,
  currentUser,
  onLogout,
  onOpenTour3D,
  onOpenEBook
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>(getSchoolLogoUrl);
  const t = translations[currentLang];

  useEffect(() => {
    const syncLogo = () => setLogoUrl(getSchoolLogoUrl());
    window.addEventListener('chilimo:data-updated', syncLogo);
    return () => window.removeEventListener('chilimo:data-updated', syncLogo);
  }, []);

  const handleNav = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const languageLabels: Record<Language, { label: string; short: string }> = {
    om: { label: 'Afaan Oromoo', short: 'OM' },
    en: { label: 'English', short: 'EN' },
    am: { label: 'አማርኛ', short: 'AM' }
  };

  const getDashboardViewForUser = (user: UserAccount): AppView => {
    switch (user.role) {
      case 'admin':
      case 'employee':
        return 'admin_dashboard';
      case 'teacher':
        return 'teacher_dashboard';
      case 'student':
        return 'student_dashboard';
      case 'parent':
        return 'parent_dashboard';
      default:
        return 'home';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 print:hidden">
      {/* Quiet Top Utility Bar — Contact & Language only, zero exposed credentials */}
      <div className="bg-[#0b172a] text-slate-300 text-xs py-1.5 px-4 sm:px-6 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-amber-300 font-medium tabular-nums whitespace-nowrap">
              <Phone className="w-3 h-3" />
              <span>{CHILIMO_INFO.phone}</span>
            </span>
            <span className="hidden sm:inline text-slate-600" aria-hidden="true">·</span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-300 whitespace-nowrap">
              <Mail className="w-3 h-3 text-amber-400" />
              <span>{CHILIMO_INFO.email}</span>
            </span>
            <span className="hidden md:inline text-slate-600" aria-hidden="true">·</span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300 whitespace-nowrap">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>{CHILIMO_INFO.location}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-white px-2.5 py-1 rounded text-xs transition-colors cursor-pointer border border-slate-700 whitespace-nowrap"
                aria-label="Language options"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium">{languageLabels[currentLang].label}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-44 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 text-slate-800"
                  onMouseLeave={() => setLangDropdownOpen(false)}
                >
                  {(['om', 'en', 'am'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        onLanguageChange(lang);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                        currentLang === lang ? 'bg-amber-50/70 font-semibold text-[#0b172a]' : 'text-slate-700'
                      }`}
                    >
                      <span>{languageLabels[lang].label}</span>
                      <span className="text-[11px] font-mono text-slate-400">{languageLabels[lang].short}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation — Clean 3-zone structure */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-6 h-18">
          {/* Zone 1: Brand Wordmark + Crest */}
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg"
          >
            <img
              src={logoUrl}
              alt="Chilimo Academy Crest"
              className="w-11 h-11 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#0b172a] whitespace-nowrap">
              {CHILIMO_INFO.name}
            </span>
          </button>

          {/* Zone 2: Single-line Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5">
            <button
              onClick={() => handleNav('home')}
              className={`py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                activeView === 'home'
                  ? 'text-[#0b172a] font-semibold border-amber-500'
                  : 'text-slate-600 hover:text-[#0b172a] border-transparent'
              }`}
            >
              {t.navHome}
            </button>

            <button
              onClick={() => handleNav('status_check')}
              className={`py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                activeView === 'status_check'
                  ? 'text-[#0b172a] font-semibold border-amber-500'
                  : 'text-slate-600 hover:text-[#0b172a] border-transparent'
              }`}
            >
              {t.navStatus}
            </button>

            <button
              onClick={() => handleNav('about')}
              className={`py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                activeView === 'about'
                  ? 'text-[#0b172a] font-semibold border-amber-500'
                  : 'text-slate-600 hover:text-[#0b172a] border-transparent'
              }`}
            >
              {t.navAbout}
            </button>

            <button
              onClick={() => handleNav('kg_hub')}
              className={`py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                activeView === 'kg_hub'
                  ? 'text-[#0b172a] font-semibold border-amber-500'
                  : 'text-slate-600 hover:text-[#0b172a] border-transparent'
              }`}
            >
              KG 1-3
            </button>

            <button
              onClick={() => {
                if (onOpenTour3D) onOpenTour3D();
              }}
              className="flex items-center gap-1.5 py-2 text-sm font-medium text-slate-600 hover:text-[#0b172a] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="3D Campus Tour"
            >
              <Compass className="w-4 h-4 text-amber-600" />
              <span>3D Campus</span>
            </button>

            <button
              onClick={() => {
                if (onOpenEBook) onOpenEBook();
              }}
              className="flex items-center gap-1.5 py-2 text-sm font-medium text-slate-600 hover:text-[#0b172a] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Digital E-Library"
            >
              <BookOpen className="w-4 h-4 text-blue-700" />
              <span>E-Library</span>
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <PWAInstallButton currentLang={currentLang} compact />
            <NotificationBellDrawer
              currentLang={currentLang}
              currentUser={currentUser}
              onNavigate={onNavigate}
              onTrackApplication={(code) => {
                if (onQuickTrack) onQuickTrack(code);
                else onNavigate('status_check');
              }}
            />

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav(getDashboardViewForUser(currentUser))}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[#0b172a] font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span className="capitalize">{currentUser.role}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title={t.navLogout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                  activeView === 'login'
                    ? 'bg-[#0b172a] text-white border-[#0b172a]'
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.navLogin}</span>
              </button>
            )}

            <button
              onClick={() => handleNav('register_admission')}
              className="px-4 py-2 text-xs font-bold bg-[#0b172a] hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.navEnrollNow}
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <NotificationBellDrawer
              currentLang={currentLang}
              currentUser={currentUser}
              onNavigate={handleNav}
              onTrackApplication={(code) => {
                if (onQuickTrack) onQuickTrack(code);
                else handleNav('status_check');
              }}
            />
            <button
              onClick={() => handleNav('register_admission')}
              className="px-3 py-1.5 text-xs font-bold bg-[#0b172a] text-white rounded-lg whitespace-nowrap"
            >
              {t.navEnrollNow}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1.5">
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left py-2.5 px-3 text-sm rounded-lg font-medium text-slate-800 hover:bg-slate-50"
          >
            {t.navHome}
          </button>
          <button
            onClick={() => handleNav('status_check')}
            className="w-full text-left py-2.5 px-3 text-sm rounded-lg font-medium text-slate-800 hover:bg-slate-50"
          >
            {t.navStatus}
          </button>
          <button
            onClick={() => handleNav('about')}
            className="w-full text-left py-2.5 px-3 text-sm rounded-lg font-medium text-slate-800 hover:bg-slate-50"
          >
            {t.navAbout}
          </button>
          <button
            onClick={() => handleNav('kg_hub')}
            className="w-full text-left py-2.5 px-3 text-sm rounded-lg font-medium text-slate-800 hover:bg-slate-50"
          >
            KG 1-3 Learning Hub
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenTour3D) onOpenTour3D();
            }}
            className="w-full text-left py-2.5 px-3 text-sm rounded-lg font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-amber-600" />
            <span>3D Campus Tour</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenEBook) onOpenEBook();
            }}
            className="w-full text-left py-2.5 px-3 text-sm rounded-lg font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-blue-700" />
            <span>Digital E-Library</span>
          </button>

          {currentUser ? (
            <div className="pt-2 mt-2 border-t border-slate-200 space-y-2">
              <button
                onClick={() => handleNav(getDashboardViewForUser(currentUser))}
                className="w-full text-left py-2.5 px-3 text-sm rounded-lg font-bold bg-[#0b172a] text-white flex items-center justify-between"
              >
                <span>Dashboard: {currentUser.name}</span>
                <span className="text-xs text-amber-300 capitalize">{currentUser.role}</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full text-left py-2.5 px-3 text-sm rounded-lg font-semibold text-rose-700 bg-rose-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.navLogout}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNav('login')}
              className="w-full text-left py-2.5 px-3 text-sm rounded-lg font-bold bg-[#0b172a] text-white flex items-center gap-2 mt-2"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{t.navLogin}</span>
            </button>
          )}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {pickLang(currentLang, 'App Bilbilaa', 'Mobile App', 'የሞባይል አፕ')}
            </span>
            <PWAInstallButton currentLang={currentLang} />
          </div>
        </div>
      )}
    </header>
  );
};
