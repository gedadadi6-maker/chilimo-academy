import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Language, AppView } from '../types';
import { translations, pickLang } from '../translations';
import { CHILIMO_INFO, getSchoolLogoUrl } from '../data/mockData';

interface FooterProps {
  currentLang: Language;
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onNavigate
}) => {
  const t = translations[currentLang];
  const [logoUrl, setLogoUrl] = useState<string>(getSchoolLogoUrl);

  useEffect(() => {
    const syncLogo = () => setLogoUrl(getSchoolLogoUrl());
    window.addEventListener('chilimo:data-updated', syncLogo);
    return () => window.removeEventListener('chilimo:data-updated', syncLogo);
  }, []);

  return (
    <footer className="bg-[#071120] text-slate-400 text-xs border-t border-slate-800 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80">

          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logoUrl}
                alt="Chilimo Academy Crest"
                className="w-11 h-11 object-contain"
              />
              <div>
                <span className="block font-serif text-lg font-bold text-white">
                  {CHILIMO_INFO.name}
                </span>
                <span className="text-xs text-amber-300 font-medium">
                  &quot;{CHILIMO_INFO.motto}&quot; · {CHILIMO_INFO.grades}
                </span>
              </div>
            </div>

            <p className="text-slate-400 max-w-md text-xs leading-relaxed">
              {pickLang(
                currentLang,
                'Magaalaa Burayyuu, Oromiyaatti barnoota ammayyaa sadarkaa KG 1–3 fi Kutaa 1–8tti qulqullina olaanaadhaan kennuu irratti xiyyeeffata.',
                'Providing holistic, innovative primary and early childhood education in Burayu, Oromia, Ethiopia. Committed to nurturing every child\'s potential.',
                'በቡራዩ፣ ኦሮሚያ፣ ኢትዮጵያ ለKG 1–3 እና ከ1ኛ–8ኛ ክፍል ጥራት ያለው ሁሉን አቀፍ ትምህርት የሚሰጥ ትምህርት ቤት።'
              )}
            </p>
          </div>

          {/* System Roles & Portals — Zero IDs or Passwords Exposed */}
          <div className="md:col-span-3">
            <h4 className="font-semibold text-white text-xs tracking-wide mb-3.5">
              {pickLang(currentLang, 'Poortaalota & Tajaajiloota', 'System Roles & Portals', 'የትምህርት ቤት ፖርታሎች')}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('login')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  {t.roleTeacher}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('login')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  {t.roleStudent}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('login')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  {t.roleParent}
                </button>
              </li>
              <li className="pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onNavigate('register_admission')}
                  className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer text-left font-medium"
                >
                  {t.heroCtaApply} (KG 1–3 &amp; Grades 1–8)
                </button>
              </li>
            </ul>
          </div>

          {/* Burayu Campus Contact */}
          <div className="md:col-span-4">
            <h4 className="font-semibold text-white text-xs tracking-wide mb-3.5">
              {pickLang(currentLang, 'Teessoo Kaampaasii Burayyuu', 'Burayu Campus Contact', 'የቡራዩ ካምፓስ አድራሻ')}
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{CHILIMO_INFO.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono font-semibold text-amber-300 tabular-nums">{CHILIMO_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-300">{CHILIMO_INFO.email}</span>
              </div>
              <div className="text-xs text-slate-500 pt-1">
                {pickLang(
                  currentLang,
                  'Sa\'aatii Waajjiraa: Wixata – Jimaata (2:00 – 11:00)',
                  'Office Hours: Monday – Friday (8:00 AM – 5:00 PM)',
                  'የቢሮ ሰዓት፡ ከሰኞ – አርብ (2:00 – 11:00)'
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {CHILIMO_INFO.name}. {pickLang(currentLang, 'Mirgi Hundi Kan Seeraatiin Eegamedha. Burayyuu, Oromiyaa.', 'All Rights Reserved. Burayu, Oromia, Ethiopia.', 'መብቱ በህግ የተጠበቀ ነው። ቡራዩ፣ ኦሮሚያ።')}
          </div>
          <div className="flex items-center gap-3">
            <span>{pickLang(currentLang, 'Seera Barnootaa', 'Academic Code', 'የትምህርት ህግ')}</span>
            <span aria-hidden="true">·</span>
            <span>{pickLang(currentLang, 'Qajeelfama Baasii', 'School Bus Policy', 'የትራንስፖርት ደንብ')}</span>
            <span aria-hidden="true">·</span>
            <span>{pickLang(currentLang, 'Qajeelfama Kaffaltii', 'Fee Policy', 'የክፍያ ደንብ')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
