import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  UserCheck,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Phone,
  CheckCircle2,
  X
} from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import { Language, UserAccount } from '../types';
import { translations, pickLang } from '../translations';
import {
  authenticateWithReason,
  canUserAccessPortal,
  getStoredUsers,
  setActiveSession,
  submitPasswordResetRequest,
  appendSecurityAuditLog,
  CHILIMO_INFO,
  getSchoolLogoUrl,
  getStoredSchoolPhotos,
} from '../data/mockData';
import heroCampusImg from '../assets/images/chilimo_hero_campus_1794896696148.jpg';

interface LoginViewProps {
  currentLang: Language;
  onBack: () => void;
  onSuccess: (user: UserAccount) => void;
  onFirebaseToken?: (token: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  currentLang,
  onBack,
  onSuccess,
  onFirebaseToken
}) => {
  const t = translations[currentLang];
  const [idOrEmail, setIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [googleBusy, setGoogleBusy] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetIdOrEmail, setResetIdOrEmail] = useState('');
  const [resetPhone, setResetPhone] = useState('');
  const [resetNote, setResetNote] = useState('');
  const [resetFeedback, setResetFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const result = authenticateWithReason(idOrEmail, password);
    if (!result.ok || !result.user) {
      setErrorMsg(result.message || t.loginError);
      return;
    }

    appendSecurityAuditLog({
      actorId: result.user.id,
      actorName: result.user.name,
      actorRole: result.user.role,
      category: 'auth',
      action: 'PORTAL_LOGIN',
      details: `Signed into ${result.user.role} portal`
    });
    setActiveSession(result.user);
    onSuccess(result.user);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = submitPasswordResetRequest({
      idOrEmail: resetIdOrEmail,
      phone: resetPhone,
      reasonNote: resetNote
    });
    setResetFeedback({ ok: res.ok, text: res.message });
    if (res.ok) {
      setResetIdOrEmail('');
      setResetPhone('');
      setResetNote('');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setGoogleBusy(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();
      onFirebaseToken?.(idToken);

      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data = res.ok ? await res.json() : null;
      const dbUser = data?.user;

      const googleEmail = (result.user.email || '').toLowerCase();
      const storedUsers = getStoredUsers();
      const matched =
        storedUsers.find((u) => u.email.toLowerCase() === googleEmail) ||
        (dbUser?.role === 'admin' ? storedUsers.find((u) => u.role === 'admin') : undefined);

      const signedInUser: UserAccount = matched || {
        id: dbUser?.loginId || String(dbUser?.id || result.user.uid.slice(0, 6)),
        systemId: dbUser?.systemId || `CHA-GGL-${String(dbUser?.id || '01')}`,
        name: result.user.displayName || dbUser?.name || googleEmail,
        email: googleEmail || `${result.user.uid}@chilimo.edu.et`,
        role: (dbUser?.role as UserAccount['role']) || 'student',
        status: 'active',
        dateCreated: new Date().toISOString().slice(0, 10),
        departmentOrGrade:
          dbUser?.role === 'admin' ? 'Main Administration - Burayu' : 'Chilimo Academy Cloud Member',
        phone: CHILIMO_INFO.phone,
      };

      const permission = canUserAccessPortal(signedInUser);
      if (!permission.allowed) {
        setErrorMsg(permission.message || 'Portal access restricted by School Administration.');
        return;
      }

      setActiveSession(signedInUser);
      onSuccess(signedInUser);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setGoogleBusy(false);
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-[#f8fafc] min-h-[85vh] flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto px-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0b172a] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToHome}</span>
        </button>

        {/* Architectural Two-Column Login Card — Zero Exposed Credentials */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 items-stretch">
          {/* Left Visual & Security Context Panel */}
          <div className="md:col-span-5 relative bg-[#0b172a] text-white p-8 flex flex-col justify-between overflow-hidden">
            <img
              src={getStoredSchoolPhotos().find(p => p.placement === 'hero_banner' && p.featured && p.imageDataUrl)?.imageDataUrl || heroCampusImg}
              alt="Chilimo Academy Campus"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071120] via-[#0b172a]/85 to-[#0b172a]/70" />

            <div className="relative z-10">
              <img
                src={getSchoolLogoUrl()}
                alt="Chilimo Academy Crest"
                className="w-20 h-20 object-contain mb-4"
              />
              <div className="text-xs font-medium text-amber-300">
                {CHILIMO_INFO.motto}
              </div>
              <h1 className="font-serif text-2xl font-bold text-white mt-1">
                {CHILIMO_INFO.name}
              </h1>
              <p className="text-slate-300 text-xs leading-relaxed mt-3">
                {t.loginSub}
              </p>
            </div>

            <div className="relative z-10 pt-8 mt-8 border-t border-white/15 space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {currentLang === 'om'
                    ? 'Odeeffannoon seensaa (User ID fi Jecha Icciitii) waajjira mana barumsaatiin qofa kennama.'
                    : currentLang === 'am'
                    ? 'የመግቢያ መለያ እና የይለፍ ቃል በትምህርት ቤቱ አስተዳደር ብቻ ይሰጣል።'
                    : 'Portal IDs and passwords are issued privately by the Chilimo Academy administration office.'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-amber-300 font-mono">
                <Phone className="w-3.5 h-3.5" />
                <span>{CHILIMO_INFO.phone}</span>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="md:col-span-7 p-7 sm:p-10 flex flex-col justify-center">
            <div className="mb-6">
              <div className="text-xs font-semibold text-amber-700">
                {t.loginDemoTitle}
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#0b172a] mt-1">
                {t.loginTitle}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  {t.loginIdLabel}
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    value={idOrEmail}
                    onChange={(e) => setIdOrEmail(e.target.value)}
                    placeholder={
                      currentLang === 'om'
                        ? 'Lakk. ID ykn Email galchi'
                        : currentLang === 'am'
                        ? 'መለያ ቁጥር ወይም ኢሜይል ያስገቡ'
                        : 'Enter User ID or Email'
                    }
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  {t.loginPassLabel}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0b172a] hover:bg-slate-800 text-white font-bold text-sm rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>{t.loginBtn}</span>
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-slate-400">
              <div className="h-px bg-slate-200 flex-1" />
              <span>{currentLang === 'om' ? 'Ykn' : 'Or'}</span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleBusy}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-60"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>
                {googleBusy
                  ? 'Signing in...'
                  : currentLang === 'om'
                  ? 'Google Account tiin Seeni'
                  : currentLang === 'am'
                  ? 'በ Google መለያ ይግቡ'
                  : 'Sign in with Google'}
              </span>
            </button>

            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 leading-relaxed">
              <span>
                {pickLang(
                  currentLang,
                  `Yoo password irraanfattan gaaffii ergaa ykn bilbila ${CHILIMO_INFO.phone} quunnamaa.`,
                  `Forgot your password? Submit a reset request or call ${CHILIMO_INFO.phone}.`,
                  `የይለፍ ቃልዎን ከረሱ ጥያቄ ይላኩ ወይም በ ${CHILIMO_INFO.phone} ይደውሉ።`
                )}
              </span>
              <button
                type="button"
                onClick={() => {
                  setResetFeedback(null);
                  setShowForgotModal(true);
                }}
                className="font-bold text-[#0b172a] hover:text-amber-700 underline cursor-pointer whitespace-nowrap"
              >
                {pickLang(
                  currentLang,
                  'Password Irraanfattee?',
                  'Forgot Password?',
                  'የይለፍ ቃል ረስተዋል?'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Forgot Password Self-Service Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#0b172a]">
                  {pickLang(
                    currentLang,
                    'Gaaffii Haaromsa Password',
                    'Request Password Reset',
                    'የይለፍ ቃል እድሳት መጠየቂያ'
                  )}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleForgotSubmit} className="space-y-3.5 text-xs">
                {resetFeedback && (
                  <div
                    className={`p-3 rounded-lg border flex items-start gap-2 ${
                      resetFeedback.ok
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    {resetFeedback.ok ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <span>{resetFeedback.text}</span>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {pickLang(currentLang, 'Lakk. ID ykn Email *', 'User ID or Email *', 'መለያ ቁጥር ወይም ኢሜይል *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={resetIdOrEmail}
                    onChange={(e) => setResetIdOrEmail(e.target.value)}
                    placeholder="e.g. 151 or email"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {pickLang(currentLang, 'Lakk. Bilbilaa *', 'Registered Phone Number *', 'የስልክ ቁጥር *')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={resetPhone}
                    onChange={(e) => setResetPhone(e.target.value)}
                    placeholder="0912305111"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {pickLang(currentLang, 'Yaada Dabalataa (Optional)', 'Note for Admin (Optional)', 'ተጨማሪ ማብራሪያ')}
                  </label>
                  <input
                    type="text"
                    value={resetNote}
                    onChange={(e) => setResetNote(e.target.value)}
                    placeholder={pickLang(currentLang, 'Sababa / Odeeffannoo...', 'Optional verification note...', 'ማብራሪያ...')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#0b172a] hover:bg-slate-800 text-white font-bold cursor-pointer"
                  >
                    {pickLang(currentLang, 'Gaaffii Ergi', 'Send Reset Request', 'ጥያቄ ላክ')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
