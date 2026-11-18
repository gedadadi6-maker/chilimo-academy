import React, { useState } from 'react';
import { ArrowRight, BookOpen, X } from 'lucide-react';
import { Language, AppView } from '../types';
import { translations } from '../translations';

interface HeritageTributeSectionProps {
  currentLang: Language;
  onNavigate: (view: AppView) => void;
}

interface PioneerProfile {
  id: 'ali_birra' | 'taddasa_birru';
  imageSrc: string;
  imageAlt: string;
  eraAndRole: Record<Language, string>;
  name: Record<Language, string>;
  quote: Record<Language, string>;
  legacyParagraph: Record<Language, string>;
  lessonForStudents: Record<Language, string>;
}

const PIONEERS: PioneerProfile[] = [
  {
    id: 'taddasa_birru',
    imageSrc: '/assets/aistudio/image_1d29e887.png',
    imageAlt: 'General Taddasa Birru — Champion of Literacy & Education',
    eraAndRole: {
      om: '1922–1975 · Utubaa Barnootaa fi Qabsaa’aa Dhalootaa',
      en: '1922–1975 · Pioneer of Mass Literacy & Civic Enlightenment',
      am: '1922–1975 · የመሠረተ ትምህርት ፈር ቀዳጅ እና የትውልድ አርአያ'
    },
    name: {
      om: 'Jeneraal Taaddasaa Birruu',
      en: 'General Taddasa Birru',
      am: 'ጄኔራል ታደሰ ብሩ'
    },
    quote: {
      om: '“Biyyi kan guddatu yoo dhalootni hunduu baratee, dubbisuu fi barreessuu danda’ee, beekumsaan of ijaare qofa.”',
      en: '“A nation rises only when every son and daughter learns to read, write, and build their future through knowledge.”',
      am: '“ሀገር የሚያድገው እያንዳንዱ ትውልድ ማንበብና መጻፍ ችሎ በዕውቀት ራሱን ሲገነባ ብቻ ነው።”'
    },
    legacyParagraph: {
      om: 'Jeneraal Taaddasaa Birruu barnootni furtuu kabajaa, bilisummaa sammuu fi guddina hawaasaa ta’uu isaa hojiin agarsiisan. Duula barnoota bu’uuraa babal’isuu fi manneen barnootaa hundeessuun dhalootni boruu doofummaa keessaa bahee addunyaa ammayyaatti akka qophaa’u dhaamsa guddaa dabarsaniiru.',
      en: 'General Taddasa Birru demonstrated through tireless leadership that education is the cornerstone of human dignity and national progress. Through championing adult literacy campaigns and community schooling, he left an enduring call for every generation to replace ignorance with learning.',
      am: 'ጄኔራል ታደሰ ብሩ ትምህርት የክብር፣ የነጻነት እና የማኅበረሰብ እድገት መሠረት መሆኑን በተግባር አሳይተዋል። የመሠረተ ትምህርት ዘመቻዎችንና ትምህርት ቤቶችን በማስፋፋት ትውልድ ከድንቁርና ወጥቶ በዕውቀት እንዲታነጽ ታላቅ አደራ አስተላልፈዋል።'
    },
    lessonForStudents: {
      om: 'Barnootni bu’uura naamusa, ijaarsa biyyaa fi mirga namoomaati.',
      en: 'Education builds character, civic responsibility, and lifelong opportunity.',
      am: 'ትምህርት የሥነ ምግባር፣ የሀገር ግንባታና የዕድገት መሠረት ነው።'
    }
  },
  {
    id: 'ali_birra',
    imageSrc: '/assets/aistudio/image_eacf12d8.png',
    imageAlt: 'Dr. Artist Ali Birra — Cultural Educator & Poet',
    eraAndRole: {
      om: '1950–2022 · Hayyuu Aartii fi Barsiisaa Dhalootaa',
      en: '1950–2022 · Cultural Icon & Educator Through Music',
      am: '1950–2022 · ታላቅ የጥበብ ምሁር እና የትውልድ አስተማሪ'
    },
    name: {
      om: 'Doktar Artisti Alii Birraa',
      en: 'Dr. Artist Ali Birra',
      am: 'ዶ/ር አርቲስት አሊ ቢራ'
    },
    quote: {
      om: '“Barnootaa baradhaa, barnootni ifa jireenyaati; dhalootni barate dukkana mo’atee boru bareedaa ijaara.”',
      en: '“Seek education tirelessly — learning is the light of life, and an educated generation builds a bright tomorrow.”',
      am: '“ትምህርትን ተማሩ፤ ትምህርት የሕይወት ብርሃን ነው፤ የተማረ ትውልድም ብሩህ ነገን ይገነባል።”'
    },
    legacyParagraph: {
      om: 'Artisti Alii Birraa waggoota shantamaa oliif sagalee fi weelluu isaanitiin barnoota, aadaa, tokkummaa fi jaalala biyyaa barsiisaniiru. Sirboota isaanii kanneen akka “Barnoota” jedhuun dargaggoonni fi ijoolleen Oromoo barumsa akka jaallatan, afaan fi seenaa isaanii kabajanii addunyaa wajjin akka dorgoman dhaamsa hin dagatamne dhalootaaf kaa’aniiru.',
      en: 'For over five decades, Dr. Ali Birra used poetry and music as a classroom for millions. Through timeless songs celebrating literacy, unity, and cultural pride, he inspired generations of young learners to treasure education and carry their heritage proudly into the modern world.',
      am: 'ዶ/ር አርቲስት አሊ ቢራ ከአምሳ ዓመታት በላይ በጥበብና በሙዚቃቸው ትምህርትን፣ ባህልንና አንድነትን አስተምረዋል። ትውልዱ ትምህርትን እንዲወድ፣ ማንነቱን አክብሮ በዘመናዊ ዕውቀት እንዲወዳደር የማይረሳ መልእክት አስተላልፈዋል።'
    },
    lessonForStudents: {
      om: 'Afaan, aadaa fi barnoota ammayyaa walitti qabuun dhaloota beekaa ta’aa.',
      en: 'Unite cultural heritage with modern scholarship to illuminate the future.',
      am: 'ባህልን ከዘመናዊ ትምህርት ጋር በማዋሃድ ብሩህ ትውልድ መገንባት።'
    }
  }
];

