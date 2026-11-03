import React from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  LogIn, 
  UserPlus, 
  Bus,
  Sparkles
} from 'lucide-react';
import { Language, AppView } from '../types';
import { translations } from '../translations';
import { CHILIMO_INFO } from '../data/mockData';

interface PortalCardsProps {
  currentLang: Language;
  onNavigate: (view: AppView) => void;
}

export const PortalCards: React.FC<PortalCardsProps> = ({
  currentLang,
  onNavigate
}) => {
  const t = translations[currentLang];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">
            {CHILIMO_INFO.name} • {CHILIMO_INFO.grades}
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-black text-[#0f1e36] mt-2">
            Integrated School Management Portals
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Dedicated online workspaces for prospective guests, enrolled students, faculty, and parents.
          </p>
        </div>

        {/* 3 Core Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* CARD 1: TEACHER & FACULTY */}
          <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#0f1e36] flex items-center justify-center mb-5 group-hover:bg-amber-100 transition-colors">
                <Briefcase className="w-6 h-6 text-amber-700" />
              </div>
              
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Teacher & Faculty Portal
              </h3>
              
              <p className="text-xs font-semibold text-slate-500 mt-1 mb-3">
                ID: 153 / Password: 123
              </p>
              
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                Teachers can record term grades, view assigned curriculum subjects across KG to Grade 8, and draft assignments.
              </p>

              <div className="space-y-2 mb-6 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Add & Submit Student Grades</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>View Registered Subjects</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Add Homework & Assignment (Beta)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => onNavigate('login')}
                className="w-full py-2.5 px-4 text-xs font-bold rounded-lg bg-[#0f1e36] hover:bg-[#1a3156] text-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Sign In as Teacher (ID: 153)</span>
              </button>
            </div>
          </div>

          {/* CARD 2: GUEST & STUDENT ADMISSIONS (Featured Center) */}
          <div className="bg-white rounded-2xl border-2 border-amber-500 p-7 shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between relative ring-4 ring-amber-500/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0f1e36] text-amber-300 text-[10px] font-black px-3.5 py-0.5 rounded-full uppercase tracking-widest shadow-xs border border-amber-400/40">
              Admissions Open 2026/2027
            </div>

            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#0f1e36] flex items-center justify-center mb-5">
                <GraduationCap className="w-6 h-6 text-amber-700" />
              </div>

              <h3 className="font-serif text-xl font-bold text-slate-900">
                Student & Guest Enrollment
              </h3>

              <p className="text-xs font-bold text-amber-700 mt-1 mb-3">
                Student ID: 151 / Password: 123
              </p>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                Register for KG 1-3 or Grade 1-8 admissions. Enrolled students can check grades, view their official digital ID card, and manage bus route transport across Burayu.
              </p>

              <div className="space-y-2 mb-6 text-xs text-slate-700 border-t border-amber-100 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>KG 1-3 & Grade 1-8 Admissions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Check Student ID Badge (Digital)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Register / Un-register Across Buses</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => onNavigate('register_admission')}
                className="w-full py-2.5 px-4 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-[#0f1e36] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Guest Admission Register</span>
              </button>

              <button
                onClick={() => onNavigate('login')}
                className="w-full text-center text-xs font-bold text-[#0f1e36] hover:text-amber-700 py-1 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Student Login (ID: 151)</span>
              </button>
            </div>
          </div>

          {/* CARD 3: PARENTS & GUARDIANS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#0f1e36] flex items-center justify-center mb-5 group-hover:bg-amber-100 transition-colors">
                <Users className="w-6 h-6 text-amber-700" />
              </div>

              <h3 className="font-serif text-xl font-bold text-slate-900">
                Parent & Guardian Gateway
              </h3>

              <p className="text-xs font-semibold text-slate-500 mt-1 mb-3">
                ID: 163 / Password: 123
              </p>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                Pay tuition & bus fees virtually through EAV payment options (Telebirr, CBE Birr, Cash), view child's progress, and check official payment receipts.
              </p>

              <div className="space-y-2 mb-6 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Virtual Fee Payment (EAV Telebirr & CBE)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Downloadable Fee Receipts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Monitor Child's Academic Standing</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => onNavigate('login')}
                className="w-full py-2.5 px-4 text-xs font-bold rounded-lg bg-[#0f1e36] hover:bg-[#1a3156] text-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Parent Login (ID: 163)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Admin Callout Banner */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              👨‍💻
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Chilimo Academy Administration & Employee System</h4>
              <p className="text-xs text-slate-500">Manage admissions, buses, bills, subjects, grading methods, and announcements.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('login')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>Admin Sign In (id: 1 / pass: 123)</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

      </div>
    </section>
  );
};
