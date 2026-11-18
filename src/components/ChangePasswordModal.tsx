import React, { useState } from 'react';
import { X, KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { Language, UserAccount } from '../types';
import { changeUserPassword, setActiveSession } from '../data/mockData';

interface ChangePasswordModalProps {
  currentLang: Language;
  user: UserAccount;
  onClose: () => void;
  onPasswordChanged?: (updatedUser: UserAccount) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  currentLang,
  user,
  onClose,
  onPasswordChanged,
}) => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPass.trim().length < 4) {
      setError(
        currentLang === 'om'
          ? 'Jechi icciitii haaraan yoo xiqqaate qubee/lakkoofsa 4 qabaachuu qaba.'
          : 'New password must be at least 4 characters long.'
      );
      return;
    }

    if (newPass.trim() !== confirmPass.trim()) {
      setError(
        currentLang === 'om'
          ? 'Jechi icciitii haaraan lamaan wal hin simu.'
          : 'New password and confirmation do not match.'
      );
      return;
    }

    const res = changeUserPassword(user.id, currentPass, newPass);
    if (!res.ok || !res.user) {
      setError(
        currentLang === 'om'
          ? 'Jechi icciitii ammaa sirrii miti. Irra deebi’aa yaalaa.'
          : res.message
      );
      return;
    }

    setActiveSession(res.user);
    onPasswordChanged?.(res.user);
    setSuccess(
      currentLang === 'om'
        ? 'Jechi icciitii keessan milkaa’inaan jijjiirameera!'
        : 'Your password has been updated securely!'
    );
    setTimeout(() => onClose(), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0b172a] text-amber-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0b172a]">
                {currentLang === 'om' ? 'Jecha Icciitii Jijjiiri' : 'Change Account Password'}
              </h3>
              <p className="text-xs text-slate-500">
                {user.name} · ID: <span className="font-mono font-semibold">{user.id}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {currentLang === 'om' ? 'Jecha Icciitii Ammaa' : 'Current Password'}
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {currentLang === 'om' ? 'Jecha Icciitii Haaraa (yoo xiqqaate 4)' : 'New Password (min 4 chars)'}
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {currentLang === 'om' ? 'Jecha Icciitii Haaraa Mirkaneessi' : 'Confirm New Password'}
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-[11px] text-amber-950 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              {currentLang === 'om'
                ? 'Erga jijjiirtanii booda jecha icciitii haaraa qofaan seenuu dandeessu.'
                : 'After updating, only your new password will unlock your portal.'}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              {currentLang === 'om' ? 'Dhiisi' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0b172a] hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              {currentLang === 'om' ? 'Olkaa’i (Save)' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
