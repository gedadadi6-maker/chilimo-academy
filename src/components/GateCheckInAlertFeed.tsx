import React, { useEffect, useState } from 'react';
import { ShieldCheck, Clock, MapPin, QrCode, CheckCircle2, Bell } from 'lucide-react';
import { GateScanLog, Language } from '../types';
import { getStoredGateScanLogs } from '../data/mockData';

interface GateCheckInAlertFeedProps {
  currentLang: Language;
  studentId: string;
  studentName: string;
  onOpenIdCard?: () => void;
}

export const GateCheckInAlertFeed: React.FC<GateCheckInAlertFeedProps> = ({
  currentLang,
  studentId,
  studentName,
  onOpenIdCard,
}) => {
  const [logs, setLogs] = useState<GateScanLog[]>(() =>
    getStoredGateScanLogs().filter((l) => l.cardHolderId === studentId)
  );

  useEffect(() => {
    const refresh = () => {
      setLogs(getStoredGateScanLogs().filter((l) => l.cardHolderId === studentId));
    };
    window.addEventListener('chilimo:data-updated', refresh);
    return () => window.removeEventListener('chilimo:data-updated', refresh);
  }, [studentId]);

  const latest = logs[0];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[#0b172a]">
              {currentLang === 'om'
                ? 'Beeksisa Seensa & Karra Mana Barumsaa (Gate Check-In Alerts)'
                : 'Campus Gate Check-In & Arrival Alerts'}
            </h3>
            <p className="text-xs text-slate-500">
              {currentLang === 'om'
                ? `Hordoffii nageenyaa yeroo dhugaa barataa ${studentName} (ID: ${studentId})`
                : `Real-time gate & bus boarding arrival updates for ${studentName}`}
            </p>
          </div>
        </div>

        {onOpenIdCard && (
          <button
            onClick={onOpenIdCard}
            className="px-3 py-1.5 bg-[#0b172a] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentLang === 'om' ? 'Kaardii QR Ilaali' : 'View QR ID'}</span>
          </button>
        )}
      </div>

      {latest ? (
        <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-950">
                {latest.scanType === 'bus_boarding'
                  ? 'Konkolaataa Mana Barumsaa Seeneera (Bus Boarding)'
                  : latest.scanType === 'gate_exit'
                  ? 'Mooraa Mana Barumsaa Ba’eera (Gate Exit)'
                  : 'Mooraa Mana Barumsaa Seeneera (Checked In Safely)'}
              </div>
              <div className="text-emerald-800 mt-0.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {latest.gateLocation}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                  <Clock className="w-3 h-3" /> {latest.timestamp}
                </span>
              </div>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-emerald-800 bg-white px-2.5 py-1 rounded border border-emerald-200">
            {latest.paymentClearance === 'cleared' ? 'Fee Cleared' : 'Verified Gate Entry'}
          </span>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
          {currentLang === 'om'
            ? 'Galmeen seensa karraa har’aa ammaaf hin jiru.'
            : 'No gate check-in events recorded yet today.'}
        </div>
      )}

      {logs.length > 0 && (
        <div className="divide-y divide-slate-100 text-xs">
          {logs.slice(0, 4).map((log) => (
            <div key={log.id} className="py-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-semibold text-slate-800">{log.gateLocation}</span>
                <span className="text-slate-500">· {log.notes}</span>
              </div>
              <span className="font-mono text-[11px] text-slate-500 tabular-nums">{log.timestamp}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
