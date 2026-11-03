import React, { useState } from 'react';
import { 
  Lock, 
  KeyRound, 
  UserCheck, 
  ArrowLeft, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  Users, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Language, UserAccount } from '../types';
import { translations } from '../translations';
import { authenticate, setActiveSession, CHILIMO_INFO } from '../data/mockData';

interface LoginViewProps {
  currentLang: Language;
  onBack: () => void;
  onSuccess: (user: UserAccount) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  currentLang,
  onBack,
  onSuccess
}) => {
  const t = translations[currentLang];
  const [idOrEmail, setIdOrEmail] = useState('1');
  const [password, setPassword] = useState('123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const user = authenticate(idOrEmail, password);
    if (!user) {
      setErrorMsg(t.loginError);
      return;
    }

    setActiveSession(user);
    onSuccess(user);
  };

  const handleQuickDemo = (id: string, pass: string) => {
    setIdOrEmail(id);
    setPassword(pass);
    const user = authenticate(id, pass);
    if (user) {
      setActiveSession(user);
      onSuccess(user);
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-[85vh] flex items-center justify-center">
      <div className="w-full max-w-lg mx-auto px-4">
        
        {/* Back Link */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0f1e36] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToHome}</span>
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
          
          {/* Header with Emblem Logo */}
          <div className="bg-[#0f1e36] text-white p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div className="relative z-10">
              <img 
                src={CHILIMO_INFO.logoUrl} 
                alt="Chilimo Academy Crest" 
                className="w-28 h-28 mx-auto object-contain drop-shadow-xl mb-3 hover:scale-105 transition-transform"
              />
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block">
                {CHILIMO_INFO.motto}
              </span>
              <h1 className="font-serif text-2xl font-black text-white mt-0.5">
                {CHILIMO_INFO.name}
              </h1>
              <p className="text-slate-300 text-xs mt-1">
                {t.loginTitle}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {t.loginIdLabel}
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={idOrEmail}
                  onChange={(e) => setIdOrEmail(e.target.value)}
                  placeholder="e.g. 1, 153, 151, or 163"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {t.loginPassLabel}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="123"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0f1e36] hover:bg-[#1a3156] text-white font-bold text-sm rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 border border-amber-500/30"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{t.loginBtn}</span>
            </button>

            {/* Quick Demo Credentials Toolbar - User Required */}
            <div className="pt-5 border-t border-slate-100">
              <span className="block text-center text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-3">
                {t.loginDemoTitle}
              </span>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Admin */}
                <button
                  type="button"
                  onClick={() => handleQuickDemo('1', '123')}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Admin 👨‍💻</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block font-mono mt-0.5">id: 1 / pass: 123</span>
                </button>

                {/* Teacher */}
                <button
                  type="button"
                  onClick={() => handleQuickDemo('153', '123')}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Briefcase className="w-4 h-4 text-teal-600" />
                    <span>Teacher 👩‍🏫</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block font-mono mt-0.5">id: 153 / pass: 123</span>
                </button>

                {/* Student */}
                <button
                  type="button"
                  onClick={() => handleQuickDemo('151', '123')}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>Student 👦</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block font-mono mt-0.5">id: 151 / pass: 123</span>
                </button>

                {/* Parent */}
                <button
                  type="button"
                  onClick={() => handleQuickDemo('163', '123')}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Parent 👵</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block font-mono mt-0.5">id: 163 / pass: 123</span>
                </button>
              </div>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
