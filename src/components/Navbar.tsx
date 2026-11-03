import React, { useState } from 'react';
import { 
  Globe, 
  Menu, 
  X, 
  Search, 
  UserCheck, 
  Briefcase, 
  Users, 
  Phone, 
  Mail, 
  ChevronDown,
  ShieldCheck,
  Lock,
  LogOut,
  MapPin,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { Language, AppView, UserAccount } from '../types';
import { translations } from '../translations';
import { CHILIMO_INFO } from '../data/mockData';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  currentUser: UserAccount | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activeView,
  onNavigate,
  currentUser,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const t = translations[currentLang];

  const handleNav = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const languageLabels: Record<Language, { label: string; flag: string }> = {
    om: { label: "Afaan Oromoo", flag: "🌳" },
    en: { label: "English", flag: "🇬🇧" },
    am: { label: "አማርኛ", flag: "🇪🇹" }
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
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Utility Bar with Contact & Address */}
      <div className="bg-[#0f1e36] text-slate-300 text-xs py-1.5 px-4 sm:px-6 border-b border-[#1a3156]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              <Phone className="w-3.5 h-3.5" />
              <span>{CHILIMO_INFO.phone}</span>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{CHILIMO_INFO.email}</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{CHILIMO_INFO.location}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick credentials hint */}
            <span className="hidden lg:inline text-[11px] text-amber-200/80 font-mono">
              ID: 1 (Admin) · 153 (Teacher) · 151 (Student) · 163 (Parent)
            </span>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 bg-[#172c4e] hover:bg-[#203c6b] text-white px-2.5 py-1 rounded text-xs transition-colors cursor-pointer border border-slate-700"
                aria-label="Language options"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium">{languageLabels[currentLang].flag} {languageLabels[currentLang].label}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div 
                  className="absolute right-0 mt-1 w-44 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50 text-slate-800"
                  onMouseLeave={() => setLangDropdownOpen(false)}
                >
                  {(['om', 'en', 'am'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        onLanguageChange(lang);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-amber-50 transition-colors ${
                        currentLang === lang ? 'bg-amber-50 font-bold text-amber-950' : 'text-slate-700'
                      }`}
                    >
                      <span>{languageLabels[lang].flag} {languageLabels[lang].label}</span>
                      {currentLang === lang && <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-24 py-2">
          
          {/* Logo & School Name */}
          <div 
            onClick={() => handleNav('home')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center p-1 bg-gradient-to-b from-amber-50 to-white rounded-2xl border-2 border-amber-400/40 shadow-sm group-hover:border-amber-500 transition-all">
              <img 
                src={CHILIMO_INFO.logoUrl} 
                alt="Chilimo Academy Crest Emblem" 
                className="w-18 h-18 sm:w-22 sm:h-22 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-black tracking-tight text-[#0f1e36] leading-none">
                  {CHILIMO_INFO.name}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  {CHILIMO_INFO.grades}
                </span>
              </div>
              <span className="block text-xs sm:text-sm text-amber-800 font-bold tracking-wide mt-1">
                {CHILIMO_INFO.motto} • Burayu, Oromia
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                activeView === 'home' 
                  ? 'text-[#0f1e36] font-bold border-b-2 border-amber-500' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.navHome}
            </button>

            <button
              onClick={() => handleNav('status_check')}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                activeView === 'status_check' 
                  ? 'text-[#0f1e36] font-bold border-b-2 border-amber-500' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4 text-amber-600" />
              <span>{t.navStatus}</span>
            </button>

            <button
              onClick={() => handleNav('about')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                activeView === 'about' 
                  ? 'text-[#0f1e36] font-bold border-b-2 border-amber-500' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.navAbout}
            </button>

            {/* Authenticated or Login Link */}
            {currentUser ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
                <button
                  onClick={() => handleNav(getDashboardViewForUser(currentUser))}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 font-semibold text-xs hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>
                    {currentUser.role.toUpperCase()} (ID: {currentUser.id})
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-500 hover:text-rose-600 rounded transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ml-1 ${
                  activeView === 'login'
                    ? 'bg-[#0f1e36] text-white border-[#0f1e36]'
                    : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.navLogin}</span>
              </button>
            )}
          </nav>

          {/* Desktop Call to Action (Guest Register) */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => handleNav('register_admission')}
              className="px-4 py-2 text-sm font-bold bg-[#0f1e36] hover:bg-[#1a3156] text-white rounded-lg shadow-sm border border-amber-500/30 transition-colors cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.navEnrollNow}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => handleNav('register_admission')}
              className="px-2.5 py-1.5 text-xs font-bold bg-[#0f1e36] text-white rounded"
            >
              {t.navEnrollNow}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-md focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left py-2 px-3 text-sm rounded-md font-medium ${
              activeView === 'home' ? 'bg-amber-50 text-amber-950 font-bold' : 'text-slate-700'
            }`}
          >
            {t.navHome}
          </button>
          <button
            onClick={() => handleNav('status_check')}
            className={`w-full text-left py-2 px-3 text-sm rounded-md font-medium flex items-center gap-2 ${
              activeView === 'status_check' ? 'bg-amber-50 text-amber-950 font-bold' : 'text-slate-700'
            }`}
          >
            <Search className="w-4 h-4 text-amber-600" />
            <span>{t.navStatus}</span>
          </button>
          <button
            onClick={() => handleNav('about')}
            className={`w-full text-left py-2 px-3 text-sm rounded-md font-medium ${
              activeView === 'about' ? 'bg-amber-50 text-amber-950 font-bold' : 'text-slate-700'
            }`}
          >
            {t.navAbout}
          </button>
          <button
            onClick={() => handleNav('register_admission')}
            className="w-full text-left py-2 px-3 text-sm rounded-md font-medium flex items-center gap-2 text-amber-900 bg-amber-50 font-bold"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{t.navEnrollNow}</span>
          </button>

          {currentUser ? (
            <div className="pt-2 mt-2 border-t border-slate-200 space-y-2">
              <button
                onClick={() => handleNav(getDashboardViewForUser(currentUser))}
                className="w-full text-left py-2 px-3 text-sm rounded-md font-bold bg-[#0f1e36] text-white flex items-center justify-between"
              >
                <span>Dashboard: {currentUser.name}</span>
                <span className="text-xs text-amber-300">ID: {currentUser.id}</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full text-left py-2 px-3 text-sm rounded-md font-semibold text-rose-700 bg-rose-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.navLogout}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNav('login')}
              className="w-full text-left py-2 px-3 text-sm rounded-md font-bold bg-slate-900 text-white flex items-center gap-2 mt-2"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{t.navLogin} (Admin: 1 / Teach: 153 / Stu: 151 / Par: 163)</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
