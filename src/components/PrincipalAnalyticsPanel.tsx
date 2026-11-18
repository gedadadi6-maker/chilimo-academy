import React from 'react';
import { BarChart3, Users, DollarSign, Award, Bus, TrendingUp } from 'lucide-react';
import {
  getStoredUsers,
  getStoredBills,
  getStoredFinance,
  getStoredEnterpriseAdmissions,
  getStoredBuses
} from '../data/mockData';

export const PrincipalAnalyticsPanel: React.FC = () => {
  const users = getStoredUsers();
  const bills = getStoredBills();
  const finance = getStoredFinance();
  const admissions = getStoredEnterpriseAdmissions();
  const buses = getStoredBuses();

  const students = users.filter(u => u.role === 'student');
  const teachers = users.filter(u => u.role === 'teacher');
  const totalIncome = finance.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const totalExpense = finance.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const paidBills = bills.filter(b => b.status === 'paid').reduce((a, b) => a + b.amount, 0);
  const unpaidBills = bills.filter(b => b.status !== 'paid').reduce((a, b) => a + b.amount, 0);

  const maleCount = admissions.filter(a => a.gender === 'Male').length;
  const femaleCount = admissions.filter(a => a.gender === 'Female').length;
  const totalGender = Math.max(1, maleCount + femaleCount);

  const gradeBuckets = ['KG 1–3', 'Grades 1–4', 'Grades 5–6', 'Grades 7–8'].map(label => {
    const count = students.filter(s => {
      const g = (s.departmentOrGrade || '').toLowerCase();
      if (label === 'KG 1–3') return g.includes('kg');
      if (label === 'Grades 1–4') return /grade [1-4]/.test(g);
      if (label === 'Grades 5–6') return /grade [5-6]/.test(g);
      return /grade [7-8]/.test(g);
    }).length;
    return { label, count };
  });
  const maxGradeCount = Math.max(1, ...gradeBuckets.map(b => b.count));

  const feeTotal = Math.max(1, paidBills + unpaidBills);
  const collectionPct = Math.round((paidBills / feeTotal) * 100);

  return (
    <div className="space-y-6">
      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Barattoota &amp; Barsiisota</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-[#0f1e36] mt-2 tabular-nums">
            {students.length} <span className="text-xs font-semibold text-slate-500">Students</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{teachers.length} Faculty Teachers Active</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Galii vs Baasii (Net Ledger)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2 tabular-nums">
            {(totalIncome - totalExpense).toLocaleString()} ETB
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Income: {totalIncome.toLocaleString()} • Expense: {totalExpense.toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Sassaabbii Kaffaltii (Collection Rate)</span>
            <DollarSign className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-[#0f1e36] mt-2 tabular-nums">{collectionPct}%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Paid: {paidBills.toLocaleString()} ETB • Due: {unpaidBills.toLocaleString()} ETB
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Geejjiba &amp; Sadarkaa (Fleet &amp; Merit)</span>
            <Bus className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-[#0f1e36] mt-2 tabular-nums">
            {buses.length} Buses
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>99% Regional Grade 8 Pass Target</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enrollment Distribution Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-5 h-5 text-amber-600" />
            <h4 className="font-serif text-base font-bold text-[#0f1e36]">
              Facaatii Barattootaa Sadarkaa Kutaan (Enrollment Breakdown)
            </h4>
          </div>
          <div className="space-y-4">
            {gradeBuckets.map(bucket => {
              const widthPct = Math.max(8, Math.round((bucket.count / maxGradeCount) * 100));
              return (
                <div key={bucket.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{bucket.label}</span>
                    <span className="font-mono">{bucket.count} Students</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0f1e36] rounded-full transition-all"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial & Gender Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h4 className="font-serif text-base font-bold text-[#0f1e36] mb-3">
              Wal-madaalinsa Saalaa (Admission Dossier Ratio)
            </h4>
            <div className="h-4 rounded-full overflow-hidden bg-slate-100 flex">
              <div
                className="bg-[#0f1e36] h-full"
                style={{ width: `${Math.round((maleCount / totalGender) * 100)}%` }}
              />
              <div
                className="bg-amber-500 h-full"
                style={{ width: `${Math.round((femaleCount / totalGender) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-2 font-semibold text-slate-600">
              <span>Dhiira (Male): {maleCount}</span>
              <span>Dubara (Female): {femaleCount}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-serif text-base font-bold text-[#0f1e36] mb-3">
              Galii vs Baasii Mana Barumsaa
            </h4>
            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between font-bold text-emerald-700 mb-1">
                  <span>Galii (Total Income)</span>
                  <span className="font-mono">{totalIncome.toLocaleString()} ETB</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full w-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-bold text-rose-700 mb-1">
                  <span>Baasii (Total Expenses)</span>
                  <span className="font-mono">{totalExpense.toLocaleString()} ETB</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round((totalExpense / Math.max(1, totalIncome)) * 100))}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
