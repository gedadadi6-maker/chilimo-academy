import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Star, 
  Heart, 
  Sparkles, 
  Smile, 
  Award, 
  Utensils, 
  Moon, 
  UserCheck, 
  CheckCircle2, 
  Plus, 
  Edit3,
  Calendar,
  Baby
} from 'lucide-react';
import { KgProgressProfile, KgSkillAssessment } from '../types';
import { 
  getStoredKgProfiles, 
  saveKgProfile, 
  CHILIMO_INFO 
} from '../data/mockData';

interface KgMilestoneHubModalProps {
  onClose: () => void;
}

export const KgMilestoneHubModal: React.FC<KgMilestoneHubModalProps> = ({ onClose }) => {
  const [profiles, setProfiles] = useState<KgProgressProfile[]>(getStoredKgProfiles());
  const [selectedProfileId, setSelectedProfileId] = useState<string>(profiles[0]?.id || 'KGP-2026-001');
  const [activeTab, setActiveTab] = useState<'profile_card' | 'add_new'>('profile_card');
  const [toast, setToast] = useState<string | null>(null);

  // New Profile Form
  const [newName, setNewName] = useState('');
  const [newKgLevel, setNewKgLevel] = useState<'KG 1' | 'KG 2' | 'KG 3'>('KG 1');
  const [newBadge, setNewBadge] = useState<KgProgressProfile['overallAwardBadge']>('Little Star ⭐');
  const [newTeacherNote, setNewTeacherNote] = useState('Daa\'ima dammaqaa fi jaalala qabuudha!');

  const currentProfile = profiles.find(p => p.id === selectedProfileId) || profiles[0];

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newProf: KgProgressProfile = {
      id: `KGP-2026-${Date.now().toString().slice(-4)}`,
      studentId: `KG-${Math.floor(100 + Math.random() * 900)}`,
      studentName: newName,
      kgLevel: newKgLevel,
      academicYear: "2025/2026",
      term: "Term 1",
      photoUrl: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&q=80&w=300",
      skills: [
        { category: "Qubee & Afaan", title: "Qubee fi Sagalee Adda Baasuu", ratingStars: 5, status: "Mastered (Baay'ee Gaarii)", teacherObservation: "Qubee sirriitti beeka." },
        { category: "Lakkoofsa & Herrega", title: "Lakkoofsa 1-20 fi Biftuuwwan", ratingStars: 4, status: "Mastered (Baay'ee Gaarii)", teacherObservation: "Lakkoofsa daddafsee qabata." },
        { category: "Ogummaa Harkaa & Fakkii", title: "Fakkii Dibuu fi Pilaastikiinii", ratingStars: 5, status: "Mastered (Baay'ee Gaarii)", teacherObservation: "Ogummaa harkaa gaarii qaba." },
        { category: "Naamusa & Tapha", title: "Hiriyoota Wajjin Tapha Qooddachuu", ratingStars: 5, status: "Mastered (Baay'ee Gaarii)", teacherObservation: "Nagaan taphata." }
      ],
      eatingHabits: "Nyaata ganamaa fi laaqana guutuu nyaata.",
      napAndRestHabits: "Boqonnaa sa'aatii 01:00 PM nagaan rafa.",
      socialFriendliness: "Gammachuu qaba, hiriyoota hedduu qaba.",
      overallAwardBadge: newBadge,
      teacherLoveNote: newTeacherNote,
      nurseHealthNote: "Fayyaa qabeessa, ulfaatina sirrii.",
      dateGenerated: new Date().toISOString().split('T')[0]
    };

    saveKgProfile(newProf);
    setProfiles(getStoredKgProfiles());
    setSelectedProfileId(newProf.id);
    setActiveTab('profile_card');
    setNewName('');
    setToast("Galmeen daa'ima KG haarawaan galmaa'eera!");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[94vh] overflow-y-auto">
        
        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 bg-[#0f1e36] text-white px-5 py-3 rounded-2xl shadow-xl border border-amber-400 flex items-center gap-2 text-xs font-bold animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toast}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-2xl shadow-sm">
              <Baby className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#0f1e36]">
                  Kutaa fi Kaardii Daa'imman KG 1–3 (Early Childhood Milestone Hub)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-pink-100 text-pink-800">
                  Kindergarten Excellence
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Chilimo Academy KG 1, KG 2, & KG 3 Early Learning & Pictorial Progress Cards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-[#0f1e36] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Kaardii KG Maxxansi</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Tabs & Profile Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('profile_card')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'profile_card'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Kaardii Guddina Daa'imaa (Progress Card)
            </button>
            <button
              onClick={() => setActiveTab('add_new')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'add_new'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Daa'ima Haarawa Galmeessi</span>
            </button>
          </div>

          {activeTab === 'profile_card' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Daa'ima Filadhaa:</span>
              <select
                value={selectedProfileId}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                className="px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-900"
              >
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.studentName} ({p.kgLevel})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: PICTORIAL PROGRESS CARD */}
        {activeTab === 'profile_card' && currentProfile && (
          <div className="mt-6 p-6 sm:p-8 bg-gradient-to-b from-rose-50/50 via-white to-amber-50/30 rounded-3xl border-2 border-rose-200 shadow-sm relative">
            
            {/* Header of KG Certificate */}
            <div className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b-2 border-rose-200 gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src={currentProfile.photoUrl} 
                  alt={currentProfile.studentName} 
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-rose-300 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-[#0f1e36]">
                      {currentProfile.studentName}
                    </h3>
                    <span className="px-3 py-1 bg-rose-500 text-white rounded-full text-xs font-black">
                      {currentProfile.kgLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    ID: {currentProfile.studentId} • Academic Year: {currentProfile.academicYear} • {currentProfile.term}
                  </p>
                </div>
              </div>

              {/* Award Ribbon */}
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-5 py-3 rounded-2xl shadow-md text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider block">Award Badge</span>
                <strong className="text-base font-black flex items-center gap-1 justify-center">
                  <Sparkles className="w-4 h-4" />
                  <span>{currentProfile.overallAwardBadge}</span>
                </strong>
              </div>
            </div>

            {/* Core Skills & Star Ratings */}
            <div className="py-6 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-rose-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Madaallii Guddina Dandeettii Daa'imaa (Developmental Milestone Stars)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentProfile.skills.map((skill, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wide block">
                          {skill.category}
                        </span>
                        <h5 className="font-bold text-xs text-slate-900">{skill.title}</h5>
                      </div>

                      {/* Stars Display */}
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map(st => (
                          <Star 
                            key={st} 
                            className={`w-4 h-4 ${st <= skill.ratingStars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl italic">
                      "{skill.teacherObservation}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Routine: Eating, Nap & Social Habit */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 pb-6 border-t border-rose-200">
              <div className="bg-white p-3.5 rounded-2xl border border-rose-100">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs mb-1">
                  <Utensils className="w-4 h-4" />
                  <span>Sirna Nyaataa (Eating)</span>
                </div>
                <p className="text-xs text-slate-600">{currentProfile.eatingHabits}</p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-rose-100">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs mb-1">
                  <Moon className="w-4 h-4" />
                  <span>Boqonnaa & Rafuu (Nap Time)</span>
                </div>
                <p className="text-xs text-slate-600">{currentProfile.napAndRestHabits}</p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-rose-100">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs mb-1">
                  <Smile className="w-4 h-4" />
                  <span>Hariyaa & Tapha (Social)</span>
                </div>
                <p className="text-xs text-slate-600">{currentProfile.socialFriendliness}</p>
              </div>
            </div>

            {/* Teacher Love Note & Nurse Health Summary */}
            <div className="bg-pink-100/60 p-4 rounded-2xl border border-pink-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-start gap-2.5">
                <Heart className="w-5 h-5 text-rose-600 fill-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-rose-800 uppercase block">Ergaa Jaalalaa Barsiisaa:</span>
                  <p className="text-xs text-rose-950 font-medium italic">"{currentProfile.teacherLoveNote}"</p>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-600 font-mono">
                <div>Kilinika Narsii: <strong className="text-emerald-700">✓ Healthy</strong></div>
                <div className="text-[10px] text-slate-400">Chilimo Early Childhood Center</div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ADD NEW KG STUDENT FORM */}
        {activeTab === 'add_new' && (
          <form onSubmit={handleCreateProfile} className="mt-6 max-w-xl mx-auto space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <h3 className="font-bold text-base text-[#0f1e36]">Daa'ima KG Haarawa Galmeessi</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Maqaa Daa'imaa Guutuu</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Fkn: Biqilaa Hundarra"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sadarkaa KG</label>
                <select
                  value={newKgLevel}
                  onChange={(e) => setNewKgLevel(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                >
                  <option value="KG 1">KG 1 (Little Angels)</option>
                  <option value="KG 2">KG 2 (Buds)</option>
                  <option value="KG 3">KG 3 (Pre-Primary)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badhaasa Asxaa (Badge)</label>
                <select
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                >
                  <option value="Little Star ⭐">Little Star ⭐</option>
                  <option value="Bright Explorer 🚀">Bright Explorer 🚀</option>
                  <option value="Creative Artist 🎨">Creative Artist 🎨</option>
                  <option value="Super Helper 💖">Super Helper 💖</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ergaa Barsiisaa (Teacher Note)</label>
              <textarea
                rows={3}
                value={newTeacherNote}
                onChange={(e) => setNewTeacherNote(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Kaardii Daa'imaa Uumi</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
