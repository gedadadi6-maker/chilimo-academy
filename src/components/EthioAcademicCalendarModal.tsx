import React, { useState, useMemo } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Printer,
  Clock,
  MapPin,
  Users,
  AlertCircle,
  CheckCircle2,
  Trash2,
  BookOpen,
  PartyPopper,
  DollarSign,
  GraduationCap
} from 'lucide-react';
import { EthioCalendarEvent, EthioEventType } from '../types';
import {
  ETHIO_MONTHS_DATA,
  getStoredEthioEvents,
  saveEthioEvent,
  deleteEthioEvent,
  CHILIMO_INFO
} from '../data/mockData';

interface EthioAcademicCalendarModalProps {
  onClose: () => void;
  userRole?: 'admin' | 'teacher' | 'student' | 'parent';
}

const WEEKDAY_NAMES = [
  { shortOr: 'Dil', nameOr: 'Dilbata', am: 'እሁድ', en: 'Sun', isWeekend: true },
  { shortOr: 'Wix', nameOr: 'Wixata', am: 'ሰኞ', en: 'Mon', isWeekend: false },
  { shortOr: 'Kib', nameOr: 'Kibxata', am: 'ማክሰኞ', en: 'Tue', isWeekend: false },
  { shortOr: 'Roo', nameOr: 'Roobii', am: 'ረቡዕ', en: 'Wed', isWeekend: false },
  { shortOr: 'Kam', nameOr: 'Kamisa', am: 'ሐሙስ', en: 'Thu', isWeekend: false },
  { shortOr: 'Jim', nameOr: 'Jimaata', am: 'አርብ', en: 'Fri', isWeekend: false },
  { shortOr: 'San', nameOr: 'Sanbata', am: 'ቅዳሜ', en: 'Sat', isWeekend: true }
];

// In 2018 E.C. (Sep 11, 2025 G.C.), Month 1 (Fulbaana 1) falls on Thursday (index 4)
// Each month has 30 days => (30 % 7 = 2), so each month starts 2 days forward
const MONTH_START_WEEKDAY_OFFSETS = [
  4, // Fulbaana: Thu
  6, // Onkololeessa: Sat
  1, // Sadaasa: Mon
  3, // Muddee: Wed
  5, // Amajjii: Fri
  0, // Guraandhala: Sun
  2, // Bitooteessa: Tue
  4, // Eebla: Thu
  6, // Caamsaa: Sat
  1, // Waxabajjii: Mon
  3, // Adooleessa: Wed
  5, // Hagayya: Fri
  0  // Qaammee: Sun
];

// Helper to compute Gregorian date string for given Ethio Month (1-13) and Day (1-30)
function getGregorianDateForEthio(monthIndex: number, day: number): { fullStr: string; dayNum: number; monthShort: string } {
  // Fulbaana 1, 2018 E.C. is September 11, 2025
  const baseDate = new Date(2025, 8, 11); // Month 8 is September (0-indexed)
  const elapsedDays = (monthIndex - 1) * 30 + (day - 1);
  const targetDate = new Date(baseDate.getTime() + elapsedDays * 24 * 60 * 60 * 1000);
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthShort = monthNames[targetDate.getMonth()];
  const dayNum = targetDate.getDate();
  const year = targetDate.getFullYear();

  return {
    fullStr: `${monthShort} ${dayNum}, ${year}`,
    dayNum,
    monthShort
  };
}

