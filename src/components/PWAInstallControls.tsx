import React, { useState } from 'react';
import { Download, Smartphone, WifiOff, X } from 'lucide-react';
import { Language } from '../types';
import { useOnlineStatus, usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  currentLang: Language;
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  currentLang,
  compact = false,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const installLabel =
    currentLang === 'om'
      ? compact
        ? 'App Fe’i'
        : 'App Bilbilaa Fe’i'
      : currentLang === 'am'
      ? compact
        ? 'አፕ ጫን'
        : 'አፑን ይጫኑ'
      : compact
      ? 'Install'
      : 'Install App';

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-3 py-1.5 text-xs font-bold text-[#0b172a] transition-colors cursor-pointer whitespace-nowrap shrink-0"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{installLabel}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-600" />
          <span>{installLabel}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                  {currentLang === 'om'
                    ? 'iPhone / iPad Irratti Fe’i'
                    : currentLang === 'am'
                    ? 'በ iPhone / iPad ላይ ይጫኑ'
                    : 'Install on iPhone / iPad'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentLang === 'om' ? (
                  <>
                    1. Safari keessaa mallattoo <strong>Share</strong> tuqi.<br />
                    2. Gadi bu’iitii <strong>Add to Home Screen</strong> filadhu.
                  </>
                ) : currentLang === 'am' ? (
                  <>
                    1. በ Safari ውስጥ የ <strong>Share</strong> ምልክትን ይንኩ።<br />
                    2. ወደ ታች ወርደው <strong>Add to Home Screen</strong> የሚለውን ይምረጡ።
                  </>
                ) : (
                  <>
                    1. Tap the <strong>Share</strong> button in your Safari toolbar.<br />
                    2. Scroll down and tap <strong>Add to Home Screen</strong>.
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-lg bg-[#0f1e36] py-2 text-xs font-bold text-white hover:bg-[#1a3156] cursor-pointer"
              >
                {currentLang === 'om' ? 'Cufi' : currentLang === 'am' ? 'ዝጋ' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

interface OfflineIndicatorProps {
  currentLang: Language;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ currentLang }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-[#0f1e36] border border-amber-400 px-3.5 py-2 text-xs font-semibold text-white shadow-lg print:hidden">
      <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      <span>
        {currentLang === 'om'
          ? 'Interneetiin Citaadha — Daataa kuufame (Offline) fayyadamaa jira'
          : currentLang === 'am'
          ? 'ኢንተርኔት የለም — የተቀመጠ መረጃ (Offline) በመጠቀም ላይ'
          : 'Offline Mode — Using cached school records'}
      </span>
    </div>
  );
};
