import React, { useState } from 'react';
import { 
  Building2, 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Bus, 
  Award, 
  Sparkles,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { Language, AppView } from '../types';
import { translations } from '../translations';
import { CHILIMO_INFO, getStoredAbout } from '../data/mockData';

interface AboutSectionProps {
  currentLang: Language;
  onNavigate: (view: AppView) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  currentLang,
  onNavigate
}) => {
  const t = translations[currentLang];
  const [about] = useState(getStoredAbout());

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header with Crest */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex justify-center mb-4">
            <img 
              src={CHILIMO_INFO.logoUrl} 
              alt="Chilimo Crest" 
              className="w-36 h-36 sm:w-44 sm:h-44 object-contain drop-shadow-xl hover:scale-105 transition-transform"
            />
          </div>
          <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">
            {CHILIMO_INFO.grades} • {CHILIMO_INFO.location}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-black text-[#0f1e36] mt-2">
            {about.title}
          </h2>
          <p className="text-amber-700 font-serif italic text-base sm:text-lg font-bold mt-2">
            "{about.subtitle}"
          </p>
        </div>

        {/* Narrative & History */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-serif text-2xl font-bold text-[#0f1e36]">
              Our History & Educational Commitment
            </h3>
            
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {about.history}
            </p>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm">
              <strong className="block font-bold mb-1">Our Educational Vision:</strong>
              {about.vision}
            </div>

            {/* Contact quick strip */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-mono font-bold text-slate-800">{CHILIMO_INFO.phone}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-slate-800 truncate">{CHILIMO_INFO.email}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-slate-800">{CHILIMO_INFO.location}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('register_admission')}
                className="px-6 py-2.5 bg-[#0f1e36] hover:bg-[#1a3156] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer border border-amber-400/30"
              >
                Guest Admission Register
              </button>
              <button
                onClick={() => onNavigate('status_check')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer border border-slate-200"
              >
                Track Application Status
              </button>
            </div>
          </div>

          {/* Campus Pillars & Facilities */}
          <div className="lg:col-span-5 bg-slate-50 p-7 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#0f1e36] border-b border-slate-200 pb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              <span>Chilimo Campus Facilities</span>
            </h4>

            <div className="space-y-2.5 text-xs text-slate-700">
              {about.facilities.map((fac, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 bg-white rounded-lg border border-slate-200/60 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-800">{fac}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-slate-500 font-mono">
              Accreditation: Ministry of Education Recognized Primary & KG Academy
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
