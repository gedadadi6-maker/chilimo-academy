import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Calendar, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import { Language, SchoolClubItem } from '../types';
import {
  getStoredClubs,
  saveAllClubs,
  toggleStudentClubMembership
} from '../data/mockData';

interface StudentClubsPanelProps {
  currentLang: Language;
  viewerRole: 'admin' | 'teacher' | 'student' | 'parent';
  studentId?: string;
  studentName?: string;
  onNotify?: (msg: string) => void;
}

export const StudentClubsPanel: React.FC<StudentClubsPanelProps> = ({
  currentLang,
  viewerRole,
  studentId = '151',
  studentName = 'Biqila Tolera Gemeda',
  onNotify
}) => {
  const [clubs, setClubs] = useState<SchoolClubItem[]>(getStoredClubs);
  const [categoryFilter, setCategoryFilter] = useState<'all' | SchoolClubItem['category']>('all');

  // Admin Create Club Form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [nameEn, setNameEn] = useState('');
  const [nameOm, setNameOm] = useState('');
  const [category, setCategory] = useState<SchoolClubItem['category']>('culture_art');
  const [patron, setPatron] = useState('Barsiisaa Chala Mengistu');
  const [schedule, setSchedule] = useState('Jimaata · 03:30 PM – 04:30 PM');
  const [room, setRoom] = useState('Main Hall');
  const [description, setDescription] = useState('');
  const [nextActivity, setNextActivity] = useState('');

  // Teacher/Admin quick activity update
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [activityDraft, setActivityDraft] = useState('');

  useEffect(() => {
    const sync = () => setClubs(getStoredClubs());
    window.addEventListener('chilimo:data-updated', sync);
    return () => window.removeEventListener('chilimo:data-updated', sync);
  }, []);

  const handleToggleJoin = (club: SchoolClubItem) => {
    const res = toggleStudentClubMembership(club.id, studentId, studentName);
    setClubs(res.clubs);
    onNotify?.(
      res.joined
        ? currentLang === 'om'
          ? `Gumii "${club.nameOm}" keessatti galmooftaniittu!`
          : `Joined ${club.name}!`
        : currentLang === 'om'
        ? `Gumii "${club.nameOm}" keessaa baataniittu.`
        : `Left ${club.name}.`
    );
  };

  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameOm.trim() && !nameEn.trim()) return;
    const newClub: SchoolClubItem = {
      id: `CLB-${Date.now().toString().slice(-4)}`,
      name: (nameEn || nameOm).trim(),
      nameOm: (nameOm || nameEn).trim(),
      category,
      patronTeacher: patron.trim(),
      meetingSchedule: schedule.trim(),
      locationRoom: room.trim(),
      description: description.trim() || 'Co-curricular student development club.',
      maxMembers: 40,
      memberStudentIds: [],
      memberNames: [],
      nextActivity: nextActivity.trim() || 'Orientation & Member Registration'
    };
    const updated = [newClub, ...clubs];
    saveAllClubs(updated);
    setClubs(updated);
    setNameEn('');
    setNameOm('');
    setDescription('');
    setNextActivity('');
    setShowCreateForm(false);
    onNotify?.(
      currentLang === 'om'
        ? `Gumiin haaraan "${newClub.nameOm}" banameera!`
        : `Created new club: ${newClub.name}`
    );
  };

  const handleSaveNextActivity = (clubId: string) => {
    if (!activityDraft.trim()) return;
    const updated = clubs.map((c) =>
      c.id === clubId ? { ...c, nextActivity: activityDraft.trim() } : c
    );
    saveAllClubs(updated);
    setClubs(updated);
    setEditingActivityId(null);
    onNotify?.(
      currentLang === 'om'
        ? 'Sagantaan itti aanu gumii haaromfameera!'
        : 'Updated upcoming club activity.'
    );
  };

  const handleDeleteClub = (clubId: string) => {
    const updated = clubs.filter((c) => c.id !== clubId);
    saveAllClubs(updated);
    setClubs(updated);
  };

  const categoryLabel = (cat: SchoolClubItem['category']) => {
    switch (cat) {
      case 'culture_art':
        return currentLang === 'om' ? 'Afaan & Aartii' : 'Arts & Culture';
      case 'stem':
        return 'STEM & Coding';
      case 'environment':
        return currentLang === 'om' ? 'Eegumsa Naannoo' : 'Environment';
      case 'literacy':
        return currentLang === 'om' ? 'Dubbisa & Falmii' : 'Literacy & Debate';
      case 'sports':
        return currentLang === 'om' ? 'Ispoortii' : 'Sports';
    }
  };

  const filtered =
    categoryFilter === 'all' ? clubs : clubs.filter((c) => c.category === categoryFilter);

  const myJoinedCount = clubs.filter((c) => c.memberStudentIds.includes(studentId)).length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#0f1e36] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>
                {currentLang === 'om'
                  ? 'Gumiilee Barattootaa fi Dandeettii (Student Clubs)'
                  : 'Student Clubs & Co-Curricular Activities'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {viewerRole === 'student'
                ? currentLang === 'om'
                  ? `Gumiilee fedhii keessanii filattanii galmaa'aa. Yeroo ammaa gumii ${myJoinedCount} keessa jirtu.`
                  : `Browse active academy clubs and join/leave anytime. Currently enrolled in ${myJoinedCount} club(s).`
                : viewerRole === 'parent'
                ? currentLang === 'om'
                  ? `Hirmaannaa gumii ${studentName} (ID: ${studentId}) hordofaa.`
                  : `Viewing co-curricular clubs for ${studentName} (ID: ${studentId}).`
                : currentLang === 'om'
                ? 'Gumiilee barattootaa hundeessi, barsiisaa itti gaafatamaa ramadi, fi sagantaa torbanii to’adhu.'
                : 'Manage school clubs, faculty patrons, member rosters, and upcoming student activities.'}
            </p>
          </div>

          {viewerRole === 'admin' && (
            <button
              type="button"
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-[#0f1e36] hover:bg-slate-800 text-white text-xs font-bold rounded-lg inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>{currentLang === 'om' ? 'Gumii Haaraa Uumi' : 'New Club'}</span>
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="pt-4 flex flex-wrap gap-1.5">
          {(
            [
              { key: 'all', label: currentLang === 'om' ? 'Hunda' : 'All Clubs' },
              { key: 'culture_art', label: currentLang === 'om' ? 'Afaan & Aartii' : 'Arts & Culture' },
              { key: 'stem', label: 'STEM & Coding' },
              { key: 'literacy', label: currentLang === 'om' ? 'Dubbisa & Falmii' : 'Literacy' },
              { key: 'environment', label: currentLang === 'om' ? 'Naannoo' : 'Environment' },
              { key: 'sports', label: currentLang === 'om' ? 'Ispoortii' : 'Sports' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setCategoryFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                categoryFilter === tab.key
                  ? 'bg-[#0f1e36] text-white border-[#0f1e36]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Create Form */}
      {viewerRole === 'admin' && showCreateForm && (
        <form
          onSubmit={handleCreateClub}
          className="bg-white p-6 rounded-2xl border border-amber-300 shadow-xs space-y-4"
        >
          <h3 className="font-serif font-bold text-base text-[#0f1e36]">
            {currentLang === 'om' ? 'Gumii Barattootaa Haaraa Galmeessi' : 'Register New Student Club'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={nameOm}
              onChange={(e) => setNameOm(e.target.value)}
              placeholder="Maqaa Gumii (Afaan Oromoo)"
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="Club Name (English)"
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SchoolClubItem['category'])}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            >
              <option value="culture_art">Arts &amp; Culture</option>
              <option value="stem">STEM &amp; Robotics</option>
              <option value="literacy">Literacy &amp; Debate</option>
              <option value="environment">Green &amp; Environment</option>
              <option value="sports">Sports &amp; Athletics</option>
            </select>
            <input
              type="text"
              value={patron}
              onChange={(e) => setPatron(e.target.value)}
              placeholder="Patron Teacher"
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
            <input
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="Meeting Day & Time"
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Location / Room"
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <input
            type="text"
            value={nextActivity}
            onChange={(e) => setNextActivity(e.target.value)}
            placeholder="Upcoming Club Event / Activity..."
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Club mission & student activities..."
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0f1e36] text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Save Club
            </button>
          </div>
        </form>
      )}

      {/* Club Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((club) => {
          const isMember = club.memberStudentIds.includes(studentId);
          return (
            <div
              key={club.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold text-amber-700">
                      {categoryLabel(club.category)} · {club.patronTeacher}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#0f1e36] mt-0.5">
                      {currentLang === 'om' ? club.nameOm : club.name}
                    </h3>
                  </div>

                  {viewerRole === 'admin' && (
                    <button
                      type="button"
                      onClick={() => handleDeleteClub(club.id)}
                      aria-label={`Delete ${club.name}`}
                      className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{club.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{club.meetingSchedule}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{club.locationRoom}</span>
                  </div>
                </div>

                {/* Next Activity */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-semibold text-[#0f1e36]">
                    {currentLang === 'om' ? 'Hojii Itti Aanu:' : 'Upcoming Activity:'}
                  </div>
                  {editingActivityId === club.id ? (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={activityDraft}
                        onChange={(e) => setActivityDraft(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveNextActivity(club.id)}
                        className="px-3 py-1.5 bg-[#0f1e36] text-white rounded-lg font-semibold cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="mt-0.5 flex items-center justify-between gap-2 text-slate-700">
                      <span>{club.nextActivity}</span>
                      {(viewerRole === 'admin' || viewerRole === 'teacher') && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingActivityId(club.id);
                            setActivityDraft(club.nextActivity);
                          }}
                          className="text-[11px] font-semibold text-amber-700 hover:underline shrink-0 cursor-pointer"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 font-mono tabular-nums">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {club.memberStudentIds.length} / {club.maxMembers} members
                  </span>
                </div>

                {viewerRole === 'student' && (
                  <button
                    type="button"
                    onClick={() => handleToggleJoin(club)}
                    className={`px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      isMember
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                        : 'bg-[#0f1e36] hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isMember
                      ? currentLang === 'om'
                        ? 'Galmoofteerta (Ba’i)'
                        : 'Joined (Leave)'
                      : currentLang === 'om'
                      ? 'Amma Galmaa’i'
                      : 'Join Club'}
                  </button>
                )}

                {viewerRole === 'parent' && isMember && (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{currentLang === 'om' ? 'Miseensa Gumii' : 'Enrolled'}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
