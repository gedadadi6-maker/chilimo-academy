import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Printer, 
  ArrowLeft,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Language, ApplicationRecord, ApplicationStatusStage } from '../types';
import { translations } from '../translations';
import { getStoredApplications, CHILIMO_INFO } from '../data/mockData';

interface ApplicationStatusViewProps {
  currentLang: Language;
  onBack: () => void;
  initialCode?: string;
}

export const ApplicationStatusView: React.FC<ApplicationStatusViewProps> = ({
  currentLang,
  onBack,
  initialCode = ''
}) => {
  const t = translations[currentLang];
  const [searchQuery, setSearchQuery] = useState(initialCode);
  const [searchedRecord, setSearchedRecord] = useState<ApplicationRecord | null>(() => {
    if (initialCode) {
      const apps = getStoredApplications();
      return apps.find(a => a.id.toLowerCase() === initialCode.toLowerCase()) || null;
    }
    return null;
  });
  const [hasSearched, setHasSearched] = useState(Boolean(initialCode));

  const handleSearch = (codeToSearch?: string) => {
    const code = (codeToSearch !== undefined ? codeToSearch : searchQuery).trim();
    if (!code) return;
    
    setSearchQuery(code);
    setHasSearched(true);
    const apps = getStoredApplications();
    const found = apps.find(a => a.id.toLowerCase() === code.toLowerCase()) || null;
    setSearchedRecord(found);
  };

  const getStageOrder = (stage: ApplicationStatusStage): number => {
    switch (stage) {
      case 'received': return 1;
      case 'review': return 2;
      case 'exam_scheduled': return 3;
      case 'waitlist': return 3;
      case 'accepted': return 4;
      default: return 1;
    }
  };

  const stages = [
    { key: 'received', label: "Application Received" },
    { key: 'review', label: "Document Review" },
    { key: 'exam', label: "Entrance Assessment" },
    { key: 'accepted', label: "Admission Accepted" },
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0f1e36] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToHome}</span>
        </button>

        {/* Title Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex items-center gap-4 mb-3">
            <img 
              src={CHILIMO_INFO.logoUrl} 
              alt="Chilimo Logo" 
              className="w-14 h-14 object-contain"
            />
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-700 font-bold block">
                Chilimo Academy • Burayu Campus
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#0f1e36]">
                Check for Acceptance (Guest Tracking)
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm">
                Enter your application reference code (e.g. CHA-2026-1049) to track admission status.
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. CHA-2026-1049"
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 uppercase font-mono tracking-wider font-bold"
            />
            <button
              onClick={() => handleSearch()}
              className="px-6 py-3 bg-[#0f1e36] hover:bg-[#1a3156] text-white font-bold text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-amber-400/30"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Track Acceptance</span>
            </button>
          </div>

          {/* Quick code pills */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
            <span className="font-bold text-slate-700">Sample Reference Codes:</span>
            <button
              onClick={() => handleSearch('CHA-2026-1049')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-amber-50 hover:text-amber-900 rounded text-slate-700 transition-colors cursor-pointer border border-slate-200"
            >
              CHA-2026-1049 (Accepted)
            </button>
            <button
              onClick={() => handleSearch('CHA-2026-8812')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-amber-50 hover:text-amber-900 rounded text-slate-700 transition-colors cursor-pointer border border-slate-200"
            >
              CHA-2026-8812 (Exam Scheduled)
            </button>
          </div>
        </div>

        {/* Results */}
        {hasSearched && (
          <div>
            {searchedRecord ? (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                
                {/* Result Header */}
                <div className="bg-[#0f1e36] text-white p-6 sm:p-8 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={CHILIMO_INFO.logoUrl} 
                      alt="Chilimo Logo" 
                      className="w-14 h-14 object-contain bg-white/10 p-1 rounded-xl"
                    />
                    <div>
                      <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
                        Chilimo Academy Admissions Registry
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black font-serif text-white mt-0.5">
                        {searchedRecord.fullName}
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-slate-300 mt-1 font-mono">
                        <span>ID: {searchedRecord.id}</span>
                        <span>·</span>
                        <span>Submitted: {searchedRecord.dateSubmitted}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold rounded-lg border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Slip</span>
                    </button>
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ${
                      searchedRecord.status === 'accepted'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : searchedRecord.status === 'exam_scheduled'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-500/20 text-slate-200 border border-slate-500/40'
                    }`}>
                      {searchedRecord.status}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50/50">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
                    Admissions Progress Timeline
                  </h3>

                  <div className="grid grid-cols-4 gap-2">
                    {stages.map((st, idx) => {
                      const currentRank = getStageOrder(searchedRecord.status);
                      const stageNumber = idx + 1;
                      const isCompleted = currentRank >= stageNumber;
                      const isCurrent = currentRank === stageNumber;

                      return (
                        <div key={st.key} className="text-center">
                          <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-colors ${
                            isCompleted 
                              ? 'bg-[#0f1e36] text-amber-400 border border-amber-400' 
                              : 'bg-slate-200 text-slate-500'
                          } ${isCurrent ? 'ring-4 ring-amber-300' : ''}`}>
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stageNumber}
                          </div>
                          <span className={`text-[11px] font-bold block leading-tight ${
                            isCompleted ? 'text-slate-900' : 'text-slate-400'
                          }`}>
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-amber-950">
                          {searchedRecord.statusText[currentLang] || searchedRecord.statusText.en}
                        </h4>
                        <p className="text-xs text-amber-900 mt-1">
                          {searchedRecord.details}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block mb-1">Target Grade:</span>
                      <strong className="text-sm text-slate-900">{searchedRecord.gradeOrSubject}</strong>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block mb-1">Campus Location:</span>
                      <strong className="text-sm text-slate-900">{CHILIMO_INFO.location}</strong>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block mb-1">Contact Phone:</span>
                      <strong className="text-sm font-mono text-slate-900">{searchedRecord.phone}</strong>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block mb-1">Registrar Office Hotline:</span>
                      <strong className="text-sm font-mono text-amber-800">{CHILIMO_INFO.phone}</strong>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-xs">
                <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900">
                  No Application Record Found
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-2">
                  Please verify your reference number format (e.g. CHA-2026-1049).
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