const SECTION_COPY: Record<
  Language,
  {
    kicker: string;
    heading: string;
    subtitle: string;
    messageLabel: string;
    ctaText: string;
  }
> = {
  om: {
    kicker: 'Dhaamsa Dhalootaaf · Utubaalee Barnootaa',
    heading: 'Abbootii Mul’ataa Barnootaaf Daandii Saqan',
    subtitle:
      'Chilimo Academy keessatti barattootni keenya beekumsa saayinsii ammayyaa qofa osoo hin taane, ergaa fi akeeka namoota gurguddoo barnootni ifa jireenyaa ta’uu barsiisanii qabatanii guddatu.',
    messageLabel: 'Dhaamsa Barnootaa Dhalootaaf',
    ctaText: 'Barnoota Jalqabi — Galmee Barattootaa'
  },
  en: {
    kicker: 'Legacy for Generations · Champions of Learning',
    heading: 'Inspired by Pioneers Who Made Education Their Message',
    subtitle:
      'At Chilimo Academy, modern academic excellence is anchored in the enduring educational vision of leaders and artists who taught generations that learning is the true light of freedom and progress.',
    messageLabel: 'Message to the Next Generation',
    ctaText: 'Enroll at Chilimo Academy'
  },
  am: {
    kicker: 'የትውልድ አደራ · የትምህርት ፋና ወጊዎች',
    heading: 'ትምህርት የብርሃን መንገድ መሆኑን ያስተማሩ ታላላቅ አርአያዎች',
    subtitle:
      'በችሊሞ አካዳሚ ተማሪዎቻችን ዘመናዊ ዕውቀትን ከታላላቅ የሀገር ባለውለታዎች እና የጥበብ ሰዎች የትምህርት መልእክት ጋር አዋህደው ያድጋሉ።',
    messageLabel: 'ለቀጣዩ ትውልድ የተላለፈ መልእክት',
    ctaText: 'ለትምህርት ይመዝገቡ'
  }
};

