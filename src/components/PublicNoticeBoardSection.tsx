import React, { useState, useEffect } from 'react';
import { Bell, Calendar, ArrowRight, AlertCircle, X, User } from 'lucide-react';
import { Language, AppView, SystemAnnouncement } from '../types';
import { getStoredAnnouncements } from '../data/mockData';

interface PublicNoticeBoardSectionProps {
  currentLang: Language;
  onNavigate: (view: AppView) => void;
}

const COPY: Record<
  Language,
  {
    kicker: string;
    heading: string;
    subtitle: string;
    all: string;
    urgent: string;
    parents: string;
    students: string;
    readMore: string;
    empty: string;
    trackCta: string;
  }
> = {
  om: {
    kicker: 'Gabatee Oduu fi Beeksisootaa · Live Notice Board',
    heading: 'Beeksisootaa fi Odeeffannoo Haaraa Mana Barumsaa',
    subtitle:
      'Sagantaa qormaataa, walgahii maatii (WBG), beeksisa galmee fi oduu haaraa Bulchiinsi Chilimo Academy maxxansu kallattiin asirraa hordofaa.',
    all: 'Hunda',
    urgent: 'Ariifachiisaa',
    parents: 'Maatii',
    students: 'Barattoota',
    readMore: 'Guutuu Dubbisi',
    empty: 'Beeksisni ramaddii kanaa yeroo ammaa hin jiru.',
    trackCta: 'Haala Galmee Hordofi'
  },
  en: {
    kicker: 'Official School Bulletins · Live Notice Board',
    heading: 'School News & Public Announcements',
    subtitle:
      'Stay informed with live exam schedules, PTA general meetings, registration deadlines, and official notices published by Chilimo Academy administration.',
    all: 'All Notices',
    urgent: 'Urgent',
    parents: 'Parents',
    students: 'Students',
    readMore: 'Read Notice',
    empty: 'No announcements match this filter right now.',
    trackCta: 'Track Application Status'
  },
  am: {
    kicker: 'የትምህርት ቤቱ ይፋዊ ማስታወቂያዎች',
    heading: 'ወቅታዊ ዜናዎች እና ማስታወቂያዎች',
    subtitle:
      'የፈተና መርሐግብር፣ የወላጅና መምህራን ስብሰባ፣ የምዝገባ ቀናት እና ከትምህርት ቤቱ አስተዳደር የሚወጡ ወቅታዊ መረጃዎችን እዚህ ይከታተሉ።',
    all: 'ሁሉም',
    urgent: 'አስቸኳይ',
    parents: 'ወላጆች',
    students: 'ተማሪዎች',
    readMore: 'ሙሉውን አንብብ',
    empty: 'በዚህ ምድብ ውስጥ ማስታወቂያ የለም።',
    trackCta: 'የምዝገባ ሁኔታን ይከታተሉ'
  }
};

export const PublicNoticeBoardSection: React.FC<PublicNoticeBoardSectionProps> = ({
  currentLang,
  onNavigate
}) => {
  const copy = COPY[currentLang];
  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>(getStoredAnnouncements);
  const [filter, setFilter] = useState<'all' | 'urgent' | 'parents' | 'students'>('all');
  const [activeNotice, setActiveNotice] = useState<SystemAnnouncement | null>(null);

  useEffect(() => {
    const sync = () => setAnnouncements(getStoredAnnouncements());
    window.addEventListener('chilimo:data-updated', sync);
    return () => window.removeEventListener('chilimo:data-updated', sync);
  }, []);

  const publicNotices = announcements.filter(
    (a) => a.audience === 'all' || a.audience === 'parents' || a.audience === 'students'
  );

  const filteredNotices = publicNotices.filter((item) => {
    if (filter === 'urgent') return item.priority === 'urgent';
    if (filter === 'parents') return item.audience === 'parents' || item.audience === 'all';
    if (filter === 'students') return item.audience === 'students' || item.audience === 'all';
    return true;
  });

  const audienceLabel = (aud: SystemAnnouncement['audience']) => {
    if (aud === 'parents') return currentLang === 'om' ? 'Maatiif' : 'Parents';
    if (aud === 'students') return currentLang === 'om' ? 'Barattootaaf' : 'Students';
    if (aud === 'teachers') return currentLang === 'om' ? 'Barsiisotaaf' : 'Teachers';
    return currentLang === 'om' ? 'Hawaasa Hundaaf' : 'All Community';
  };

  return (
    <section
      id="notice-board"
      className="py-16 sm:py-20 bg-[#f8fafc] border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-amber-700">
              <Bell className="w-4 h-4" />
              <span>{copy.kicker}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0b172a] mt-2">
              {copy.heading}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
              {copy.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 self-start md:self-auto">
            {(
              [
                { key: 'all', label: copy.all },
                { key: 'urgent', label: copy.urgent },
                { key: 'parents', label: copy.parents },
                { key: 'students', label: copy.students }
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  filter === tab.key
                    ? 'bg-[#0b172a] text-white'
                    : 'text-slate-600 hover:text-[#0b172a] hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredNotices.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-sm text-slate-500">
            {copy.empty}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotices.slice(0, 6).map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-amber-400 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{audienceLabel(item.audience)}</span>
                    <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {item.date}
                    </span>
                  </div>

                  {item.priority === 'urgent' && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-rose-700">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{copy.urgent}</span>
                    </div>
                  )}

                  <h3 className="font-serif text-lg font-bold text-[#0b172a] mt-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm mt-2.5 leading-relaxed line-clamp-3">
                    {item.content}
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500 truncate inline-flex items-center gap-1">
                    <User className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.author}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveNotice(item)}
                    className="font-semibold text-[#0b172a] hover:text-amber-700 transition-colors inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>{copy.readMore}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => onNavigate('status_check')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#0b172a] hover:text-amber-700 transition-colors cursor-pointer"
          >
            <span>{copy.trackCta}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Full Notice Modal */}
      {activeNotice && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveNotice(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-[#0b172a] text-white flex items-center justify-between">
              <div className="text-xs text-amber-300 font-medium">
                {audienceLabel(activeNotice.audience)} · {activeNotice.date}
              </div>
              <button
                type="button"
                onClick={() => setActiveNotice(null)}
                aria-label="Close notice"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {activeNotice.priority === 'urgent' && (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700">
                  <AlertCircle className="w-4 h-4" />
                  <span>{copy.urgent}</span>
                </div>
              )}
              <h3 className="font-serif text-2xl font-bold text-[#0b172a]">
                {activeNotice.title}
              </h3>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {activeNotice.content}
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{activeNotice.author}</span>
                <span>Chilimo Academy · Burayu</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
