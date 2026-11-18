import React, { useState } from 'react';
import { Megaphone, CheckCircle2, AlertTriangle, Check } from 'lucide-react';
import { GradeBroadcastMessage } from '../types';
import { getStoredGradeBroadcasts, markGradeBroadcastRead } from '../data/mockData';

interface GradeBroadcastFeedProps {
  userId: string;
  gradeText?: string;
}

export const GradeBroadcastFeed: React.FC<GradeBroadcastFeedProps> = ({ userId, gradeText = '' }) => {
  const [broadcasts, setBroadcasts] = useState<GradeBroadcastMessage[]>(() => getStoredGradeBroadcasts());

  const relevant = broadcasts.filter(b => {
    if (b.targetGrade === 'ALL') return true;
    return gradeText.toLowerCase().includes(b.targetGrade.toLowerCase());
  });

  if (relevant.length === 0) return null;

  const handleMarkRead = (id: string) => {
    setBroadcasts(markGradeBroadcastRead(id, userId));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2.5 mb-6">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0f1e36]">
          <Megaphone className="w-4 h-4 text-amber-600" />
          <span>Beeksisa Kutaa Keessanii (Official School &amp; Grade Notices)</span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">{relevant.length} notices</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {relevant.slice(0, 4).map(item => {
          const isRead = item.readByUserIds.includes(userId);
          return (
            <div
              key={item.id}
              className={`p-3 rounded-lg border text-xs flex flex-col justify-between gap-2 ${
                item.urgency === 'urgent'
                  ? 'border-rose-200 bg-rose-50/50'
                  : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-[10px]">
                  <span className="font-bold text-[#0f1e36]">
                    {item.targetGrade === 'ALL' ? 'All Grades' : item.targetGrade}
                  </span>
                  {item.urgency === 'urgent' && (
                    <span className="inline-flex items-center gap-1 text-rose-700 font-bold">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Urgent</span>
                    </span>
                  )}
                </div>
                <div className="font-bold text-slate-900 mt-0.5">{item.title}</div>
                <p className="text-[11px] text-slate-600 mt-1">{item.message}</p>
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/70 text-[10px]">
                <span className="text-slate-400 font-mono">{item.createdAt}</span>
                {isRead ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Dubbisameera (Read)</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleMarkRead(item.id)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0f1e36] text-white rounded font-bold cursor-pointer"
                  >
                    <Check className="w-3 h-3 text-amber-400" />
                    <span>Dubbiseera</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
