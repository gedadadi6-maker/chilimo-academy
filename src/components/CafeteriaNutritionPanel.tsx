import React, { useState, useEffect } from 'react';
import { Utensils, AlertTriangle, Plus, Trash2, Edit3, Printer, CheckCircle2 } from 'lucide-react';
import { Language, CafeteriaDayMenu, StudentDietaryAllergy } from '../types';
import {
  getStoredCafeteriaMenu,
  saveAllCafeteriaMenu,
  getStoredStudentAllergies,
  saveAllStudentAllergies,
  getStoredUsers
} from '../data/mockData';

interface CafeteriaNutritionPanelProps {
  currentLang: Language;
  viewerRole: 'admin' | 'teacher' | 'parent';
  linkedStudentId?: string;
  linkedStudentName?: string;
  linkedStudentGrade?: string;
  parentPhone?: string;
  onNotify?: (msg: string) => void;
}

export const CafeteriaNutritionPanel: React.FC<CafeteriaNutritionPanelProps> = ({
  currentLang,
  viewerRole,
  linkedStudentId = '151',
  linkedStudentName = 'Biqila Tolera Gemeda',
  linkedStudentGrade = 'Grade 7 - Section B',
  parentPhone = '0912305111',
  onNotify
}) => {
  const [menu, setMenu] = useState<CafeteriaDayMenu[]>(getStoredCafeteriaMenu);
  const [allergies, setAllergies] = useState<StudentDietaryAllergy[]>(getStoredStudentAllergies);
  const [editingDayId, setEditingDayId] = useState<string | null>(null);
  const [editSnack, setEditSnack] = useState('');
  const [editLunch, setEditLunch] = useState('');
  const [editFruit, setEditFruit] = useState('');

  // Allergy form
  const students = getStoredUsers().filter((u) => u.role === 'student');
  const [formStudentId, setFormStudentId] = useState(linkedStudentId);
  const [formAllergens, setFormAllergens] = useState('');
  const [formPref, setFormPref] =
    useState<StudentDietaryAllergy['dietaryPreference']>('No Peanuts');
  const [formNotes, setFormNotes] = useState('');

  useEffect(() => {
    const sync = () => {
      setMenu(getStoredCafeteriaMenu());
      setAllergies(getStoredStudentAllergies());
    };
    window.addEventListener('chilimo:data-updated', sync);
    return () => window.removeEventListener('chilimo:data-updated', sync);
  }, []);

  const startEditDay = (day: CafeteriaDayMenu) => {
    setEditingDayId(day.id);
    setEditSnack(day.morningSnack);
    setEditLunch(day.hotLunch);
    setEditFruit(day.afternoonFruit);
  };

  const handleSaveDay = (dayId: string) => {
    const updated = menu.map((d) =>
      d.id === dayId
        ? {
            ...d,
            morningSnack: editSnack.trim() || d.morningSnack,
            hotLunch: editLunch.trim() || d.hotLunch,
            afternoonFruit: editFruit.trim() || d.afternoonFruit
          }
        : d
    );
    saveAllCafeteriaMenu(updated);
    setMenu(updated);
    setEditingDayId(null);
    onNotify?.(
      currentLang === 'om'
        ? 'Sagantaan nyaata torbanii haaromfameera!'
        : 'Cafeteria weekly menu updated!'
    );
  };

  const handleAddAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAllergens.trim()) return;

    const targetStudent =
      viewerRole === 'parent'
        ? { id: linkedStudentId, name: linkedStudentName, grade: linkedStudentGrade }
        : (() => {
            const found = students.find((s) => s.id === formStudentId);
            return {
              id: found?.id || formStudentId,
              name: found?.name || linkedStudentName,
              grade: found?.departmentOrGrade || 'KG / Primary'
            };
          })();

    const entry: StudentDietaryAllergy = {
      id: `ALG-${Date.now().toString().slice(-4)}`,
      studentId: targetStudent.id,
      studentName: targetStudent.name,
      grade: targetStudent.grade,
      allergens: formAllergens.trim(),
      dietaryPreference: formPref,
      parentPhone: parentPhone,
      notes: formNotes.trim() || 'Handle strictly according to school clinic dietary protocol.',
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updated = [entry, ...allergies];
    saveAllStudentAllergies(updated);
    setAllergies(updated);
    setFormAllergens('');
    setFormNotes('');
    onNotify?.(
      currentLang === 'om'
        ? `Of-eeggannoon nyaataa ${targetStudent.name} galmaa’eera!`
        : `Dietary & allergy alert saved for ${targetStudent.name}.`
    );
  };

  const handleDeleteAllergy = (id: string) => {
    const updated = allergies.filter((a) => a.id !== id);
    saveAllStudentAllergies(updated);
    setAllergies(updated);
  };

  const visibleAllergies =
    viewerRole === 'parent'
      ? allergies.filter((a) => a.studentId === linkedStudentId)
      : allergies;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#0f1e36] flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-600" />
            <span>
              {currentLang === 'om'
                ? 'Sagantaa Nyaata Mooraa & Hordoffii Alarjii (KG 1–3 & Kutaa 1–8)'
                : 'School Cafeteria Weekly Menu & Dietary Allergy Tracker'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {currentLang === 'om'
              ? 'Nyaata torbanii qulqulluu ijoollee KG fi sadarkaa 1ffaa, akkasumas of-eeggannoo nyaataa maatii irraa dhufu to’adhaa.'
              : 'Weekly balanced nutrition schedule for KG 1–3 & Primary classes with verified student food allergy alerts.'}
          </p>
        </div>

        {viewerRole === 'admin' && (
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#0f1e36] hover:bg-slate-800 text-white text-xs font-bold rounded-lg inline-flex items-center gap-1.5 cursor-pointer print:hidden"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Kitchen Allergy Sheet</span>
          </button>
        )}
      </div>

      {/* Weekly Meal Menu Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#0f1e36]">
            {currentLang === 'om' ? 'Tarree Nyaata Torbanii (Wixata – Jimaata)' : 'Weekly Meal Plan (Mon – Fri)'}
          </h3>
          <span className="text-xs text-slate-500">Freshly Prepared Daily · Burayu Campus Kitchen</span>
        </div>

        <div className="divide-y divide-slate-100">
          {menu.map((day) => (
            <div key={day.id} className="p-5 hover:bg-slate-50/70 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm text-[#0f1e36]">{day.dayOfWeek}</span>
                  {day.suitableForKg && (
                    <span className="text-[11px] font-medium text-emerald-700">· KG 1–3 Friendly</span>
                  )}
                </div>

                {viewerRole === 'admin' && editingDayId !== day.id && (
                  <button
                    type="button"
                    onClick={() => startEditDay(day)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline cursor-pointer print:hidden"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Day</span>
                  </button>
                )}
              </div>

              {editingDayId === day.id ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Morning Snack (10:00 AM)
                    </label>
                    <input
                      type="text"
                      value={editSnack}
                      onChange={(e) => setEditSnack(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Hot Lunch (12:30 PM)
                    </label>
                    <input
                      type="text"
                      value={editLunch}
                      onChange={(e) => setEditLunch(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Afternoon Fruit (03:00 PM)
                    </label>
                    <input
                      type="text"
                      value={editFruit}
                      onChange={(e) => setEditFruit(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div className="md:col-span-3 flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingDayId(null)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveDay(day.id)}
                      className="px-4 py-1.5 bg-[#0f1e36] text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Save Menu
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-medium">Morning Snack · 10:00 AM</div>
                    <div className="font-semibold text-[#0f1e36] mt-0.5">{day.morningSnack}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-medium">Hot Lunch · 12:30 PM</div>
                    <div className="font-semibold text-[#0f1e36] mt-0.5">{day.hotLunch}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-medium">Afternoon Fruit · 03:00 PM</div>
                    <div className="font-semibold text-[#0f1e36] mt-0.5">{day.afternoonFruit}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Allergy & Dietary Restrictions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {(viewerRole === 'admin' || viewerRole === 'parent') && (
          <form
            onSubmit={handleAddAllergy}
            className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 print:hidden"
          >
            <h3 className="font-serif font-bold text-base text-[#0f1e36] flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-600" />
              <span>
                {currentLang === 'om'
                  ? 'Alarjii / Nyaata Dhorkame Galmeessi'
                  : 'Register Food Allergy / Dietary Note'}
              </span>
            </h3>

            {viewerRole === 'admin' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student</label>
                <select
                  value={formStudentId}
                  onChange={(e) => setFormStudentId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.departmentOrGrade || s.id})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="font-bold text-[#0f1e36]">{linkedStudentName}</div>
                <div className="text-slate-500 font-mono">ID: {linkedStudentId} · {linkedStudentGrade}</div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dietary Category
              </label>
              <select
                value={formPref}
                onChange={(e) =>
                  setFormPref(e.target.value as StudentDietaryAllergy['dietaryPreference'])
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option value="No Peanuts">No Peanuts (Ocholoonii Hin Qabu)</option>
                <option value="No Dairy">No Dairy / Milk (Aannan Malee)</option>
                <option value="Fasting / Vegan">Fasting / Vegan (Nyaata Soomaa)</option>
                <option value="Medical Special">Medical Special Diet</option>
                <option value="Standard">Standard Note</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Allergens / Restricted Foods
              </label>
              <input
                type="text"
                required
                value={formAllergens}
                onChange={(e) => setFormAllergens(e.target.value)}
                placeholder="e.g. Peanuts, Eggs, Cow Milk..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instructions for Kitchen &amp; Nurse
              </label>
              <textarea
                rows={2}
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Alternative food instructions or clinic alert..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0f1e36] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              {currentLang === 'om' ? 'Of-eeggannoo Galmeessi' : 'Save Allergy Alert'}
            </button>
          </form>
        )}

        {/* Registered Allergy Alerts List */}
        <div
          className={`${
            viewerRole === 'teacher' ? 'lg:col-span-12' : 'lg:col-span-7'
          } bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#0f1e36] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>
                {currentLang === 'om'
                  ? 'Tarree Barattoota Of-eeggannoo Nyaataa Qaban'
                  : 'Active Student Dietary & Allergy Alerts'}
              </span>
            </h3>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              {visibleAllergies.length} record(s)
            </span>
          </div>

          {visibleAllergies.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No food allergies recorded yet.</span>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {visibleAllergies.map((item) => (
                <div key={item.id} className="py-3.5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-[#0f1e36]">{item.studentName}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600">{item.grade}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-bold text-rose-700">{item.dietaryPreference}</span>
                    </div>
                    <div className="text-xs font-semibold text-rose-800">
                      Restricted: {item.allergens}
                    </div>
                    <p className="text-xs text-slate-600">{item.notes}</p>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Guardian: {item.parentPhone} · Updated {item.updatedAt}
                    </div>
                  </div>

                  {(viewerRole === 'admin' || viewerRole === 'parent') && (
                    <button
                      type="button"
                      onClick={() => handleDeleteAllergy(item.id)}
                      aria-label={`Remove allergy for ${item.studentName}`}
                      className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer shrink-0 print:hidden"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
