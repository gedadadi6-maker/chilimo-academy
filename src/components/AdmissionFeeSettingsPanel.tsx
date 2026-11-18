import React, { useState } from 'react';
import { Sliders, Save, CheckCircle2, Lock, Unlock, Receipt } from 'lucide-react';
import { AdmissionFeeSettings, GradeFeeConfig, Language, SchoolBill } from '../types';
import {
  getStoredAdmissionFeeSettings,
  saveAdmissionFeeSettings,
  getStoredUsers,
  getStoredBills,
  saveAllBills
} from '../data/mockData';

interface AdmissionFeeSettingsPanelProps {
  currentLang: Language;
  onNotify: (msg: string) => void;
  onBillsUpdated?: () => void;
}

export const AdmissionFeeSettingsPanel: React.FC<AdmissionFeeSettingsPanelProps> = ({
  onNotify,
  onBillsUpdated
}) => {
  const [settings, setSettings] = useState<AdmissionFeeSettings>(() => getStoredAdmissionFeeSettings());
  const [bulkGrade, setBulkGrade] = useState<string>('Grade 7');
  const [bulkTitle, setBulkTitle] = useState<string>('Monthly Tuition Fee');

  const handleFeeChange = (gradeLevel: string, field: keyof Omit<GradeFeeConfig, 'gradeLevel'>, value: number) => {
    setSettings(prev => ({
      ...prev,
      gradeFees: prev.gradeFees.map(row =>
        row.gradeLevel === gradeLevel ? { ...row, [field]: Math.max(0, value) } : row
      )
    }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveAdmissionFeeSettings(settings);
    onNotify('Haalli baniinsa galmee fi gatii kaffaltii kutaa hundaa olkaa\'ameera!');
  };

  const handleGenerateGradeBills = () => {
    const feeCfg = settings.gradeFees.find(g => g.gradeLevel === bulkGrade);
    if (!feeCfg) return;
    const students = getStoredUsers().filter(
      u => u.role === 'student' && (u.departmentOrGrade || '').toLowerCase().includes(bulkGrade.toLowerCase())
    );
    const targetStudents = students.length > 0 ? students : getStoredUsers().filter(u => u.role === 'student').slice(0, 1);

    const due = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
    const newBills: SchoolBill[] = targetStudents.map((stu, idx) => ({
      id: `BILL-${Date.now().toString().slice(-4)}-${idx + 1}`,
      studentId: stu.id,
      studentName: stu.name,
      grade: stu.departmentOrGrade || bulkGrade,
      billTitle: `${bulkTitle} (${bulkGrade})`,
      amount: feeCfg.monthlyTuition,
      dueDate: due,
      status: 'unpaid',
      category: 'tuition'
    }));

    const updated = [...newBills, ...getStoredBills()];
    saveAllBills(updated);
    onBillsUpdated?.();
    onNotify(`Waraqaan kaffaltii (${newBills.length}) barattoota ${bulkGrade}f qophaa'eera!`);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
                To&apos;annoo Galmee &amp; Gatii Kaffaltii (Admission &amp; Grade Fees)
              </h3>
              <p className="text-xs text-slate-500">
                Baniinsa/Cufiinsa galmee uummataa fi gatii galmee, ji&apos;aa fi geejjibaa kutaa kutaan murteessaa.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setSettings(prev => ({ ...prev, admissionsOpen: !prev.admissionsOpen }))
            }
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border cursor-pointer transition-colors ${
              settings.admissionsOpen
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            {settings.admissionsOpen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>
              {settings.admissionsOpen
                ? 'Galmeen Banaadha (Admissions OPEN)'
                : 'Galmeen Cufaadha (Admissions CLOSED)'}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bara Barnootaa (Academic Year)</label>
            <input
              type="text"
              value={settings.academicYearLabel}
              onChange={(e) => setSettings({ ...settings, academicYearLabel: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ergaa yoo Cufamu (Afaan Oromoo)</label>
            <input
              type="text"
              value={settings.closedMessageOm}
              onChange={(e) => setSettings({ ...settings, closedMessageOm: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Closed Message (English)</label>
            <input
              type="text"
              value={settings.closedMessageEn}
              onChange={(e) => setSettings({ ...settings, closedMessageEn: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>

        {/* Grade Fees Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
              <tr>
                <th className="py-2.5 px-4">Kutaa (Grade Level)</th>
                <th className="py-2.5 px-4">Kaffaltii Galmee (Registration ETB)</th>
                <th className="py-2.5 px-4">Kaffaltii Ji&apos;aa (Monthly Tuition ETB)</th>
                <th className="py-2.5 px-4">Geejjiba Konkolaataa (Bus ETB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {settings.gradeFees.map(row => (
                <tr key={row.gradeLevel} className="hover:bg-slate-50/70">
                  <td className="py-2 px-4 font-bold text-[#0f1e36]">{row.gradeLevel}</td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      value={row.registrationFee}
                      onChange={(e) => handleFeeChange(row.gradeLevel, 'registrationFee', Number(e.target.value))}
                      className="w-28 px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold text-xs"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      value={row.monthlyTuition}
                      onChange={(e) => handleFeeChange(row.gradeLevel, 'monthlyTuition', Number(e.target.value))}
                      className="w-28 px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold text-xs"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      value={row.busFee}
                      onChange={(e) => handleFeeChange(row.gradeLevel, 'busFee', Number(e.target.value))}
                      className="w-28 px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold text-xs"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#0f1e36] hover:bg-[#1a3156] text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer border border-amber-400/30"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Qindaa&apos;ina Olkaa&apos;i (Save Fee &amp; Admission Rules)</span>
          </button>
        </div>
      </form>

      {/* Quick Bulk Bill Generator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f1e36] mb-1">
            <Receipt className="w-4 h-4 text-amber-600" />
            <span>Waraqaa Kaffaltii Kutaa Tokkoof Yeroo Tokkotti Uumi (Batch Bill Generator)</span>
          </div>
          <input
            type="text"
            value={bulkTitle}
            onChange={(e) => setBulkTitle(e.target.value)}
            placeholder="e.g. Hidar Monthly Tuition"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Kutaa Filadhaa</label>
          <select
            value={bulkGrade}
            onChange={(e) => setBulkGrade(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
          >
            {settings.gradeFees.map(g => (
              <option key={g.gradeLevel} value={g.gradeLevel}>
                {g.gradeLevel} ({g.monthlyTuition} ETB)
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleGenerateGradeBills}
          className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-[#0f1e36] text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Generate Bills</span>
        </button>
      </div>
    </div>
  );
};
