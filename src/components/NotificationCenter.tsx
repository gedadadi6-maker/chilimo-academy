import React, { useState, useEffect, useRef } from 'react';
import { Bell, FileCheck2, Megaphone, CheckCheck, ArrowRight, X, AlertCircle } from 'lucide-react';
import { Language, UserAccount, AppNotification, AppView } from '../types';
import {
  getStoredNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '../data/mockData';
import { pickLang } from '../translations';

function isNotificationVisibleForUser(
  n: AppNotification,
  user: UserAccount | null
): boolean {
  if (user && (user.role === 'admin' || user.role === 'employee')) return true;
  if (n.targetAudience === 'all') return true;
  if (!user) return n.targetAudience === 'parents' || n.targetAudience === 'students';
  if (user.role === 'student' && n.targetAudience === 'students') return true;
  if (user.role === 'teacher' && n.targetAudience === 'teachers') return true;
  if (user.role === 'parent' && n.targetAudience === 'parents') return true;
  return false;
}

interface NotificationBellDrawerProps {
  currentLang: Language;
  currentUser: UserAccount | null;
  onNavigate: (view: AppView) => void;
  onTrackApplication: (code: string) => void;
}

export const NotificationBellDrawer: React.FC<NotificationBellDrawerProps> = ({
  currentLang,
  currentUser,
  onNavigate,
  onTrackApplication
}) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(getStoredNotifications);
  const [filter, setFilter] = useState<'all' | 'admission_status' | 'notice_board' | 'unread'>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  const readerKey = currentUser ? `usr:${currentUser.id}` : 'guest';

  useEffect(() => {
    const sync = () => setNotifications(getStoredNotifications());
    window.addEventListener('chilimo:data-updated', sync);
    window.addEventListener('chilimo:notification', sync);
    return () => {
      window.removeEventListener('chilimo:data-updated', sync);
      window.removeEventListener('chilimo:notification', sync);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const relevant = notifications.filter((n) => isNotificationVisibleForUser(n, currentUser));
  const unreadCount = relevant.filter((n) => !n.readByKeys.includes(readerKey)).length;

  const filtered = relevant.filter((n) => {
    if (filter === 'unread') return !n.readByKeys.includes(readerKey);
    if (filter === 'admission_status') return n.eventType === 'admission_status';
    if (filter === 'notice_board') return n.eventType === 'notice_board';
    return true;
  });

  const handleItemClick = (item: AppNotification) => {
    const updated = markNotificationRead(item.id, readerKey);
    setNotifications(updated);
    setOpen(false);
    if (item.eventType === 'admission_status' && item.relatedApplicationId) {
      onTrackApplication(item.relatedApplicationId);
    } else {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById('notice-board')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleMarkAll = () => {
    const updated = markAllNotificationsRead(readerKey);
    setNotifications(updated);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={currentLang === 'om' ? 'Beeksisawwan bani' : 'Open notifications'}
        className="relative inline-flex items-center justify-center min-h-[40px] min-w-[40px] px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[#0b172a] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      >
        <Bell className="w-4 h-4 text-[#0b172a]" />
        {unreadCount > 0 && (
          <span className="ml-1.5 px-1.5 py-0.5 rounded bg-amber-500 text-[#071120] text-[10px] font-bold font-mono tabular-nums leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed sm:absolute right-3 sm:right-0 left-3 sm:left-auto top-16 sm:top-full sm:mt-2 w-auto sm:w-[400px] bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3.5 bg-[#0b172a] text-white flex items-center justify-between gap-2">
            <div>
              <h3 className="font-serif text-sm font-bold text-white">
                {pickLang(currentLang, 'Beeksisawwan Haaraa', 'School Notifications', 'የትምህርት ቤት ማሳወቂያዎች')}
              </h3>
              <p className="text-[11px] text-slate-300 tabular-nums">
                {unreadCount} {pickLang(currentLang, 'hin dubbifamne', 'unread', 'ያልተነበበ')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAll}
                  className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 inline-flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>{pickLang(currentLang, 'Hunda Dubbifame', 'Mark all read', 'ሁሉንም አንብብ')}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                className="p-1 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Strip */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1 overflow-x-auto">
            {(
              [
                { key: 'all', label: pickLang(currentLang, 'Hunda', 'All', 'ሁሉም') },
                { key: 'admission_status', label: pickLang(currentLang, 'Galmee', 'Admissions', 'ምዝገባ') },
                { key: 'notice_board', label: pickLang(currentLang, 'Gabatee Oduu', 'Notice Board', 'ማስታወቂያ') },
                { key: 'unread', label: pickLang(currentLang, 'Haaraa', 'Unread', 'ያልተነበቡ') }
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  filter === tab.key
                    ? 'bg-[#0b172a] text-white'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                {pickLang(
                  currentLang,
                  'Beeksisni haaraan hin jiru.',
                  'No notifications in this view.',
                  'በዚህ ምድብ ውስጥ ምንም ማሳወቂያ የለም።'
                )}
              </div>
            ) : (
              filtered.map((item) => {
                const isRead = item.readByKeys.includes(readerKey);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer ${
                      !isRead ? 'bg-amber-50/40' : 'bg-white'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        item.eventType === 'admission_status'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {item.eventType === 'admission_status' ? (
                        <FileCheck2 className="w-4 h-4" />
                      ) : (
                        <Megaphone className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="font-semibold text-amber-800">
                          {item.eventType === 'admission_status'
                            ? pickLang(currentLang, 'Haala Galmee', 'Admission Update', 'የምዝገባ ሁኔታ')
                            : pickLang(currentLang, 'Gabatee Oduu', 'Notice Board', 'ማስታወቂያ ሰሌዳ')}
                        </span>
                        <span className="font-mono text-slate-400 tabular-nums shrink-0">
                          {item.createdAt}
                        </span>
                      </div>

                      <div className="font-semibold text-xs text-[#0b172a] leading-snug">
                        {item.title}
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>

                      <div className="flex items-center justify-between pt-0.5 text-[11px]">
                        {!isRead ? (
                          <span className="font-bold text-amber-700">
                            {pickLang(currentLang, 'Haaraa · Dubbisi', 'Unread · View', 'አዲስ · ይመልከቱ')}
                          </span>
                        ) : (
                          <span className="text-slate-400">{pickLang(currentLang, 'Dubbifame', 'Read', 'ተነቧል')}</span>
                        )}
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface LiveNotificationToastProps {
  currentLang: Language;
  currentUser: UserAccount | null;
  onNavigate: (view: AppView) => void;
  onTrackApplication: (code: string) => void;
}

export const LiveNotificationToast: React.FC<LiveNotificationToastProps> = ({
  currentLang,
  currentUser,
  onNavigate,
  onTrackApplication
}) => {
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onNewNotification = (e: Event) => {
      const detail = (e as CustomEvent<AppNotification>).detail;
      if (!detail) return;
      if (!isNotificationVisibleForUser(detail, currentUser)) return;
      setActiveToast(detail);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setActiveToast(null), 7000);
    };
    window.addEventListener('chilimo:notification', onNewNotification);
    return () => {
      window.removeEventListener('chilimo:notification', onNewNotification);
      if (timer) clearTimeout(timer);
    };
  }, [currentUser]);

  if (!activeToast) return null;

  const readerKey = currentUser ? `usr:${currentUser.id}` : 'guest';

  const handleAction = () => {
    markNotificationRead(activeToast.id, readerKey);
    const target = activeToast;
    setActiveToast(null);
    if (target.eventType === 'admission_status' && target.relatedApplicationId) {
      onTrackApplication(target.relatedApplicationId);
    } else {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById('notice-board')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 max-w-sm w-[calc(100vw-2.5rem)] bg-[#0b172a] text-white rounded-2xl border border-amber-400/50 shadow-2xl p-4 print:hidden"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
          {activeToast.priority === 'urgent' ? (
            <AlertCircle className="w-4 h-4" />
          ) : activeToast.eventType === 'admission_status' ? (
            <FileCheck2 className="w-4 h-4" />
          ) : (
            <Megaphone className="w-4 h-4" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-amber-300">
              {activeToast.eventType === 'admission_status'
                ? pickLang(currentLang, 'Haalli Galmee Jijjiirame', 'Admission Status Changed', 'የምዝገባ ሁኔታ ተቀይሯል')
                : pickLang(currentLang, 'Beeksisa Gabatee Oduu Haaraa', 'New Notice Board Post', 'አዲስ ማስታወቂያ ወጥቷል')}
            </span>
            <button
              type="button"
              onClick={() => setActiveToast(null)}
              aria-label="Dismiss notification"
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="font-serif font-bold text-sm text-white mt-0.5 leading-snug">
            {activeToast.title}
          </div>
          <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
            {activeToast.message}
          </p>
          <div className="mt-3 flex items-center justify-end">
            <button
              type="button"
              onClick={handleAction}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-[#071120] text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <span>
                {activeToast.eventType === 'admission_status'
                  ? pickLang(currentLang, 'Haala Galmee Ilaali', 'View Status', 'ሁኔታውን ይመልከቱ')
                  : pickLang(currentLang, 'Gabatee Oduu Bani', 'Open Notice Board', 'ማስታወቂያ ሰሌዳ ክፈት')}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
