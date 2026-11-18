import React, { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  Users,
  ArrowRight,
  LogIn,
  Sparkles,
  BookOpen,
  Lock
} from 'lucide-react';
import { Language, AppView, PortalAccessConfig } from '../types';
import { translations, pickLang } from '../translations';
import { CHILIMO_INFO, getStoredPortalAccessConfig } from '../data/mockData';
import stemClassroomImg from '../assets/images/chilimo_stem_classroom_1794896697749.jpg';
import kgStudioImg from '../assets/images/chilimo_kg_montessori_1794896697720.jpg';

interface PortalCardsProps {
  currentLang: Language;
  onNavigate: (view: AppView) => void;
}

export const PortalCards: React.FC<PortalCardsProps> = ({
  currentLang,
  onNavigate
}) => {
  const t = translations[currentLang];
  const [stemImgError, setStemImgError] = useState(false);
  const [kgImgError, setKgImgError] = useState(false);
  const [portalAccess, setPortalAccess] = useState<PortalAccessConfig>(getStoredPortalAccessConfig);

  React.useEffect(() => {
    const syncPortalAccess = () => setPortalAccess(getStoredPortalAccessConfig());
    window.addEventListener('chilimo:data-updated', syncPortalAccess);
    return () => window.removeEventListener('chilimo:data-updated', syncPortalAccess);
  }, []);

  const lockedLabel = pickLang(
    currentLang,
    'Admin Cufameera (Yeroof)',
    'Admin Locked (Temporarily Closed)',
    'በአስተዳደር ለጊዜው ተዘግቷል'
  );

  return (
    <section className="py-16 sm:py-24 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-20">

        {/* Asymmetric Campus Programs Showcase */}
        <div>
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-semibold text-amber-700 tracking-wide">
              {CHILIMO_INFO.name} · {CHILIMO_INFO.grades}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0b172a] mt-2">
              {pickLang(
                currentLang,
                'Barnoota Qulqullina Olaanaa KG 1–3 hanga Kutaa 8ffaatti',
                'Academic Excellence from Kindergarten to Grade 8',
                'ከአፀደ ሕፃናት (KG 1–3) እስከ 8ኛ ክፍል ጥራት ያለው ትምህርት'
              )}
            </h2>
            <p className="text-slate-600 mt-3 text-base leading-relaxed">
              {pickLang(
                currentLang,
                'Barnoota afaan sadii (Afaan Oromoo, Ingiliffaa fi Amaariffaa) laabooraatorii saayinsii, kompiitaraa fi sagantaa daa\'immanii Burayyuutti kennama.',
                'Structured bilingual and trilingual instruction combining hands-on science laboratories, digital literacy, and early childhood discovery in Burayu.',
                'በቡራዩ ሳይንስ ላብራቶሪ፣ የዲጂታል ትምህርት እና የአፀደ ሕፃናት እንክብካቤን ያጣመረ የሶስት ቋንቋ ትምህርት።'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Marquee Feature 1: Primary & STEM (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between">
              <div className="aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                {!stemImgError ? (
                  <img
                    src={stemClassroomImg}
                    alt="Chilimo Academy Primary STEM and Computer Laboratory"
                    referrerPolicy="no-referrer"
                    onError={() => setStemImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                    <BookOpen className="w-12 h-12 mb-2" />
                    <span className="text-sm font-medium">Primary STEM & ICT Complex</span>
                  </div>
                )}
              </div>
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-slate-500">
                    {pickLang(
                      currentLang,
                      'Kutaa 1–8 · Afaan Oromoo, Ingiliffa & Amaariffa',
                      'Grades 1–8 · Afaan Oromoo, English & Amharic',
                      'ከ1ኛ–8ኛ ክፍል · አፋን ኦሮሞ፣ እንግሊዝኛ እና አማርኛ'
                    )}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#0b172a] mt-1.5">
                    {pickLang(
                      currentLang,
                      'Laabooraatorii STEM & Qophii Qormaata Kutaa 8ffaa',
                      'Primary STEM Labs & Grade 8 Ministry Prep',
                      'የመጀመሪያ ደረጃ የሳይንስ ላብ እና የ8ኛ ክፍል ክልላዊ ፈተና ዝግጅት'
                    )}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mt-2">
                    {pickLang(
                      currentLang,
                      'Kuusaa kompiitaraa, laabooraatorii saayinsii, kitaabota dijitaalaa fi qormaata shaakalaa Ministeera Kutaa 8ffaa Oromiyaa.',
                      'Dedicated computer workstations, microscopy laboratories, digital textbooks, and structured Oromia Regional Grade 8 exam preparation.',
                      'የተሟላ የኮምፒውተር ማዕከል፣ የሳይንስ ላብራቶሪ፣ ዲጂታል መጽሐፍት እና የ8ኛ ክፍል ሚኒስትሪ ፈተና ዝግጅት።'
                    )}
                  </p>
                </div>
                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-slate-500 tabular-nums">
                    {pickLang(
                      currentLang,
                      'Qabxii Darbiinsaa %99',
                      '99% Regional Exam Pass Rate',
                      '99% የክልላዊ ፈተና ማለፊያ ውጤት'
                    )}
                  </span>
                  <button
                    onClick={() => onNavigate('register_admission')}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0b172a] hover:text-amber-700 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>{t.heroCtaApply}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Marquee Feature 2: KG 1-3 Studio (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between">
              <div className="aspect-[4/3] w-full bg-amber-50 overflow-hidden">
                {!kgImgError ? (
                  <img
                    src={kgStudioImg}
                    alt="Chilimo Academy Kindergarten Early Childhood Studio"
                    referrerPolicy="no-referrer"
                    onError={() => setKgImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-amber-50 text-amber-600">
                    <Sparkles className="w-12 h-12 mb-2" />
                    <span className="text-sm font-medium">KG 1–3 Learning Studio</span>
                  </div>
                )}
              </div>
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-amber-700 font-medium">
                    KG 1 – KG 3 · Interactive Early Learning Hub
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#0b172a] mt-1.5">
                    {pickLang(
                      currentLang,
                      'Kutaa Daa\'immanii (KG 1–3): Learning Studio',
                      'Kindergarten (KG 1–3): Early Childhood Studio',
                      'አፀደ ሕፃናት (KG 1–3)፡ የሕፃናት መማሪያ ስቱዲዮ'
                    )}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mt-2">
                    {pickLang(
                      currentLang,
                      'Taphaan Qubee Afaan Oromoo, lakkoofsa, halluu fi seenaa sagalee barachuu, akkasumas kunuunsa daa\'immanii nageenya qabu.',
                      'Play-based Qubee Afaan Oromoo phonetics, numbers, colors, audio storytelling, and safe highland playground care.',
                      'በጨዋታ የታገዘ የፊደላት፣ ቁጥሮች፣ ቀለማት እና የድምፅ ተረቶች ትምህርት ከአስተማማኝ የመጫወቻ ስፍራ ጋር።'
                    )}
                  </p>
                </div>
                <div className="pt-5 mt-5 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate('kg_hub')}
                    className="w-full py-2.5 px-4 bg-[#0b172a] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <span>
                      {pickLang(
                        currentLang,
                        'Wiirtuu Barnoota KG 1–3 Bani',
                        'Open KG 1–3 Learning Hub',
                        'የKG 1–3 መማሪያ ማዕከልን ክፈት'
                      )}
                    </span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated School Portals — Strictly ZERO exposed IDs or passwords */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
            <div className="max-w-2xl">
              <div className="text-xs font-semibold text-amber-700 tracking-wide">
                {pickLang(currentLang, 'Poortaalota Dijitaalaa', 'Digital Campus Workspaces', 'ዲጂታል የትምህርት ቤት ፖርታሎች')}
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0b172a] mt-1.5">
                {pickLang(
                  currentLang,
                  'Sirna Bulchiinsa Mana Barumsaa Walitti Hidhame',
                  'Integrated School Management Portals',
                  'የተቀናጁ የትምህርት ቤት አስተዳደር ፖርታሎች'
                )}
              </h2>
            </div>
            <p className="text-slate-600 text-sm max-w-md">
              {pickLang(
                currentLang,
                'Barsiisota, barattoota fi maatiidhaaf hayyamni qophaa\'eera. Lakkoofsa ID fi jecha icciitii waajjira Burayyuu irraa isiniif kennameen seenaa.',
                'Authorized access for faculty, enrolled students, and parents. Sign in using the private credentials issued by the Burayu campus office.',
                'ለመምህራን፣ ለተማሪዎች እና ለወላጆች የተዘጋጀ። ከቡራዩ ቢሮ በተሰጠዎት መለያ ቁጥር እና የይለፍ ቃል ይግቡ።'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* 01. Teacher & Faculty */}
            <div className="bg-white rounded-2xl border border-slate-200 p-7 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-mono text-slate-400 tabular-nums">01</span>
                  <Briefcase className="w-5 h-5 text-amber-600" />
                </div>

                <h3 className="font-serif text-xl font-bold text-[#0b172a]">
                  {pickLang(currentLang, 'Poortaalii Barsiisotaa', 'Teacher & Faculty Portal', 'የመምህራን ፖርታል')}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mt-3 mb-6">
                  {pickLang(
                    currentLang,
                    'Qabxii barattootaa galchi, attendance daree hordofi, karoora barnootaa fi hojii manaa KG hanga Kutaa 8tti hooggani.',
                    'Record term grades, manage classroom attendance across KG to Grade 8, submit lesson plans, and review assignments.',
                    'የተማሪዎችን ውጤት ያስገቡ፣ የክፍል ክትትል ይመዝግቡ፣ የትምህርት እቅድ እና የቤት ስራ ያስተዳድሩ።'
                  )}
                </p>

                <ul className="space-y-2.5 mb-6 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <li>{pickLang(currentLang, 'Qabxii Semisteeraa & Kaardii', 'Term Grades & Official Report Cards', 'የሴሚስተር ውጤት እና ሪፖርት ካርድ')}</li>
                  <li>{pickLang(currentLang, 'Attendance Guyyaa & Karoora', 'Daily Class Attendance & Lesson Plans', 'የዕለት ተዕለት ክትትል እና የትምህርት እቅድ')}</li>
                  <li>{pickLang(currentLang, 'Hojii Manaa & Qormaata Onlaayinii', 'Homework & Online Assessments', 'የቤት ስራ እና ኦንላይን ፈተናዎች')}</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100">
                {portalAccess.teacherPortalEnabled ? (
                  <button
                    onClick={() => onNavigate('login')}
                    className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-[#0b172a] hover:bg-slate-800 text-white transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-400" />
                    <span>{pickLang(currentLang, 'Gara Poortaalii Barsiisotaa Seeni', 'Sign In to Teacher Portal', 'ወደ መምህራን ፖርታል ይግቡ')}</span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 px-3 text-xs font-semibold rounded-lg bg-rose-50 text-rose-800 border border-rose-200 flex items-center justify-center gap-2 text-center">
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span>{lockedLabel}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 02. Student & Admissions */}
            <div className="bg-white rounded-2xl border border-slate-300 p-7 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-mono text-amber-700 font-semibold tabular-nums">02</span>
                  <GraduationCap className="w-5 h-5 text-amber-600" />
                </div>

                <h3 className="font-serif text-xl font-bold text-[#0b172a]">
                  {pickLang(currentLang, 'Poortaalii Barattootaa & Galmee', 'Student & Admissions Portal', 'የተማሪዎች እና ምዝገባ ፖርታል')}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mt-3 mb-6">
                  {pickLang(
                    currentLang,
                    'Galmee KG 1–3 fi Kutaa 1–8tti iyyadhu, kaardii qabxii ilaali, kitaabota dijitaalaa dubbisi fi baasii mana barumsaa filadhu.',
                    'Apply for KG 1–3 or Grades 1–8 admissions, view semester report cards, access digital textbooks, and manage school bus routes.',
                    'ለKG 1–3 እና 1ኛ–8ኛ ክፍል ያመልክቱ፣ ሪፖርት ካርድ ይመልከቱ፣ ዲጂታል መጽሐፍትን እና የትራንስፖርት መስመር ይጠቀሙ።'
                  )}
                </p>

                <ul className="space-y-2.5 mb-6 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <li>{pickLang(currentLang, 'Galmee KG 1–3 & Kutaa 1–8', 'KG 1–3 & Grades 1–8 Admissions', 'የKG 1–3 እና 1ኛ–8ኛ ክፍል ምዝገባ')}</li>
                  <li>{pickLang(currentLang, 'Kaardii QR Barataa & Hall Ticket', 'Digital Student ID & Exam Hall Tickets', 'ዲጂታል መታወቂያ እና የፈተና መግቢያ')}</li>
                  <li>{pickLang(currentLang, 'Kitaabota Dijitaalaa & Qormaata G8', 'Digital E-Books & Grade 8 Practice Exams', 'ዲጂታል መጽሐፍት እና የ8ኛ ክፍል ፈተና')}</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <button
                  onClick={() => onNavigate('register_admission')}
                  className="w-full py-2.5 px-4 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-[#071120] transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>{pickLang(currentLang, 'Galmee Keessummaa Haaraa', 'Guest Admission Register', 'የአዲስ ተማሪ ምዝገባ')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {portalAccess.studentPortalEnabled ? (
                  <button
                    onClick={() => onNavigate('login')}
                    className="w-full py-2 px-4 text-xs font-semibold text-[#0b172a] hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-600" />
                    <span>{pickLang(currentLang, 'Seensa Barataa', 'Student Sign In', 'የተማሪ መግቢያ')}</span>
                  </button>
                ) : (
                  <div className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-rose-50 text-rose-800 border border-rose-200 flex items-center justify-center gap-2 text-center">
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span>{lockedLabel}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 03. Parent & Guardian */}
            <div className="bg-white rounded-2xl border border-slate-200 p-7 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-mono text-slate-400 tabular-nums">03</span>
                  <Users className="w-5 h-5 text-amber-600" />
                </div>

                <h3 className="font-serif text-xl font-bold text-[#0b172a]">
                  {pickLang(currentLang, 'Poortaalii Maatii (Parent Gateway)', 'Parent & Guardian Gateway', 'የወላጅ እና አሳዳጊ ፖርታል')}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mt-3 mb-6">
                  {pickLang(
                    currentLang,
                    'Kaffaltii barnootaa fi baasii Telebirr ykn CBEtiin kaffali, nagahee QR buufadhu, baasii mana barumsaa hordofi fi barsiisaa qunnami.',
                    'Settle tuition and school bus fees via Telebirr or CBE, download verified receipts, track school buses, and message teachers.',
                    'የትምህርት እና የሰርቪስ ክፍያ በቴሌብር ወይም ሲቢኢ ይክፈሉ፣ ደረሰኝ ያውርዱ፣ አውቶቡስን ይከታተሉ እና ከመምህራን ጋር ይገናኙ።'
                  )}
                </p>

                <ul className="space-y-2.5 mb-6 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <li>{pickLang(currentLang, 'Kaffaltii Telebirr & Baankii CBE', 'Telebirr & CBE Virtual Fee Payment', 'በቴሌብር እና በባንክ የክፍያ አገልግሎት')}</li>
                  <li>{pickLang(currentLang, 'Hordoffii Baasii Mana Barumsaa Live', 'Live School Bus Route Tracking', 'የትምህርት ቤት አውቶቡስ ቀጥታ ክትትል')}</li>
                  <li>{pickLang(currentLang, 'Gabaasa Barnootaa & Walgahii PTA', 'Academic Progress & PTA Forum', 'የትምህርት እድገት እና የወላጅ መድረክ')}</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100">
                {portalAccess.parentPortalEnabled ? (
                  <button
                    onClick={() => onNavigate('login')}
                    className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-[#0b172a] hover:bg-slate-800 text-white transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-400" />
                    <span>{pickLang(currentLang, 'Gara Poortaalii Maatii Seeni', 'Sign In to Parent Gateway', 'ወደ ወላጅ ፖርታል ይግቡ')}</span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 px-3 text-xs font-semibold rounded-lg bg-rose-50 text-rose-800 border border-rose-200 flex items-center justify-center gap-2 text-center">
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span>{lockedLabel}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