export const HeritageTributeSection: React.FC<HeritageTributeSectionProps> = ({
  currentLang,
  onNavigate
}) => {
  const copy = SECTION_COPY[currentLang];
  const t = translations[currentLang];
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [selectedPioneer, setSelectedPioneer] = useState<PioneerProfile | null>(null);

  return (
    <section
      id="heritage-pioneers"
      className="py-16 sm:py-24 bg-[#0b172a] text-white border-b border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Editorial Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold tracking-wide text-amber-300">
            {copy.kicker}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2 leading-tight [text-wrap:balance]">
            {copy.heading}
          </h2>
          <p className="text-slate-300 mt-3 text-base leading-relaxed">
            {copy.subtitle}
          </p>
        </div>

        {/* Two Equal Editorial Portraits & Educational Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {PIONEERS.map((pioneer) => (
            <article
              key={pioneer.id}
              className="bg-[#10203a] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              {/* Clean Portrait Container with object-top framing */}
              <button
                type="button"
                onClick={() => setSelectedPioneer(pioneer)}
                className="group relative aspect-[4/3] w-full bg-[#071120] overflow-hidden text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                {!failedImages[pioneer.id] ? (
                  <img
                    src={pioneer.imageSrc}
                    alt={pioneer.imageAlt}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [pioneer.id]: true }))
                    }
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#071120] text-slate-400 p-6">
                    <BookOpen className="w-10 h-10 mb-2 text-amber-300" />
                    <span className="text-sm font-serif text-white">
                      {pioneer.name[currentLang]}
                    </span>
                  </div>
                )}

                {/* Subtle bottom gradient scrim preserving facial clarity */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#071120] via-transparent to-transparent opacity-85"
                  aria-hidden="true"
                />
                <div className="absolute bottom-4 left-6 right-6">
                  <div className="text-xs font-medium text-amber-300 tracking-wide">
                    {pioneer.eraAndRole[currentLang]}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mt-0.5">
                    {pioneer.name[currentLang]}
                  </h3>
                </div>
              </button>

              {/* Editorial Message & Legacy Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <blockquote className="font-serif italic text-lg sm:text-xl text-amber-200 leading-relaxed">
                    {pioneer.quote[currentLang]}
                  </blockquote>
                  <p className="text-slate-300 text-sm sm:text-[15px] leading-relaxed">
                    {pioneer.legacyParagraph[currentLang]}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-slate-300">
                    <span className="text-amber-300 font-semibold">{copy.messageLabel}: </span>
                    {pioneer.lessonForStudents[currentLang]}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Quiet Single Action Strip */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-slate-300">
            {currentLang === 'om'
              ? 'Chilimo Academy · Buraayyuu: Dhaloota beekumsa, naamusa fi afaan sadiin qophaa’e ijaaraa jira.'
              : currentLang === 'am'
              ? 'ችሊሞ አካዳሚ · ቡራዩ፡ በዕውቀት፣ በሥነ ምግባርና በሦስት ቋንቋዎች የታነጸ ትውልድ እንገነባለን።'
              : 'Chilimo Academy · Burayu: Raising a generation grounded in knowledge, integrity, and trilingual excellence.'}
          </p>
          <button
            type="button"
            onClick={() => onNavigate('register_admission')}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-[#071120] font-bold text-xs sm:text-sm rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <span>{copy.ctaText || t.heroCtaApply}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Archival Portrait Modal */}
      {selectedPioneer && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedPioneer(null)}
        >
          <div
            className="bg-[#0b172a] border border-white/15 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-300 font-medium">
                  {selectedPioneer.eraAndRole[currentLang]}
                </div>
                <h3 className="font-serif text-xl font-bold text-white">
                  {selectedPioneer.name[currentLang]}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPioneer(null)}
                aria-label="Close modal"
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#071120] flex items-center justify-center max-h-[55vh] overflow-hidden">
              <img
                src={selectedPioneer.imageSrc}
                alt={selectedPioneer.imageAlt}
                referrerPolicy="no-referrer"
                className="max-h-[55vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 space-y-3">
              <p className="font-serif italic text-lg text-amber-200">
                {selectedPioneer.quote[currentLang]}
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedPioneer.legacyParagraph[currentLang]}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
