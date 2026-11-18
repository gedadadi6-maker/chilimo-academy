import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Volume2, 
  Sparkles, 
  Star, 
  Heart, 
  Smile, 
  BookOpen, 
  CheckCircle, 
  Award, 
  Printer, 
  RotateCcw,
  Palette,
  Hash
} from 'lucide-react';
import { Language, KgLetterItem } from '../types';
import { KG_LEARNING_ITEMS, CHILIMO_INFO, getSchoolLogoUrl } from '../data/mockData';

interface KgLearningHubProps {
  currentLang: Language;
  onBack: () => void;
}

export const KgLearningHub: React.FC<KgLearningHubProps> = ({
  currentLang: _currentLang,
  onBack
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'qubee' | 'double_letter' | 'number' | 'color' | 'animal'>('qubee');
  const [selectedItem, setSelectedItem] = useState<KgLetterItem | null>(KG_LEARNING_ITEMS[0]);
  const [countNumber, setCountNumber] = useState<number>(3);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const filteredItems = activeCategory === 'all' 
    ? KG_LEARNING_ITEMS 
    : KG_LEARNING_ITEMS.filter(item => item.category === activeCategory);

  const speakWord = (text: string, langHint: string = 'om') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.1; // friendly child pitch
      if (langHint === 'en') {
        utterance.lang = 'en-US';
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectItem = (item: KgLetterItem) => {
    setSelectedItem(item);
    speakWord(item.exampleWordAfaanOromoo);
  };

  // Fun KG Practice Mini-Game
  const kgQuiz = [
    {
      q: "Qubee kamtu 'Arba' (Elephant) jedhuun eegala?",
      options: ["A", "B", "C", "D"],
      answer: 0,
      emoji: "🐘"
    },
    {
      q: "Qubee kamtu 'Leenca' (Lion) jedhuun eegala?",
      options: ["M", "L", "K", "T"],
      answer: 1,
      emoji: "🦁"
    },
    {
      q: "Halluun 'Magariisa' isa kami?",
      options: ["🍎 Diimaa", "🌲 Magariisa", "🌊 Cuquliisa", "☀️ Keelloo"],
      answer: 1,
      emoji: "🎨"
    },
    {
      q: "Lakkoofsi '3' Afaan Oromootiin maal jedhama?",
      options: ["Tokko", "Lama", "Sadii", "Afur"],
      answer: 2,
      emoji: "🥉"
    }
  ];

  const handleQuizAnswer = (idx: number) => {
    const currentQ = kgQuiz[quizQuestionIndex];
    if (idx === currentQ.answer) {
      setQuizFeedback("correct");
      setQuizScore(prev => prev + 1);
      speakWord("Baay'ee Gaarii! Qabxii Argatteetta!");
    } else {
      setQuizFeedback("wrong");
      speakWord("Irra Deebi'i Yaali!");
    }
    setTimeout(() => {
      setQuizFeedback(null);
      if (quizQuestionIndex < kgQuiz.length - 1) {
        setQuizQuestionIndex(prev => prev + 1);
      } else {
        setQuizQuestionIndex(0);
      }
    }, 1500);
  };

  return (
    <div className="py-8 bg-gradient-to-b from-amber-50/50 via-sky-50/40 to-emerald-50/30 min-h-[90vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-amber-200/80 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-sm"
              title="Deebi'i"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-amber-100 rounded-2xl shadow-inner border border-amber-200">🎈</span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-[#0f1e36] tracking-tight">
                    Kutaa Daa'immanii: KG 1-3
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-400 text-slate-950 uppercase tracking-wider shadow-sm">
                    Early Learning Hub
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Barnoota Qubee Afaan Oromoo, Lakkoofsa, Bifoota fi Beeyladoota Daa'immaniif
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrintModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 transition shadow-sm"
            >
              <Printer className="w-4 h-4 text-amber-600" />
              Waraqaa Qubee Maxxansi (Print)
            </button>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-6 pb-4">
          {[
            { id: 'qubee', label: '🔤 Qubee Dubbifamaa (A-Z)', count: 23 },
            { id: 'double_letter', label: '✨ Qubee Dachaa (CH, DH, NY...)', count: 5 },
            { id: 'number', label: '🔢 Lakkoofsa 1-10', count: 10 },
            { id: 'color', label: '🎨 Bifoota (Colors)', count: 6 },
            { id: 'all', label: '🌟 Hunda Agarsiisi', count: KG_LEARNING_ITEMS.length }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 shadow-sm ${
                activeCategory === cat.id
                  ? 'bg-[#0f1e36] text-white shadow-md ring-2 ring-amber-400'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50 hover:border-amber-300'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeCategory === cat.id ? 'bg-amber-400 text-slate-900 font-black' : 'bg-slate-100 text-slate-600'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Main Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          
          {/* Interactive Letter Grid */}
          <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Qubee Yookiin Lakkoofsa Tuqi • Click to Hear Pronunciation
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {filteredItems.length} items
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filteredItems.map(item => {
                const isSelected = selectedItem?.letter === item.letter;
                return (
                  <button
                    key={item.letter}
                    onClick={() => handleSelectItem(item)}
                    className={`relative p-3.5 rounded-2xl flex flex-col items-center justify-center transition transform active:scale-95 group text-center ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 shadow-lg scale-105 ring-4 ring-amber-200'
                        : 'bg-slate-50 hover:bg-amber-50/70 border border-slate-200 text-slate-800 hover:border-amber-300'
                    }`}
                  >
                    <span className="text-2xl mb-1 filter drop-shadow group-hover:scale-110 transition duration-200">
                      {item.iconOrEmoji}
                    </span>
                    <span className="text-xl font-black tracking-tight">
                      {item.letter}
                    </span>
                    <span className={`text-[11px] font-bold truncate max-w-full ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                      {item.exampleWordAfaanOromoo}
                    </span>
                    <span className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition">
                      <Volume2 className="w-3 h-3 text-slate-500" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Spotlight Card */}
          <div className="lg:col-span-4 space-y-5">
            {selectedItem ? (
              <div className="bg-gradient-to-br from-[#0f1e36] to-[#1c325c] text-white p-6 rounded-2xl shadow-xl border border-amber-500/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl font-black">
                  {selectedItem.letter}
                </div>

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider">
                    {selectedItem.category.toUpperCase().replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => speakWord(selectedItem.exampleWordAfaanOromoo)}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-amber-300 flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    Dhaga'i (Listen)
                  </button>
                </div>

                <div className="text-center py-4 relative z-10">
                  <div className="text-6xl mb-2 filter drop-shadow-md">
                    {selectedItem.iconOrEmoji}
                  </div>
                  <div className="text-5xl font-black text-amber-400 tracking-tight">
                    {selectedItem.letter}
                  </div>
                  <div className="text-sm font-semibold text-slate-300 mt-1 font-mono">
                    {selectedItem.phoneticSound}
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 border border-white/10 space-y-2 relative z-10">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Afaan Oromoo:</span>
                    <span className="font-black text-amber-300 text-base">{selectedItem.exampleWordAfaanOromoo}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">English Meaning:</span>
                    <span className="font-bold text-white">{selectedItem.exampleWordEnglish} ({selectedItem.meaningInEnglish})</span>
                  </div>
                </div>

                <button
                  onClick={() => speakWord(`${selectedItem.letter}. ${selectedItem.exampleWordAfaanOromoo}. ${selectedItem.exampleWordEnglish}`)}
                  className="w-full mt-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-black text-xs transition shadow-md flex items-center justify-center gap-2 relative z-10"
                >
                  <Volume2 className="w-4 h-4" />
                  Sagalee Qubee fi Jechaa Dhageeffadhu
                </button>
              </div>
            ) : null}

            {/* Interactive Counting Box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Shaakala Lakkoofsaa (Interactive Counter)
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  KG Math
                </span>
              </div>

              <div className="pt-4 text-center">
                <div className="text-3xl font-black text-[#0f1e36]">
                  {countNumber}
                </div>
                <div className="text-xs font-bold text-amber-600 mt-0.5">
                  {countNumber === 1 && "Tokko (One)"}
                  {countNumber === 2 && "Lama (Two)"}
                  {countNumber === 3 && "Sadii (Three)"}
                  {countNumber === 4 && "Afur (Four)"}
                  {countNumber === 5 && "Shan (Five)"}
                  {countNumber === 6 && "Jaha (Six)"}
                  {countNumber === 7 && "Torba (Seven)"}
                  {countNumber === 8 && "Saddeet (Eight)"}
                  {countNumber === 9 && "Sagal (Nine)"}
                  {countNumber === 10 && "Kudhan (Ten)"}
                </div>

                {/* Counter visual stars/apples */}
                <div className="flex flex-wrap justify-center gap-2 my-4 min-h-[40px] items-center">
                  {Array.from({ length: countNumber }).map((_, i) => (
                    <span key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 100}ms` }}>
                      ⭐
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      const next = Math.max(1, countNumber - 1);
                      setCountNumber(next);
                      speakWord(`${next}`);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-black text-slate-700 text-sm"
                  >
                    -
                  </button>
                  <button
                    onClick={() => speakWord(`${countNumber}`)}
                    className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 font-bold text-amber-900 text-xs flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Sagaleessi
                  </button>
                  <button
                    onClick={() => {
                      const next = Math.min(10, countNumber + 1);
                      setCountNumber(next);
                      speakWord(`${next}`);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-black text-white text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Quick KG Mini Quiz */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50/60 p-5 rounded-2xl border border-indigo-100 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-100/60">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                    Tapha Shaakala Daa'immanii (KG Quiz)
                  </span>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-full shadow-xs">
                  Qabxii: {quizScore}
                </span>
              </div>

              <div className="pt-3">
                <div className="text-center text-3xl mb-1">
                  {kgQuiz[quizQuestionIndex].emoji}
                </div>
                <p className="text-xs font-bold text-slate-800 text-center mb-3">
                  {kgQuiz[quizQuestionIndex].q}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {kgQuiz[quizQuestionIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(idx)}
                      className="p-2 bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 text-indigo-950 font-black text-xs rounded-xl transition shadow-xs active:scale-95 text-center"
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {quizFeedback && (
                  <div className={`mt-3 p-2 rounded-lg text-center text-xs font-black ${
                    quizFeedback === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {quizFeedback === 'correct' ? "🎉 Baay'ee Gaarii! Qabxii Argatteetta!" : "❌ Irra Deebi'i Yaali!"}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Printable Poster Modal */}
        {showPrintModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <img src={getSchoolLogoUrl()} alt="Logo" className="w-12 h-12 object-contain" />
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      CHILIMO ACADEMY - Waraqaa Qubee Afaan Oromoo Daa'immaniif
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      KG 1 - KG 3 Early Childhood Learning Wall Poster • Burayu, Oromia
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Waraqaa Maxxansi (Print)
                  </button>
                  <button
                    onClick={() => setShowPrintModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black"
                  >
                    Cufi (Close)
                  </button>
                </div>
              </div>

              {/* Poster Grid */}
              <div className="py-6 grid grid-cols-4 sm:grid-cols-6 gap-3">
                {KG_LEARNING_ITEMS.filter(k => k.category === 'qubee' || k.category === 'double_letter').map(item => (
                  <div key={item.letter} className="border-2 border-slate-200 rounded-xl p-3 text-center bg-slate-50">
                    <div className="text-2xl">{item.iconOrEmoji}</div>
                    <div className="text-2xl font-black text-[#0f1e36]">{item.letter}</div>
                    <div className="text-xs font-bold text-amber-700">{item.exampleWordAfaanOromoo}</div>
                    <div className="text-[10px] text-slate-500">{item.exampleWordEnglish}</div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
                Chilimo Academy KG Department • Phone: {CHILIMO_INFO.phone} • Email: {CHILIMO_INFO.email}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
