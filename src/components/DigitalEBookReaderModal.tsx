import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Bookmark,
  BookmarkCheck,
  Printer,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Clock,
  Layers,
  Award,
  Search,
  Maximize2,
  Minimize2,
  RotateCcw
} from 'lucide-react';
import { DigitalEBook, DigitalEBookPage } from '../types';
import {
  getStoredEBooks,
  getStoredBookmarks,
  saveBookmark,
  CHILIMO_INFO
} from '../data/mockData';

interface DigitalEBookReaderModalProps {
  onClose: () => void;
  defaultBookId?: string;
}

type ReaderTheme = 'light' | 'sepia' | 'dark';
type FontSize = 'sm' | 'base' | 'lg' | 'xl';

export const DigitalEBookReaderModal: React.FC<DigitalEBookReaderModalProps> = ({
  onClose,
  defaultBookId = 'EBK-SCI-01'
}) => {
  const [books] = useState<DigitalEBook[]>(getStoredEBooks());
  const [selectedBookId, setSelectedBookId] = useState<string>(defaultBookId);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [theme, setTheme] = useState<ReaderTheme>('sepia');
  const [fontSize, setFontSize] = useState<FontSize>('base');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<Record<string, number>>(getStoredBookmarks());
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeBook = useMemo(() => {
    return books.find(b => b.id === selectedBookId) || books[0];
  }, [books, selectedBookId]);

  // Flatten all pages across chapters for a seamless sequential reading experience
  const allPages = useMemo(() => {
    const list: DigitalEBookPage[] = [];
    activeBook.chapters.forEach(ch => {
      ch.pages.forEach(p => list.push(p));
    });
    return list;
  }, [activeBook]);

  const currentPage = allPages[currentPageIndex] || allPages[0];
  const isBookmarked = bookmarks[activeBook.id] === currentPage?.pageNumber;

  // Restore bookmark on book change
  useEffect(() => {
    const saved = bookmarks[activeBook.id];
    if (saved) {
      const idx = allPages.findIndex(p => p.pageNumber === saved);
      if (idx !== -1) setCurrentPageIndex(idx);
      else setCurrentPageIndex(0);
    } else {
      setCurrentPageIndex(0);
    }
    // Stop speech when changing books
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  }, [selectedBookId]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleNextPage = () => {
    if (currentPageIndex < allPages.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      stopSpeaking();
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      stopSpeaking();
    }
  };

  const handleToggleBookmark = () => {
    if (!currentPage) return;
    saveBookmark(activeBook.id, currentPage.pageNumber);
    setBookmarks(getStoredBookmarks());
    setToastMessage(`Fuulli ${currentPage.pageNumber} milkaa'inaan mallatteeffameera (Bookmarked)!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Text to Speech
  const toggleSpeech = () => {
    if (!window.speechSynthesis || !currentPage) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${currentPage.sectionHeading}. ${currentPage.paragraphs.join(' ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Theme styles
  const getThemeClasses = () => {
    switch (theme) {
      case 'sepia':
        return {
          bg: 'bg-[#fcf8f2]',
          text: 'text-[#433422]',
          heading: 'text-[#2e2113]',
          subtext: 'text-[#6e583f]',
          card: 'bg-[#f3ece0] border-[#decbb7]',
          border: 'border-[#decbb7]'
        };
      case 'dark':
        return {
          bg: 'bg-slate-900',
          text: 'text-slate-300',
          heading: 'text-white',
          subtext: 'text-slate-400',
          card: 'bg-slate-800 border-slate-700',
          border: 'border-slate-800'
        };
      case 'light':
      default:
        return {
          bg: 'bg-white',
          text: 'text-slate-700',
          heading: 'text-slate-950',
          subtext: 'text-slate-500',
          card: 'bg-slate-50 border-slate-200',
          border: 'border-slate-200'
        };
    }
  };

  const themeClasses = getThemeClasses();

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-xs sm:text-sm leading-relaxed';
      case 'lg':
        return 'text-base sm:text-lg leading-loose';
      case 'xl':
        return 'text-lg sm:text-xl leading-loose';
      case 'base':
      default:
        return 'text-sm sm:text-base leading-relaxed';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/75 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className={`rounded-3xl shadow-2xl border w-full max-w-6xl h-[94vh] flex flex-col overflow-hidden transition-colors ${themeClasses.bg} ${themeClasses.border} print:max-h-none print:shadow-none print:border-none`}>
        
        {/* TOP READER BAR: BOOK TITLE & CONTROLS */}
        <div className={`px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white/80 border-slate-200/80'} backdrop-blur-md`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-700 flex items-center justify-center shadow-md text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-base font-bold truncate max-w-md ${themeClasses.heading}`}>
                  {activeBook.title}
                </h2>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {activeBook.gradeLevel}
                </span>
              </div>
              <p className={`text-xs ${themeClasses.subtext}`}>
                {activeBook.author} • {CHILIMO_INFO.name} Central E-Library
              </p>
            </div>
          </div>

          {/* Reader Display & Action Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Audio Voice Read-Aloud */}
            <button
              onClick={toggleSpeech}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                isSpeaking
                  ? 'bg-amber-500 text-slate-950 border-amber-600 animate-pulse'
                  : 'bg-white/60 hover:bg-white text-slate-700 border-slate-300'
              }`}
              title={isSpeaking ? "Sagalee Dhaabi (Stop Audio)" : "Sagaleedhaan Dubbisi (Listen to Page)"}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-600" />}
              <span className="hidden sm:inline">{isSpeaking ? "Dhaabi" : "Dhaggeeffadhu 🗣️"}</span>
            </button>

            {/* Bookmark Current Page */}
            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-xl border transition ${
                isBookmarked
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-white/60 hover:bg-white text-slate-600 border-slate-300'
              }`}
              title={isBookmarked ? "Fuula Mallatteeffame (Bookmarked)" : "Fuula kana Mallatteessi (Bookmark Page)"}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-600" /> : <Bookmark className="w-4 h-4" />}
            </button>

            {/* Font Size Adjuster */}
            <div className="flex items-center gap-1 bg-white/60 p-1 rounded-xl border border-slate-300 text-xs">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${fontSize === 'sm' ? 'bg-amber-600 text-white' : 'text-slate-600'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${fontSize === 'base' ? 'bg-amber-600 text-white' : 'text-slate-600'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${fontSize === 'lg' ? 'bg-amber-600 text-white' : 'text-slate-600'}`}
              >
                A+
              </button>
            </div>

            {/* Theme Switcher: Light, Sepia, Dark */}
            <div className="flex items-center gap-1 bg-white/60 p-1 rounded-xl border border-slate-300 text-xs">
              <button
                onClick={() => setTheme('light')}
                className={`px-2 py-1 rounded text-xs font-semibold ${theme === 'light' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
                title="Adii (Clean Light)"
              >
                Adii
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`px-2 py-1 rounded text-xs font-semibold ${theme === 'sepia' ? 'bg-amber-800 text-amber-50' : 'text-slate-600'}`}
                title="Waraqaa (Warm Sepia)"
              >
                Waraqaa
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-2 py-1 rounded text-xs font-semibold ${theme === 'dark' ? 'bg-slate-800 text-amber-400' : 'text-slate-600'}`}
                title="Halkan (Dark Mode)"
              >
                Halkan
              </button>
            </div>

            {/* Print Page */}
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-white/60 hover:bg-white text-slate-700 border border-slate-300 transition print:hidden"
              title="Print Page"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
              title="Cufi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TOAST MESSAGE */}
        {toastMessage && (
          <div className="px-4 py-2 bg-emerald-600 text-white text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">✕</button>
          </div>
        )}

        {/* BOOK SWITCHER TABS (Horizontal Shelf) */}
        <div className={`px-6 py-2 border-b flex items-center gap-2 overflow-x-auto no-scrollbar ${theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-100/70 border-slate-200'}`}>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Kitaabota:</span>
          {books.map(b => {
            const isSelected = b.id === selectedBookId;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBookId(b.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-600 text-white font-bold shadow-sm'
                    : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{b.title.split('-')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* MAIN BODY: READING PAGE & SIDE TABLE OF CONTENTS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: TABLE OF CONTENTS & CHAPTER QUICK JUMP (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            <div className={`p-4 rounded-2xl border ${themeClasses.card} shadow-sm`}>
              <h3 className={`text-sm font-bold pb-2 border-b ${themeClasses.heading} flex items-center gap-2`}>
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Baafata Boqonnaalee (Contents)</span>
              </h3>

              <div className="mt-3 space-y-2">
                {activeBook.chapters.map(ch => {
                  return (
                    <div key={ch.id} className="space-y-1">
                      <div className={`text-xs font-bold ${themeClasses.heading}`}>
                        {ch.title}
                      </div>
                      <div className="space-y-0.5 pl-2">
                        {ch.pages.map(p => {
                          const isCurrent = currentPage?.pageNumber === p.pageNumber;
                          const pageIdx = allPages.findIndex(ap => ap.pageNumber === p.pageNumber);
                          return (
                            <button
                              key={p.pageNumber}
                              onClick={() => {
                                if (pageIdx !== -1) {
                                  setCurrentPageIndex(pageIdx);
                                  stopSpeaking();
                                }
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                                isCurrent
                                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                                  : `hover:bg-amber-500/10 ${themeClasses.text}`
                              }`}
                            >
                              <span className="truncate">{p.sectionHeading}</span>
                              <span className="text-[10px] opacity-75">Fuula {p.pageNumber}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key Terms Glossary if available on current page */}
            {currentPage?.keyTerms && currentPage.keyTerms.length > 0 && (
              <div className={`p-4 rounded-2xl border ${themeClasses.card} shadow-sm`}>
                <h4 className={`text-xs font-bold uppercase tracking-wider pb-2 border-b flex items-center gap-1.5 ${themeClasses.heading}`}>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Jechoota Ijoo (Key Terms)</span>
                </h4>
                <div className="mt-2.5 space-y-2 text-xs">
                  {currentPage.keyTerms.map((kt, i) => (
                    <div key={i} className="pb-1.5 border-b border-dashed border-slate-300/40 last:border-none">
                      <span className="font-bold text-amber-600 block">{kt.term}</span>
                      <span className={`text-[11px] leading-snug ${themeClasses.subtext}`}>{kt.definition}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Did you know callout */}
            {currentPage?.didYouKnow && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs">
                <span className="font-bold block text-[11px] text-amber-800 uppercase tracking-wider mb-1">
                  💡 Beektu Laata? (Did You Know?)
                </span>
                <p className="leading-relaxed text-amber-950 font-serif italic text-xs">
                  "{currentPage.didYouKnow}"
                </p>
              </div>
            )}

          </div>

          {/* RIGHT: INTERACTIVE PAGE READER SURFACE (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            
            <div className="space-y-6">
              
              {/* Chapter & Page Number Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-300/40">
                <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                  {currentPage?.chapterTitle}
                </span>
                <span className={`text-xs font-mono font-bold ${themeClasses.subtext}`}>
                  Fuula {currentPage?.pageNumber} / {allPages.length}
                </span>
              </div>

              {/* Section Heading */}
              <h1 className={`text-xl sm:text-2xl font-serif font-black tracking-tight ${themeClasses.heading}`}>
                {currentPage?.sectionHeading}
              </h1>

              {/* Paragraphs */}
              <div className={`space-y-4 font-serif ${getFontSizeClasses()} ${themeClasses.text}`}>
                {currentPage?.paragraphs.map((para, idx) => (
                  <p key={idx} className="indent-4 text-justify">
                    {para}
                  </p>
                ))}
              </div>

              {/* Comprehension Quiz Card if page has one */}
              {currentPage?.comprehensionQuestion && (
                <div className={`mt-8 p-5 rounded-2xl border ${themeClasses.card} shadow-sm`}>
                  <div className="flex items-center gap-2 pb-2.5 border-b border-slate-300/40">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <h4 className={`text-sm font-bold ${themeClasses.heading}`}>
                      Hubannoo Sakkatta'i (Comprehension Check)
                    </h4>
                  </div>

                  <p className={`text-xs sm:text-sm font-medium mt-3 ${themeClasses.text}`}>
                    {currentPage.comprehensionQuestion.question}
                  </p>

                  <div className="mt-3 space-y-2">
                    {currentPage.comprehensionQuestion.options.map((opt, optIdx) => {
                      const isSelected = selectedOption === optIdx;
                      const isCorrect = optIdx === currentPage.comprehensionQuestion?.correctIndex;

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswerSubmitted}
                          onClick={() => setSelectedOption(optIdx)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition border flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-600 text-white border-amber-700'
                              : `bg-white/80 hover:bg-white ${themeClasses.text} border-slate-300/60`
                          } ${
                            isAnswerSubmitted && isCorrect
                              ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                              : isAnswerSubmitted && isSelected && !isCorrect
                              ? 'bg-rose-600 text-white border-rose-700'
                              : ''
                          }`}
                        >
                          <span>{opt}</span>
                          {isAnswerSubmitted && isCorrect && <span>✓ Sirrii</span>}
                          {isAnswerSubmitted && isSelected && !isCorrect && <span>✕ Balleessite</span>}
                        </button>
                      );
                    })}
                  </div>

                  {!isAnswerSubmitted && selectedOption !== null && (
                    <button
                      onClick={() => setIsAnswerSubmitted(true)}
                      className="mt-3 px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition"
                    >
                      Deebii Mirkaneessi (Check Answer)
                    </button>
                  )}

                  {isAnswerSubmitted && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs">
                      <p className="font-bold">Ibsa Deebii:</p>
                      <p className="mt-0.5">{currentPage.comprehensionQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* BOTTOM NAVIGATION: PREVIOUS & NEXT PAGE CONTROLS */}
            <div className="mt-8 pt-4 border-t border-slate-300/40 flex items-center justify-between">
              <button
                disabled={currentPageIndex === 0}
                onClick={handlePrevPage}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                  currentPageIndex === 0
                    ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-xs'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Fuula Duraa (Previous)</span>
              </button>

              {/* Page Progress bar */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-40 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-600 h-2 rounded-full transition-all"
                    style={{ width: `${((currentPageIndex + 1) / allPages.length) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-500 font-bold">
                  {Math.round(((currentPageIndex + 1) / allPages.length) * 100)}%
                </span>
              </div>

              <button
                disabled={currentPageIndex === allPages.length - 1}
                onClick={handleNextPage}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                  currentPageIndex === allPages.length - 1
                    ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                    : 'bg-amber-600 hover:bg-amber-700 text-white border-amber-700 shadow-xs'
                }`}
              >
                <span>Fuula Itti Aanu (Next)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
