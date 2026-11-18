import React, { useState } from 'react';
import { Megaphone, Send, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { GradeBroadcastMessage, Language, UserAccount } from '../types';
import { getStoredGradeBroadcasts, saveAllGradeBroadcasts } from '../data/mockData';

interface GradeBroadcastPanelProps {
  currentLang: Language;
  currentAdmin: UserAccount;
  onNotify: (msg: string) => void;
}

const GRADE_TARGETS = [
  'ALL',
  'KG 1',
  'KG 2',
  'KG 3',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8'
];

export const GradeBroadcastPanel: React.FC<GradeBroadcastPanelProps> = ({
  currentAdmin,
  onNotify
}) => {
  const [broadcasts, setBroadcasts] = useState<GradeBroadcastMessage[]>(() => getStoredGradeBroadcasts());
  const [targetGrade, setTargetGrade] = useState<string>('Grade 7');
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const item: GradeBroadcastMessage = {
      id: `BRD-${Date.now().toString().slice(-5)}`,
      targetGrade,
      urgency,
      title: title.trim(),
      message: message.trim(),
      senderName: currentAdmin.name,
      senderRole: 'admin',
      createdAt: new Date().toISOString().split('T')[0],
      readByUserIds: []
    };

    const updated = [item, ...broadcasts];
    setBroadcasts(updated);
    saveAllGradeBroadcasts(updated);
    setTitle('');
    setMessage('');
    onNotify(`Beeksisni gara ${targetGrade === 'ALL' ? 'Kutaalee Hundaatti' : targetGrade} ergameera!`);
  };

  const handleDelete = (id: string) => {
    const updated = broadcasts.filter(b => b.id !== id);
    setBroadcasts(updated);
    saveAllGradeBroadcasts(updated);
    onNotify('Beeksisni haqameera.');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Megaphone className="w-5 h-5 text-amber-600" />
          <div>
            <h3 className="font-serif text-base font-bold text-[#0f1e36]">
              Beeksisa Kutaa Kutaan (Grade-Level Broadcast)
            </h3>
            <p className="text-[11px] text-slate-500">
              Maatii fi barattoota kutaa filatameef ergaa hatattamaa ergaa
            </p>
          </div>
        </div>

        <form onSubmit={handlePublish} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kutaa (Target Grade)</label>
              <select
                value={targetGrade}
                onChange={(e) => setTargetGrade(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
              >
                {GRADE_TARGETS.map(g => (
                  <option key={g} value={g}>{g === 'ALL' ? 'Kutaalee Hunda (All Grades)' : g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sadarkaa (Priority)</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as 'normal' | 'urgent')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
              >
                <option value="normal">Idilee (Normal)</option>
                <option value="urgent">Hatattamaa (Urgent)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mata-Duree Beeksisa</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Fkn: Qormaata / Walgahii Maatii / Boqonnaa"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ergaa Guutuu</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ergaa maatiif ykn barattootaaf dabarsuu barbaaddan asitti barreessaa..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#0f1e36] hover:bg-[#1a3156] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer border border-amber-400/30"
          >
            <Send className="w-4 h-4 text-amber-400" />
            <span>Ergaa Kutaa Kanaaf Ergi (Publish Broadcast)</span>
          </button>
        </form>
      </div>

      <div className="lg:col-span-7 space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
          Beeksisawwan Ergamaniif Hordoffii Dubbisuu ({broadcasts.length})
        </h4>
        {broadcasts.map(b => (
          <div
            key={b.id}
            className={`bg-white rounded-xl border p-4 shadow-xs ${
              b.urgency === 'urgent' ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-[#0f1e36] text-amber-300 font-bold">
                    {b.targetGrade === 'ALL' ? 'All Grades' : b.targetGrade}
                  </span>
                  {b.urgency === 'urgent' && (
                    <span className="inline-flex items-center gap-1 text-rose-700 font-bold">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Urgent</span>
                    </span>
                  )}
                  <span className="text-slate-400 font-mono">{b.createdAt}</span>
                </div>
                <h5 className="font-bold text-sm text-slate-900 mt-1">{b.title}</h5>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(b.id)}
                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded cursor-pointer"
                title="Delete Broadcast"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-700 mt-2 leading-relaxed">{b.message}</p>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Ergaan: {b.senderName}</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Dubbiseera: {b.readByUserIds.length} users</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