export const EthioAcademicCalendarModal: React.FC<EthioAcademicCalendarModalProps> = ({
  onClose,
  userRole = 'student'
}) => {
  // Current active month (default to Month 3: Sadaasa / November - active school term)
  const [activeMonthIndex, setActiveMonthIndex] = useState<number>(3);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [events, setEvents] = useState<EthioCalendarEvent[]>(getStoredEthioEvents());
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Event Form State
  const [newEvent, setNewEvent] = useState<{
    title: string;
    category: EthioEventType;
    ethioDay: number;
    description: string;
    location: string;
    time: string;
    targetAudience: 'All' | 'Students' | 'Teachers' | 'Parents' | 'Grade 8 Only' | 'KG 1-3';
    isHolidayNoSchool: boolean;
  }>({
    title: '',
    category: 'school_event',
    ethioDay: 1,
    description: '',
    location: 'Chilimo Academy Campus',
    time: '08:30 AM',
    targetAudience: 'All',
    isHolidayNoSchool: false
  });

  const activeMonthInfo = useMemo(() => {
    return ETHIO_MONTHS_DATA.find(m => m.monthIndex === activeMonthIndex) || ETHIO_MONTHS_DATA[0];
  }, [activeMonthIndex]);

  // Events filtered for the active month
  const monthEvents = useMemo(() => {
    return events.filter(e => {
      const matchMonth = e.ethioMonth === activeMonthIndex;
      const matchCat = categoryFilter === 'all' || e.category === categoryFilter;
      return matchMonth && matchCat;
    });
  }, [events, activeMonthIndex, categoryFilter]);

  // Events grouped by day for grid fast-lookup
  const eventsByDay = useMemo(() => {
    const map: Record<number, EthioCalendarEvent[]> = {};
    monthEvents.forEach(evt => {
      if (!map[evt.ethioDay]) {
        map[evt.ethioDay] = [];
      }
      map[evt.ethioDay].push(evt);
    });
    return map;
  }, [monthEvents]);

  // All events on the currently selected day
  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) return [];
    return events.filter(e => e.ethioMonth === activeMonthIndex && e.ethioDay === selectedDay);
  }, [events, activeMonthIndex, selectedDay]);

  const handlePrevMonth = () => {
    setActiveMonthIndex(prev => (prev === 1 ? 13 : prev - 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setActiveMonthIndex(prev => (prev === 13 ? 1 : prev + 1));
    setSelectedDay(null);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    const greg = getGregorianDateForEthio(activeMonthIndex, newEvent.ethioDay);
    const createdEvent: EthioCalendarEvent = {
      id: `ETH-EVT-USER-${Date.now().toString().slice(-5)}`,
      ethioMonth: activeMonthIndex,
      ethioDay: Number(newEvent.ethioDay),
      ethioYear: 2018,
      gregorianDateString: greg.fullStr,
      title: newEvent.title.trim(),
      category: newEvent.category,
      description: newEvent.description.trim() || 'No additional notes provided.',
      location: newEvent.location.trim() || undefined,
      time: newEvent.time.trim() || undefined,
      targetAudience: newEvent.targetAudience,
      isHolidayNoSchool: newEvent.isHolidayNoSchool
    };

    saveEthioEvent(createdEvent);
    setEvents(getStoredEthioEvents());
    setShowAddModal(false);
    setNewEvent({
      title: '',
      category: 'school_event',
      ethioDay: 1,
      description: '',
      location: 'Chilimo Academy Campus',
      time: '08:30 AM',
      targetAudience: 'All',
      isHolidayNoSchool: false
    });
    setToastMessage("Sagantaan haaraan milkaa'inaan dhaha barnootaa keessatti galmaa'eera! (Event added successfully)");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDeleteEvent = (id: string) => {
    deleteEthioEvent(id);
    setEvents(getStoredEthioEvents());
    setToastMessage("Sagantaan dhaha irraa haqameera (Event deleted).");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getCategoryBadge = (cat: EthioEventType) => {
    switch (cat) {
      case 'exam':
        return { label: 'Qormaata (Exam)', bg: 'bg-rose-100 text-rose-800 border-rose-300', dot: 'bg-rose-500', icon: GraduationCap };
      case 'holiday':
        return { label: 'Ayyaana (Holiday)', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500', icon: PartyPopper };
      case 'tuition_deadline':
        return { label: 'Dhuma Kaffaltii (Fee Due)', bg: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500', icon: DollarSign };
      case 'meeting':
        return { label: "Walga'ii PTA (Meeting)", bg: 'bg-purple-100 text-purple-800 border-purple-300', dot: 'bg-purple-500', icon: Users };
      case 'school_event':
      default:
        return { label: 'Sagantaa (School Event)', bg: 'bg-blue-100 text-blue-800 border-blue-300', dot: 'bg-blue-500', icon: BookOpen };
    }
  };

  // Generate day cells including leading empty slots
  const startDayOffset = MONTH_START_WEEKDAY_OFFSETS[activeMonthIndex - 1];
  const totalDays = activeMonthInfo.daysCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:max-h-none print:shadow-none print:border-none">
        
        {/* HEADER */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white flex items-center justify-between shadow-md print:bg-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
              <CalendarIcon className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Dhaha Barnootaa (Ethio Academic Calendar)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400 text-slate-900 shadow-sm">
                  2018 A.L.I (2025/2026 G.C.)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
                {CHILIMO_INFO.name} • Burayu, Oromia • Qormaata, Ayyaanota, Kaffaltii fi Sagantaalee
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/20"
              title="Print Calendar"
            >
              <Printer className="w-4 h-4 text-emerald-200" />
              <span className="hidden sm:inline">Maxxansi (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              aria-label="Cufi"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* TOAST MESSAGE */}
        {toastMessage && (
          <div className="px-4 py-2.5 bg-emerald-600 text-white text-xs sm:text-sm font-medium flex items-center justify-between transition-all">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white text-xs">
              ✕
            </button>
          </div>
        )}

        {/* CONTROLS BAR: MONTH TOGGLE & QUICK SELECTOR */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 print:bg-white">
          
          {/* Month Stepper */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 shadow-sm transition-colors active:scale-95"
              title="Ji'a Darbe (Previous Month)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center min-w-[200px] px-3 py-1 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-center gap-2">
                <span className="text-base sm:text-lg font-bold text-slate-900">
                  {activeMonthInfo.nameOromo}
                </span>
                <span className="text-sm font-semibold text-emerald-700">
                  ({activeMonthInfo.nameAmharic} - {activeMonthInfo.nameEnglish})
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {activeMonthInfo.gregorianSpan} • {activeMonthInfo.seasonName}
              </div>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 shadow-sm transition-colors active:scale-95"
              title="Ji'a Itti Aanu (Next Month)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Quick jump to current month */}
            <button
              onClick={() => {
                setActiveMonthIndex(3); // Sadaasa
                setSelectedDay(null);
              }}
              className="ml-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-sm"
            >
              Ji'a Ammaa (Sadaasa)
            </button>
          </div>

          {/* Quick Select Buttons / Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 px-2 uppercase tracking-wider">Calali:</span>
              {[
                { id: 'all', label: 'Hunda' },
                { id: 'exam', label: 'Qormaata 📝' },
                { id: 'holiday', label: 'Ayyaana 🌴' },
                { id: 'school_event', label: 'Sagantaa 🏫' },
                { id: 'tuition_deadline', label: 'Kaffaltii 💰' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setCategoryFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    categoryFilter === f.id
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {(userRole === 'admin' || userRole === 'teacher') && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Sagantaa Dabalii</span>
              </button>
            )}
          </div>
        </div>

        {/* 13 MONTHS QUICK NAVIGATOR BAR */}
        <div className="px-6 py-2 bg-slate-100/70 border-b border-slate-200 overflow-x-auto flex items-center gap-1.5 no-scrollbar print:hidden">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">Ji'oottan:</span>
          {ETHIO_MONTHS_DATA.map(m => {
            const isSelected = m.monthIndex === activeMonthIndex;
            const hasEvents = events.some(e => e.ethioMonth === m.monthIndex);
            return (
              <button
                key={m.monthIndex}
                onClick={() => {
                  setActiveMonthIndex(m.monthIndex);
                  setSelectedDay(null);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-emerald-800 text-white font-bold shadow-sm ring-1 ring-emerald-900'
                    : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200'
                }`}
              >
                <span>{m.monthIndex}. {m.nameOromo}</span>
                {hasEvents && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-emerald-500'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* MAIN BODY: CALENDAR GRID & EVENT DETAILS PANEL */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: 7-COLUMN CALENDAR GRID (8 Cols on LG) */}
          <div className="lg:col-span-8 flex flex-col">
            
            {/* Weekday Header */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2 text-center">
              {WEEKDAY_NAMES.map(w => (
                <div
                  key={w.nameOr}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border ${
                    w.isWeekend
                      ? 'bg-rose-50 border-rose-200 text-rose-700'
                      : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="block text-xs sm:text-sm">{w.shortOr}</span>
                  <span className="block text-[10px] font-normal text-slate-500">{w.am} • {w.en}</span>
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 auto-rows-fr">
              {/* Leading Empty Slots for Month Start Offset */}
              {Array.from({ length: startDayOffset }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[70px] sm:min-h-[85px] rounded-xl bg-slate-50/50 border border-dashed border-slate-200/60 opacity-40"
                />
              ))}

              {/* Real Days of the Month */}
              {Array.from({ length: totalDays }).map((_, idx) => {
                const day = idx + 1;
                const dayEvents = eventsByDay[day] || [];
                const isSelected = selectedDay === day;
                const greg = getGregorianDateForEthio(activeMonthIndex, day);
                const isHoliday = dayEvents.some(e => e.isHolidayNoSchool);
                const hasExam = dayEvents.some(e => e.category === 'exam');
                const hasTuition = dayEvents.some(e => e.category === 'tuition_deadline');
                const dayOfWeek = (startDayOffset + idx) % 7;
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                return (
                  <div
                    key={`day-${day}`}
                    onClick={() => setSelectedDay(day)}
                    className={`min-h-[70px] sm:min-h-[85px] p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/70 shadow-md'
                        : isHoliday
                        ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400'
                        : hasExam
                        ? 'bg-rose-50/30 border-rose-200 hover:border-rose-400'
                        : isWeekend
                        ? 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    {/* Day Number Header */}
                    <div className="flex items-start justify-between">
                      <span
                        className={`text-sm sm:text-base font-bold ${
                          isHoliday
                            ? 'text-emerald-700'
                            : hasExam
                            ? 'text-rose-700'
                            : isWeekend
                            ? 'text-slate-500'
                            : 'text-slate-800'
                        }`}
                      >
                        {day}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
                        {greg.monthShort} {greg.dayNum}
                      </span>
                    </div>

                    {/* Event Pill or Badges on the Day */}
                    <div className="space-y-1 mt-1">
                      {dayEvents.slice(0, 2).map(evt => {
                        const badge = getCategoryBadge(evt.category);
                        return (
                          <div
                            key={evt.id}
                            className={`px-1 py-0.5 rounded text-[9px] sm:text-[10px] font-medium truncate flex items-center gap-1 border ${badge.bg}`}
                            title={evt.title}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${badge.dot}`} />
                            <span className="truncate">{evt.title}</span>
                          </div>
                        );
                      })}

                      {dayEvents.length > 2 && (
                        <div className="text-[9px] font-semibold text-slate-500 px-1">
                          +{dayEvents.length - 2} dabalee...
                        </div>
                      )}
                    </div>

                    {/* Bottom Status Indicator Dots */}
                    {dayEvents.length > 0 && (
                      <div className="flex items-center gap-1 mt-1 justify-end">
                        {hasExam && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="Qormaata" />}
                        {isHoliday && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Ayyaana" />}
                        {hasTuition && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Kaffaltii" />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Legend Bar */}
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between text-xs gap-3 print:bg-white">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-semibold text-slate-600 text-xs">Mallattoolee (Legend):</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-700">Qormaata (Exams)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-700">Ayyaana Cufaa (Holidays)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-slate-700">Sagantaa Mana Barumsaa</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-700">Kaffaltii (Tuition Deadline)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="text-slate-700">Walga'ii PTA</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: SELECTED DAY DETAILS / MONTH EVENTS STREAM (4 Cols on LG) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* If a day is selected, show Day Spotlight */}
            {selectedDay !== null && (
              <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200 shadow-sm">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-200/60">
                  <div>
                    <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                      Guyyaa Filatame (Selected Date)
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      {activeMonthInfo.nameOromo} {selectedDay}, 2018 A.L.I
                    </h3>
                    <p className="text-xs text-slate-600">
                      Gregorian: {getGregorianDateForEthio(activeMonthIndex, selectedDay).fullStr}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="p-1 rounded-lg hover:bg-emerald-200/50 text-slate-500 text-xs"
                    title="Cufi Spotlight"
                  >
                    ✕
                  </button>
                </div>

                {selectedDayEvents.length === 0 ? (
                  <div className="py-4 text-center text-slate-500 text-xs">
                    <p className="italic">Guyyaa kanarratti sagantaan addaa hin galmoofne.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Barnoonni idilee bifa baratameen itti fufa.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDayEvents.map(evt => {
                      const badge = getCategoryBadge(evt.category);
                      const IconComp = badge.icon;
                      return (
                        <div
                          key={evt.id}
                          className="bg-white rounded-xl p-3 border border-emerald-100 shadow-sm relative"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`p-1.5 rounded-lg border ${badge.bg}`}>
                                <IconComp className="w-4 h-4" />
                              </span>
                              <div>
                                <h4 className="text-sm font-bold text-slate-900">{evt.title}</h4>
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border mt-0.5 ${badge.bg}`}>
                                  {badge.label}
                                </span>
                              </div>
                            </div>
                            {(userRole === 'admin' || userRole === 'teacher') && (
                              <button
                                onClick={() => handleDeleteEvent(evt.id)}
                                className="text-slate-400 hover:text-rose-600 p-1"
                                title="Sagantaa haqi"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                            {evt.description}
                          </p>

                          <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                            {evt.time && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>{evt.time}</span>
                              </div>
                            )}
                            {evt.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                <span>{evt.location}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              <span>{evt.targetAudience}</span>
                            </div>
                          </div>

                          {evt.isHolidayNoSchool && (
                            <div className="mt-2 px-2 py-1 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px] font-semibold flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Hubachiisa: Manni barumsaa cufaadha (No Classes).</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Comprehensive Events for the Month */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex-1 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Sagantaalee Ji'a {activeMonthInfo.nameOromo}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ida'ama: {monthEvents.length} sagantaalee galmaa'an
                  </p>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {activeMonthInfo.nameAmharic}
                </span>
              </div>

              <div className="mt-3 space-y-2.5 overflow-y-auto max-h-[460px] pr-1">
                {monthEvents.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    <CalendarIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p>Ji'a kana keessa sagantaan calalame hin jiru.</p>
                  </div>
                ) : (
                  monthEvents.map(evt => {
                    const badge = getCategoryBadge(evt.category);
                    const greg = getGregorianDateForEthio(evt.ethioMonth, evt.ethioDay);
                    const isSelected = selectedDay === evt.ethioDay;

                    return (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedDay(evt.ethioDay)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-400 shadow-sm'
                            : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center shadow-xs flex-shrink-0">
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Guyyaa</span>
                              <span className="text-sm font-extrabold text-slate-900 leading-none">{evt.ethioDay}</span>
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                                {evt.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-slate-500 font-medium">
                                  {greg.fullStr}
                                </span>
                                <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold border ${badge.bg}`}>
                                  {badge.label}
                                </span>
                              </div>
                            </div>
                          </div>

                          {(userRole === 'admin' || userRole === 'teacher') && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEvent(evt.id);
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title="Haqi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                          {evt.description}
                        </p>

                        <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                          {evt.time && <span>⏰ {evt.time}</span>}
                          {evt.location && <span>📍 {evt.location}</span>}
                          <span>🎯 {evt.targetAudience}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Tuition Deadline Reminder Box */}
              <div className="mt-auto pt-3 border-t border-slate-200">
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <div className="flex items-center gap-2 font-bold">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                    <span>Hordoffii Kaffaltii Baasii Barnootaa</span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-1">
                    Kaffaltiin ji'a {activeMonthInfo.nameOromo} karaa Telebirr (<span className="font-semibold">{CHILIMO_INFO.phone}</span>) ykn CBE (<span className="font-semibold">1000456789123</span>) kaffalamuu qaba.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* MODAL: ADD CUSTOM EVENT (Admin & Teacher Only) */}
        {showAddModal && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Sagantaa Haaraa Dabali</h3>
                    <p className="text-xs text-slate-500">Ji'a: {activeMonthInfo.nameOromo} (2018 A.L.I)</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="mt-4 space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Duree Sagantaa (Title) *</label>
                  <input
                    type="text"
                    required
                    value={newEvent.title}
                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="fkn: Qormaata Walakkaa Saayinsii, Ayyaana Aadaa..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gosa Sagantaa (Category) *</label>
                    <select
                      value={newEvent.category}
                      onChange={e => setNewEvent({ ...newEvent, category: e.target.value as EthioEventType })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs bg-white"
                    >
                      <option value="school_event">Sagantaa Mana Barumsaa (School Event)</option>
                      <option value="exam">Qormaata (Exam)</option>
                      <option value="holiday">Ayyaana Cufaa (Holiday)</option>
                      <option value="tuition_deadline">Dhuma Kaffaltii (Tuition Deadline)</option>
                      <option value="meeting">Walga'ii PTA (Meeting)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Guyyaa (1 - {totalDays}) *</label>
                    <input
                      type="number"
                      min={1}
                      max={totalDays}
                      required
                      value={newEvent.ethioDay}
                      onChange={e => setNewEvent({ ...newEvent, ethioDay: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Eenyuuf (Target Audience)</label>
                    <select
                      value={newEvent.targetAudience}
                      onChange={e => setNewEvent({ ...newEvent, targetAudience: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs bg-white"
                    >
                      <option value="All">Hundaaf (All)</option>
                      <option value="Students">Barattoota Qofaaf</option>
                      <option value="Teachers">Barsiisota Qofaaf</option>
                      <option value="Parents">Maatii Qofaaf</option>
                      <option value="Grade 8 Only">Kutaa 8ffaa Qofaaf</option>
                      <option value="KG 1-3">Daa'imman KG Qofaaf</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Sa'aatii (Time)</label>
                    <input
                      type="text"
                      value={newEvent.time}
                      onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                      placeholder="fkn: 08:30 AM - 11:30 AM"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bakka (Location)</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="fkn: Main Auditorium, Burayu Campus"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ibsa Dabalataa (Description)</label>
                  <textarea
                    rows={2}
                    value={newEvent.description}
                    onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Qabiyyee sagantichaa gabaabinaan barreessi..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isHolidayCheck"
                    checked={newEvent.isHolidayNoSchool}
                    onChange={e => setNewEvent({ ...newEvent, isHolidayNoSchool: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <label htmlFor="isHolidayCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
                    Manni barumsaa guyyaa kana cufaadha (No School / Holiday)
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-medium"
                  >
                    Dhiisi (Cancel)
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-sm transition-all"
                  >
                    Galmeessi (Save Event)
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Akkaadaamii Cillimoo (Burayu)</span>
            <span>•</span>
            <span>Bilbila: {CHILIMO_INFO.phone}</span>
            <span>•</span>
            <span>Email: {CHILIMO_INFO.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Dhaha Qulqullina Qabu (Ethiopian Calendar Engine)</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-colors"
            >
              Cufi (Close)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
