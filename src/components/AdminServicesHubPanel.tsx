import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Users,
  KeyRound,
  FileCheck2,
  UserPlus,
  CalendarClock,
  FileSpreadsheet,
  DollarSign,
  Sliders,
  Landmark,
  Zap,
  Package,
  BookOpen,
  Clock,
  Calendar,
  Award,
  Library,
  Compass,
  Baby,
  Bus,
  MapPin,
  QrCode,
  Utensils,
  HeartPulse,
  MessageSquare,
  Bell,
  Smartphone,
  FileText,
  Camera,
  Edit3,
  Cloud,
  BarChart3,
  Megaphone,
  ClipboardCheck
} from 'lucide-react';
import { Language } from '../types';
import { pickLang } from '../translations';

export interface AdminServiceEntry {
  id: string;
  category:
    | 'portals'
    | 'finance'
    | 'academics'
    | 'library_kg'
    | 'safety_transport'
    | 'comms_cloud';
  titleOm: string;
  titleEn: string;
  titleAm?: string;
  descOm: string;
  descEn: string;
  descAm?: string;
  icon: React.ComponentType<{ className?: string }>;
  onOpen: () => void;
}

interface AdminServicesHubPanelProps {
  currentLang: Language;
  services: AdminServiceEntry[];
}

const CATEGORY_LABELS: Record<
  AdminServiceEntry['category'],
  { om: string; en: string; am: string }
> = {
  portals: {
    om: '01. Galmee, Portaalota & Hoggansa',
    en: '01. Admissions, Portals & Administration',
    am: '01. ምዝገባ፣ ፖርታሎች እና አስተዳደር'
  },
  finance: {
    om: '02. Faayinaansii, Baankii & Kaffaltii',
    en: '02. Finance, Bank Accounts & Billing',
    am: '02. ፋይናንስ፣ ባንክ እና ክፍያ'
  },
  academics: {
    om: '03. Barnoota, Qormaata & Ragaa',
    en: '03. Academics, Exams & Oversight',
    am: '03. ትምህርት፣ ፈተና እና ክትትል'
  },
  library_kg: {
    om: '04. Mana Kitaabaa, KG 1–3 & Gumiilee',
    en: '04. Library, KG Studio & Student Clubs',
    am: '04. ቤተ-መጽሐፍት፣ KG 1–3 እና ክበባት'
  },
  safety_transport: {
    om: '05. Geejjiba Baasii, Nageenya Karraa & Nyaata',
    en: '05. Transport, Gate Safety & Cafeteria',
    am: '05. ትራንስፖርት፣ የበር ደህንነት እና ምግብ'
  },
  comms_cloud: {
    om: '06. Ergaa, Midhiyaa, Xalayaa & Cloud',
    en: '06. Messaging, Media, Official Docs & Cloud',
    am: '06. መልዕክቶች፣ ሚዲያ፣ ደብዳቤዎች እና ክላውድ'
  }
};

export const AdminServicesHubPanel: React.FC<AdminServicesHubPanelProps> = ({
  currentLang,
  services
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | AdminServiceEntry['category']>('all');

  const filtered = services.filter((srv) => {
    const matchesCat = selectedCategory === 'all' || srv.category === selectedCategory;
    if (!matchesCat) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      srv.titleOm.toLowerCase().includes(q) ||
      srv.titleEn.toLowerCase().includes(q) ||
      srv.descOm.toLowerCase().includes(q) ||
      srv.descEn.toLowerCase().includes(q)
    );
  });

  const categoriesOrder: AdminServiceEntry['category'][] = [
    'portals',
    'finance',
    'academics',
    'library_kg',
    'safety_transport',
    'comms_cloud'
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0f1e36]">
              {pickLang(
                currentLang,
                'Tajaajiloota Mana Barumsaa Hundaa (Master Admin Hub)',
                'All School Webapp Services Directory',
                'ሁሉም የትምህርት ቤት ድረ-ገጽ አገልግሎቶች'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {pickLang(
                currentLang,
                `Tajaajiloonni weebsaayitii fi ERP Chilimo Academy hundi (${services.length}) asirraa to'atamu.`,
                `Every service available across the Chilimo Academy portal ecosystem (${services.length} modules) accessible from Admin.`,
                `በቺሊሞ አካዳሚ ስርዓት ውስጥ ያሉ ሁሉም (${services.length}) አገልግሎቶች ከዚህ ይመራሉ።`
              )}
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={pickLang(currentLang, 'Tajaajila barbaadi...', 'Filter services...', 'አገልግሎት ፈልግ...')}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#0f1e36] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {pickLang(currentLang, `Hunda (${services.length})`, `All (${services.length})`, `ሁሉም (${services.length})`)}
          </button>
          {categoriesOrder.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#0f1e36] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {pickLang(currentLang, CATEGORY_LABELS[cat].om, CATEGORY_LABELS[cat].en, CATEGORY_LABELS[cat].am)}
            </button>
          ))}
        </div>
      </div>

      {categoriesOrder
        .filter((cat) => selectedCategory === 'all' || selectedCategory === cat)
        .map((cat) => {
          const items = filtered.filter((s) => s.category === cat);
          if (items.length === 0) return null;
          return (
            <section key={cat} className="space-y-3">
              <h3 className="font-serif text-base font-bold text-[#0f1e36] px-1">
                {pickLang(currentLang, CATEGORY_LABELS[cat].om, CATEGORY_LABELS[cat].en, CATEGORY_LABELS[cat].am)} ({items.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((srv) => {
                  const Icon = srv.icon;
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={srv.onOpen}
                      className="text-left bg-white hover:bg-amber-50/40 rounded-xl border border-slate-200 hover:border-amber-400 p-4 shadow-xs transition-all flex flex-col justify-between gap-3 cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-lg bg-slate-100 group-hover:bg-[#0f1e36] text-[#0f1e36] group-hover:text-amber-400 transition-colors shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-[#0f1e36] leading-snug">
                            {pickLang(currentLang, srv.titleOm, srv.titleEn, srv.titleAm || srv.titleEn)}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {pickLang(currentLang, srv.descOm, srv.descEn, srv.descAm || srv.descEn)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end text-[11px] font-bold text-amber-800 group-hover:text-[#0f1e36]">
                        <span>{pickLang(currentLang, 'Bani / To\'adhu', 'Open Service', 'ክፈት')}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
    </div>
  );
};

export const ADMIN_SERVICE_ICONS = {
  ShieldCheck,
  Users,
  KeyRound,
  FileCheck2,
  UserPlus,
  CalendarClock,
  FileSpreadsheet,
  DollarSign,
  Sliders,
  Landmark,
  Zap,
  Package,
  BookOpen,
  Clock,
  Calendar,
  Award,
  Library,
  Compass,
  Baby,
  Bus,
  MapPin,
  QrCode,
  Utensils,
  HeartPulse,
  MessageSquare,
  Bell,
  Smartphone,
  FileText,
  Camera,
  Edit3,
  Cloud,
  BarChart3,
  Megaphone,
  ClipboardCheck
};
