import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Check,
  Camera,
  X
} from 'lucide-react';
import { Language, AppView, SchoolPhotoItem, SchoolPhotoPlacement } from '../types';
import { translations, pickLang } from '../translations';
import { CHILIMO_INFO, getStoredAbout, getStoredSchoolPhotos, getSchoolLogoUrl } from '../data/mockData';

interface AboutSectionProps {
  currentLang: Language;
  onNavigate: (view: AppView) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  currentLang,
  onNavigate
}) => {
  const t = translations[currentLang];
  const [about, setAbout] = useState(getStoredAbout());
  const [schoolPhotos, setSchoolPhotos] = useState<SchoolPhotoItem[]>(() =>
    getStoredSchoolPhotos().filter(p => p.featured)
  );
  const [galleryFilter, setGalleryFilter] = useState<'all' | SchoolPhotoPlacement>('all');
  const [lightboxPhoto, setLightboxPhoto] = useState<SchoolPhotoItem | null>(null);

  useEffect(() => {
    const sync = () => {
      setAbout(getStoredAbout());
      setSchoolPhotos(getStoredSchoolPhotos().filter(p => p.featured));
    };
    window.addEventListener('chilimo:data-updated', sync);
    return () => window.removeEventListener('chilimo:data-updated', sync);
  }, []);

  const aboutHighlightPhoto = schoolPhotos.find(p => p.placement === 'about_section');
  const galleryPhotos = schoolPhotos.filter(p => p.placement !== 'hero_banner');
  const displayedGallery =
    galleryFilter === 'all'
      ? galleryPhotos
      : galleryPhotos.filter(p => p.placement === galleryFilter);

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Editorial Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <img
            src={getSchoolLogoUrl()}
            alt="Chilimo Academy Crest"
            className="w-28 h-28 mx-auto object-contain mb-5"
          />
          <div className="text-xs font-semibold tracking-wide text-amber-700">
            {CHILIMO_INFO.grades} · {CHILIMO_INFO.location}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0b172a] mt-2">
            {about.title}
          </h2>
          <p className="text-slate-600 font-serif italic text-base sm:text-lg mt-2">
            "{about.subtitle}"
          </p>
        </div>

        {/* Two-Column Institutional Narrative & Facilities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            {aboutHighlightPhoto && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
                <img
                  src={aboutHighlightPhoto.imageDataUrl}
                  alt={aboutHighlightPhoto.title}
                  className="w-full max-h-80 object-cover"
                />
                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0b172a]">{aboutHighlightPhoto.title}</span>
                  <span className="text-slate-500">{aboutHighlightPhoto.caption}</span>
                </div>
              </div>
            )}

            <div>
              <h3 className="font-serif text-2xl font-bold text-[#0b172a] mb-3">
                {pickLang(
                  currentLang,
                  'Seenaa fi Waadaa Barnootaa Keenya',
                  'Our History & Educational Commitment',
                  'ታሪካችን እና የትምህርት ቁርጠኝነታችን'
                )}
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                {about.history}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-800 text-sm leading-relaxed">
              <div className="font-semibold text-[#0b172a] mb-1">
                {pickLang(currentLang, 'Mul\'ata Barnootaa', 'Educational Vision', 'የትምህርት ራዕይ')}
              </div>
              {about.vision}
            </div>

            {/* Clean Contact Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-mono font-semibold text-slate-900 tabular-nums">{CHILIMO_INFO.phone}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-slate-800 truncate">{CHILIMO_INFO.email}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-slate-800">{CHILIMO_INFO.location}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('register_admission')}
                className="px-6 py-3 bg-[#0b172a] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                {t.heroCtaApply}
              </button>
              <button
                onClick={() => onNavigate('status_check')}
                className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-slate-300 whitespace-nowrap"
              >
                {t.heroCtaStatus}
              </button>
            </div>
          </div>

          {/* Right: Campus Facilities List with Hairline Dividers */}
          <div className="lg:col-span-5 bg-[#f8fafc] p-7 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-200">
              <Building2 className="w-5 h-5 text-amber-600" />
              <h4 className="font-serif text-lg font-bold text-[#0b172a]">
                Chilimo Campus Facilities
              </h4>
            </div>

            <ul className="divide-y divide-slate-200/80 text-sm text-slate-700">
              {about.facilities.map((fac, idx) => (
                <li key={idx} className="py-3 flex items-start gap-3">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-800">{fac}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 mt-2 border-t border-slate-200 text-xs text-slate-500">
              Ministry of Education Recognized Primary & Kindergarten Academy
            </div>
          </div>
        </div>

        {/* Dynamic School Photo Gallery (Admin Uploaded Campus Media) */}
        {galleryPhotos.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
                  <Camera className="w-4 h-4" />
                  <span>{pickLang(currentLang, 'Galmee Suuraa Mana Barumsaa', 'Campus Life & Facilities', 'የትምህርት ቤቱ የፎቶ ማህደር')}</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#0b172a] mt-1">
                  {pickLang(
                    currentLang,
                    'Suuraawwan Kaampaasii Chilimo Academy',
                    'Chilimo Academy Campus Photo Gallery',
                    'የቺሊሞ አካዳሚ የግቢ ፎቶዎች'
                  )}
                </h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: 'all' as const, label: pickLang(currentLang, 'Hunda', 'All', 'ሁሉም') },
                  { key: 'campus_gallery' as const, label: pickLang(currentLang, 'Kaampaasii', 'Campus', 'ግቢ') },
                  { key: 'kg_activities' as const, label: 'KG 1–3' },
                  { key: 'science_lab' as const, label: 'Labs & ICT' },
                  { key: 'sports_events' as const, label: pickLang(currentLang, 'Ispoortii & Ayyaana', 'Events', 'ዝግጅቶች') },
                  { key: 'bus_fleet' as const, label: pickLang(currentLang, 'Geejjiba', 'Buses', 'ትራንስፖርት') }
                ].map(tab => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setGalleryFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      galleryFilter === tab.key
                        ? 'bg-[#0b172a] text-white border-[#0b172a]'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedGallery.map(photo => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setLightboxPhoto(photo)}
                  className="group text-left bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-amber-400 transition-all cursor-pointer"
                >
                  <div className="aspect-video bg-slate-100 overflow-hidden">
                    <img
                      src={photo.imageDataUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-serif font-bold text-sm text-[#0b172a] truncate">{photo.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{photo.caption}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3 bg-[#0b172a] text-white flex items-center justify-between">
              <h4 className="font-bold text-sm">{lightboxPhoto.title}</h4>
              <button
                type="button"
                onClick={() => setLightboxPhoto(null)}
                className="p-1 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-950 flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={lightboxPhoto.imageDataUrl}
                alt={lightboxPhoto.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 text-xs text-slate-700 flex items-center justify-between">
              <span>{lightboxPhoto.caption}</span>
              <span className="text-slate-400 font-mono shrink-0 ml-4">{lightboxPhoto.uploadedAt}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
