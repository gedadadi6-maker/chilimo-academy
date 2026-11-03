import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Lock } from 'lucide-react';
import { Language, AppView } from '../types';
import { translations } from '../translations';
import { CHILIMO_INFO } from '../data/mockData';

interface FooterProps {
  currentLang: Language;
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onNavigate
}) => {
  const t = translations[currentLang];

  return (
    <footer className="bg-[#0a1526] text-slate-400 text-xs border-t border-[#1a3156]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={CHILIMO_INFO.logoUrl} 
                alt="Chilimo Logo" 
                className="w-12 h-12 object-contain bg-white/10 p-1 rounded-xl"
              />
              <div>
                <span className="block font-serif text-lg font-black text-white">
                  {CHILIMO_INFO.name}
                </span>
                <span className="text-[11px] text-amber-400 font-bold tracking-wide">
                  "{CHILIMO_INFO.motto}" • {CHILIMO_INFO.grades}
                </span>
              </div>
            </div>

            <p className="text-slate-400 max-w-md text-xs leading-relaxed">
              Providing holistic, innovative primary and early childhood education in Burayu, Oromia, Ethiopia. Committed to nurturing every child's potential.
            </p>

            <div className="flex items-center gap-2 text-amber-400 text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>PHP & MySQL Architecture • MVC, Singleton, Strategy & EAV Standard</span>
            </div>
          </div>

          {/* Quick Portals & Roles */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              System Roles & Portals
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigate('login')} 
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left font-mono"
                >
                  Admin 👨‍💻 (id: 1 / pass: 123)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('login')} 
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left font-mono"
                >
                  Teacher 👩‍🏫 (id: 153 / pass: 123)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('login')} 
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left font-mono"
                >
                  Student 👦 (id: 151 / pass: 123)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('login')} 
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left font-mono"
                >
                  Parent 👵 (id: 163 / pass: 123)
                </button>
              </li>
              <li className="pt-1 border-t border-slate-800">
                <button 
                  onClick={() => onNavigate('register_admission')} 
                  className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer text-left font-bold"
                >
                  Guest Register 🌚 (KG 1-3 & Grade 1-8)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details Specified by User */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Burayu Campus Contact
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{CHILIMO_INFO.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono font-bold text-amber-300">{CHILIMO_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono text-slate-300">{CHILIMO_INFO.email}</span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                Office Hours: Monday - Friday (8:00 AM - 5:00 PM)
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {CHILIMO_INFO.name}. All Rights Reserved. Burayu, Oromia, Ethiopia.
          </div>
          <div className="flex items-center gap-4">
            <span>Academic Code</span>
            <span>·</span>
            <span>School Bus Policy</span>
            <span>·</span>
            <span>EAV Fee Processing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
