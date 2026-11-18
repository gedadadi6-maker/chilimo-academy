import React, { useState } from 'react';
import { 
  X, 
  DollarSign, 
  Users, 
  FileText, 
  CheckCircle2, 
  Printer, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  Building2, 
  ShieldCheck, 
  Calendar, 
  CreditCard, 
  Check, 
  AlertCircle,
  TrendingUp,
  Landmark,
  FileSpreadsheet
} from 'lucide-react';
import { Language, StaffEmployeeRecord, StaffPayrollSlip, UserAccount } from '../types';
import { 
  CHILIMO_INFO, 
  getStoredStaffEmployees, 
  saveAllStaffEmployees, 
  getStoredPayrollSlips, 
  saveAllPayrollSlips,
  calculateEthiopianTax
} from '../data/mockData';

interface StaffPayrollManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  currentAdmin: UserAccount;
}

export const StaffPayrollManagementModal: React.FC<StaffPayrollManagementModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  currentAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'employees' | 'payroll_run' | 'report'>('payroll_run');
  const [employees, setEmployees] = useState<StaffEmployeeRecord[]>(() => getStoredStaffEmployees());
  const [payrollSlips, setPayrollSlips] = useState<StaffPayrollSlip[]>(() => getStoredPayrollSlips());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedSlipForPrint, setSelectedSlipForPrint] = useState<StaffPayrollSlip | null>(null);
  const [isEditingStaff, setIsEditingStaff] = useState<boolean>(false);
  const [staffForm, setStaffForm] = useState<Partial<StaffEmployeeRecord>>({
    fullName: '',
    gender: 'Male',
    role: 'Teacher',
    department: 'Primary Education',
    phone: '09',
    email: '',
    bankName: 'Commercial Bank of Ethiopia (CBE)',
    bankAccountNumber: '',
    tinNumber: '',
    basicSalary: 12000,
    housingAllowance: 2000,
    transportAllowance: 1200,
    positionAllowance: 0,
    overtimeOrBonus: 0,
    status: 'active'
  });
  const [successToast, setSuccessToast] = useState<string>('');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const filteredEmployees = employees.filter(emp => {
    const matchSearch = emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'all' || emp.role === roleFilter;
    return matchSearch && matchRole;
  });

  // Payroll Metrics
  const totalBasic = payrollSlips.reduce((sum, s) => sum + s.basicSalary, 0);
  const totalAllowances = payrollSlips.reduce((sum, s) => sum + s.totalAllowances, 0);
  const totalGross = payrollSlips.reduce((sum, s) => sum + s.grossSalary, 0);
  const totalIncomeTax = payrollSlips.reduce((sum, s) => sum + s.incomeTaxDeduction, 0);
  const totalPension7 = payrollSlips.reduce((sum, s) => sum + s.employeePension7Percent, 0);
  const totalPension11 = payrollSlips.reduce((sum, s) => sum + s.employerPension11Percent, 0);
  const totalNet = payrollSlips.reduce((sum, s) => sum + s.netSalary, 0);

  const handleRunMonthlyPayroll = () => {
    const currentMonth = "Sadaasa 2018 E.C. (November 2026)";
    const payPeriod = "2018-03 (Monthly)";

    const newSlips: StaffPayrollSlip[] = employees.filter(e => e.status === 'active').map((emp, idx) => {
      const allowances = emp.housingAllowance + emp.transportAllowance + emp.positionAllowance + emp.overtimeOrBonus;
      const gross = emp.basicSalary + allowances;
      const calc = calculateEthiopianTax(gross, emp.basicSalary);
      return {
        id: `PS-2018-03-${100 + idx}`,
        employeeId: emp.employeeId,
        employeeName: emp.fullName,
        role: emp.role,
        department: emp.department,
        month: currentMonth,
        payPeriod,
        basicSalary: emp.basicSalary,
        totalAllowances: allowances,
        grossSalary: gross,
        employeePension7Percent: calc.employeePension7,
        employerPension11Percent: calc.employerPension11,
        incomeTaxDeduction: calc.incomeTax,
        otherDeductions: 0,
        netSalary: calc.netPay,
        disbursementMethod: emp.bankName.includes("CBE") ? "CBE" : emp.bankName.includes("Telebirr") ? "Telebirr" : emp.bankName.includes("Cooperative") ? "Awash Bank" : "Cash",
        bankAccountOrTelebirr: emp.bankAccountNumber,
        paymentRef: `SAL-TXN-2018-${2000 + idx}`,
        status: "paid",
        paymentDate: new Date().toISOString().split('T')[0],
        preparedBy: `${currentAdmin.name} (Finance)`,
        approvedBy: "Obbo Geda Dadi (Principal)"
      };
    });

    setPayrollSlips(newSlips);
    saveAllPayrollSlips(newSlips);
    showToast("Kaffaltiin Mindaa ji'a kanaa milkaa'inaan raawwatameera! (Payroll successfully disbursed!)");
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.fullName || !staffForm.basicSalary) return;

    if (staffForm.id) {
      // update
      const updated = employees.map(emp => emp.id === staffForm.id ? { ...emp, ...staffForm } as StaffEmployeeRecord : emp);
      setEmployees(updated);
      saveAllStaffEmployees(updated);
      showToast("Odeeffannoon hojjetaa haareffameera! (Staff updated successfully!)");
    } else {
      // create new
      const newEmpId = `EMP-${(employees.length + 1).toString().padStart(3, '0')}`;
      const newStaff: StaffEmployeeRecord = {
        id: newEmpId,
        employeeId: `CHA-EMP-${(employees.length + 1).toString().padStart(3, '0')}`,
        fullName: staffForm.fullName || '',
        gender: staffForm.gender || 'Male',
        role: staffForm.role || 'Teacher',
        department: staffForm.department || 'General',
        phone: staffForm.phone || '0912000000',
        email: staffForm.email || `${staffForm.fullName?.toLowerCase().replace(/\s+/g, '.')}@chilimo.edu.et`,
        joinDate: new Date().toISOString().split('T')[0],
        bankName: staffForm.bankName || 'Commercial Bank of Ethiopia (CBE)',
        bankAccountNumber: staffForm.bankAccountNumber || '1000' + Math.floor(100000000 + Math.random() * 900000000),
        tinNumber: staffForm.tinNumber || '00' + Math.floor(10000000 + Math.random() * 90000000),
        basicSalary: Number(staffForm.basicSalary) || 12000,
        housingAllowance: Number(staffForm.housingAllowance) || 0,
        transportAllowance: Number(staffForm.transportAllowance) || 0,
        positionAllowance: Number(staffForm.positionAllowance) || 0,
        overtimeOrBonus: Number(staffForm.overtimeOrBonus) || 0,
        status: staffForm.status || 'active'
      };
      const updated = [newStaff, ...employees];
      setEmployees(updated);
      saveAllStaffEmployees(updated);
      showToast("Hojjetaan haaraan galmeeffameera! (New employee registered!)");
    }
    setIsEditingStaff(false);
  };

  const openEditStaff = (emp: StaffEmployeeRecord) => {
    setStaffForm(emp);
    setIsEditingStaff(true);
  };

  const openNewStaff = () => {
    setStaffForm({
      fullName: '',
      gender: 'Male',
      role: 'Teacher',
      department: 'Primary Education',
      phone: '09',
      email: '',
      bankName: 'Commercial Bank of Ethiopia (CBE)',
      bankAccountNumber: '',
      tinNumber: '',
      basicSalary: 12000,
      housingAllowance: 2000,
      transportAllowance: 1200,
      positionAllowance: 0,
      overtimeOrBonus: 0,
      status: 'active'
    });
    setIsEditingStaff(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
              <DollarSign className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold tracking-tight">Bulchiinsa Hojjettootaa & Mindaa (Staff & Payroll ERP)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                  Ethiopian Tax & Pension Engine
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                Chilimo Academy • Burayu, Oromia • Income Tax (0-35%) & POESSA Pension (7% / 11%)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-100 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-sm font-medium flex items-center justify-between shadow-inner">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast('')} className="text-emerald-200 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('payroll_run')}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
                activeTab === 'payroll_run'
                  ? 'bg-white text-emerald-800 border-emerald-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 border-transparent'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Kaffaltii Mindaa Ji'aa (Monthly Payroll)</span>
            </button>
            <button
              onClick={() => setActiveTab('employees')}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
                activeTab === 'employees'
                  ? 'bg-white text-emerald-800 border-emerald-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 border-transparent'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Galmee Hojjettootaa (Staff Directory)</span>
              <span className="px-1.5 py-0.2 rounded-full text-xs bg-slate-200 text-slate-700">{employees.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
                activeTab === 'report'
                  ? 'bg-white text-emerald-800 border-emerald-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 border-transparent'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Gabaasa & Galii Gibiraa (Salary & Tax Report)</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 pb-2">
            <button
              onClick={openNewStaff}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Hojjetaa Haaraa Galmeessi</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {/* TAB 1: PAYROLL RUN */}
          {activeTab === 'payroll_run' && (
            <div className="space-y-6">
              
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Mindaa Bu'uuraa Waliigala</div>
                  <div className="text-xl font-black text-slate-800 mt-1">{totalBasic.toLocaleString()} ETB</div>
                  <div className="text-xs text-slate-400 mt-0.5">Basic Salaries ({payrollSlips.length} Staff)</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Durgoo & Boonaasii</div>
                  <div className="text-xl font-black text-blue-700 mt-1">{totalAllowances.toLocaleString()} ETB</div>
                  <div className="text-xs text-blue-500 mt-0.5">Housing + Transport + Position</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Gibira & Sooroma (Tax+Pen)</div>
                  <div className="text-xl font-black text-amber-700 mt-1">{(totalIncomeTax + totalPension7).toLocaleString()} ETB</div>
                  <div className="text-xs text-amber-600 mt-0.5">ERCA Tax: {totalIncomeTax.toLocaleString()} | Pen: {totalPension7.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-emerald-300 shadow-sm bg-gradient-to-br from-white to-emerald-50">
                  <div className="text-xs font-medium text-emerald-700 uppercase tracking-wider">Mindaa Qulqulluu Kaffalame</div>
                  <div className="text-xl font-black text-emerald-800 mt-1">{totalNet.toLocaleString()} ETB</div>
                  <div className="text-xs text-emerald-600 mt-0.5">Net Disbursed via CBE & Telebirr</div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                <div>
                  <h3 className="text-lg font-bold">Kaffaltii Mindaa Ji'aa Raawwadhu (Disburse Monthly Payroll)</h3>
                  <p className="text-xs text-emerald-200 mt-1">
                    Bara Barnootaa 2018 E.C. • Ji'a Sadaasaa 2018 (November 2026) • Hojjettoota qophaa'an hundaaf CBE fi Telebirr dhaan kaffali.
                  </p>
                </div>
                <div className="flex items-center space-x-3 shrink-0">
                  <button
                    onClick={handleRunMonthlyPayroll}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition flex items-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mindaa Ji'aa Kaffali (Run Payroll)</span>
                  </button>
                </div>
              </div>

              {/* Payroll Slips Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800">Tarree Kaffaltii Hojjettootaa (Staff Payroll Ledger)</h4>
                  <span className="text-xs text-slate-500">Ji'a: {payrollSlips[0]?.month || "2018 E.C."}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Hojjetaa / ID</th>
                        <th className="px-4 py-3">Gahee / Kutaa</th>
                        <th className="px-4 py-3 text-right">Bu'uura (ETB)</th>
                        <th className="px-4 py-3 text-right">Durgoo (ETB)</th>
                        <th className="px-4 py-3 text-right">Ida'ama (Gross)</th>
                        <th className="px-4 py-3 text-right">Sooroma (7%)</th>
                        <th className="px-4 py-3 text-right">Gibira (Tax)</th>
                        <th className="px-4 py-3 text-right font-bold text-emerald-800">Qulqulluu (Net)</th>
                        <th className="px-4 py-3 text-center">Karaa Kaffaltii</th>
                        <th className="px-4 py-3 text-center">Waraqaa Mindaa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payrollSlips.map((slip) => (
                        <tr key={slip.id} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900">{slip.employeeName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{slip.employeeId}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                              {slip.role}
                            </span>
                            <div className="text-[10px] text-slate-400">{slip.department}</div>
                          </td>
                          <td className="px-4 py-3 text-right font-medium">{slip.basicSalary.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right text-blue-700 font-medium">{slip.totalAllowances.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-800">{slip.grossSalary.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right text-amber-700">{slip.employeePension7Percent.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right text-red-600">{slip.incomeTaxDeduction.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-black text-emerald-700 text-sm">{slip.netSalary.toLocaleString()}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              slip.disbursementMethod === 'CBE' ? 'bg-purple-100 text-purple-800' :
                              slip.disbursementMethod === 'Telebirr' ? 'bg-blue-100 text-blue-800' :
                              'bg-emerald-100 text-emerald-800'
                            }`}>
                              {slip.disbursementMethod}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => setSelectedSlipForPrint(slip)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded font-semibold text-[11px] inline-flex items-center space-x-1 border border-slate-200 transition"
                            >
                              <Printer className="w-3 h-3" />
                              <span>Payslip</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EMPLOYEES DIRECTORY */}
          {activeTab === 'employees' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Barbaadi maqaa, ID, kutaa..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">Gahee Hundaa (All Roles)</option>
                    <option value="Teacher">Barsiisota (Teacher)</option>
                    <option value="Principal">Hoogganaa (Principal)</option>
                    <option value="Accountant">Herregaa (Accountant)</option>
                    <option value="School Nurse">Ogeessa Fayyaa (Nurse)</option>
                    <option value="Bus Driver">Konkolaachisaa (Driver)</option>
                    <option value="Security Officer">Eegumsa (Security)</option>
                  </select>
                </div>
              </div>

              {/* Employee Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map((emp) => {
                  const allowances = emp.housingAllowance + emp.transportAllowance + emp.positionAllowance + emp.overtimeOrBonus;
                  const gross = emp.basicSalary + allowances;
                  const tax = calculateEthiopianTax(gross, emp.basicSalary);
                  return (
                    <div key={emp.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-emerald-300 transition flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {emp.employeeId}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm mt-1">{emp.fullName}</h4>
                            <div className="text-xs text-emerald-700 font-medium">{emp.role} • {emp.department}</div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            emp.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {emp.status}
                          </span>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Bilbila</span>
                            <span className="font-medium text-slate-700">{emp.phone}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Baankii / Telebirr</span>
                            <span className="font-medium text-slate-700 truncate block">{emp.bankName.split(' ')[0]}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Lakk Herregaa</span>
                            <span className="font-mono text-slate-700 text-[11px] truncate block">{emp.bankAccountNumber}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Lakk TIN</span>
                            <span className="font-mono text-slate-700 text-[11px]">{emp.tinNumber || 'N/A'}</span>
                          </div>
                        </div>

                        <div className="mt-3 p-2.5 bg-slate-50 rounded-lg text-xs flex items-center justify-between">
                          <div>
                            <span className="text-slate-400 text-[10px] block">Mindaa Bu'uuraa</span>
                            <span className="font-bold text-slate-800">{emp.basicSalary.toLocaleString()} ETB</span>
                          </div>
                          <div className="text-right">
                            <span className="text-emerald-700 text-[10px] block font-medium">Qulqulluu (Net Pay)</span>
                            <span className="font-black text-emerald-800 text-sm">{tax.netPay.toLocaleString()} ETB</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditStaff(emp)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition"
                        >
                          Gulaali (Edit Salary)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SALARY & TAX REPORT */}
          {activeTab === 'report' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between pb-5 border-b border-slate-200 gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Gabaasa Waliigalaa Mindaa fi Gibira Oromiyaa (Tax & Pension Summary)</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Mana Barnootaa Chilimo Academy • Magaalaa Burayu • Labsii Sooromaa fi Gibira Mootummaa
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePrint}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Maxxansi (Print Report)</span>
                    </button>
                  </div>
                </div>

                {/* Summary Table */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h5 className="text-xs font-bold text-slate-600 uppercase">1. Baasii Hojjettootaa (Gross Payroll)</h5>
                    <div className="mt-3 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Mindaa Bu'uuraa:</span>
                        <span className="font-semibold">{totalBasic.toLocaleString()} ETB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Durgoo Manaa:</span>
                        <span className="font-semibold">{(totalAllowances * 0.55).toFixed(0)} ETB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Durgoo Geejjibaa & Gahee:</span>
                        <span className="font-semibold">{(totalAllowances * 0.45).toFixed(0)} ETB</span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                        <span>Ida'ama Baasii (Gross):</span>
                        <span>{totalGross.toLocaleString()} ETB</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h5 className="text-xs font-bold text-slate-600 uppercase">2. Hir'ifamoota Mootummaa (Statutory)</h5>
                    <div className="mt-3 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Gibira Galii (ERCA Income Tax):</span>
                        <span className="font-semibold text-red-600">{totalIncomeTax.toLocaleString()} ETB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sooroma Hojjetaa (7% Pension):</span>
                        <span className="font-semibold text-amber-700">{totalPension7.toLocaleString()} ETB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sooroma Hojjechiisaa (11% POESSA):</span>
                        <span className="font-semibold text-amber-700">{totalPension11.toLocaleString()} ETB</span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                        <span>Waliigala Gibira & Sooroma:</span>
                        <span>{(totalIncomeTax + totalPension7 + totalPension11).toLocaleString()} ETB</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <h5 className="text-xs font-bold text-emerald-800 uppercase">3. Kaffaltii Qulqulluu (Net Disbursed)</h5>
                    <div className="mt-3 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Karaa CBE (Bank):</span>
                        <span className="font-semibold text-slate-800">{(totalNet * 0.72).toFixed(0)} ETB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Karaa Telebirr:</span>
                        <span className="font-semibold text-slate-800">{(totalNet * 0.22).toFixed(0)} ETB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Karaa Kaashii:</span>
                        <span className="font-semibold text-slate-800">{(totalNet * 0.06).toFixed(0)} ETB</span>
                      </div>
                      <div className="pt-2 border-t border-emerald-200 flex justify-between font-black text-emerald-900 text-sm">
                        <span>Waliigala Qulqulluu:</span>
                        <span>{totalNet.toLocaleString()} ETB</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sign-off section */}
                <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
                  <div>
                    <div className="h-10 border-b border-slate-300 flex items-end justify-center pb-1 font-serif text-slate-600 italic">
                      Obbo Tolera Gemeda
                    </div>
                    <div className="mt-1 text-slate-500 font-medium">Qopheessaa (Accountant)</div>
                  </div>
                  <div>
                    <div className="h-10 border-b border-slate-300 flex items-end justify-center pb-1 font-serif text-slate-600 italic">
                      Obbo Geda Dadi
                    </div>
                    <div className="mt-1 text-slate-500 font-medium">Mirkaneessaa (Principal)</div>
                  </div>
                  <div>
                    <div className="h-10 border-b border-slate-300 flex items-end justify-center pb-1 text-slate-400">
                      Mallattoo & Chaappaa
                    </div>
                    <div className="mt-1 text-slate-500 font-medium">Chaappaa Mana Barumsaa</div>
                  </div>
                  <div>
                    <div className="h-10 border-b border-slate-300 flex items-end justify-center pb-1 text-slate-600 font-mono">
                      {new Date().toLocaleDateString()}
                    </div>
                    <div className="mt-1 text-slate-500 font-medium">Guyyaa Kaffaltii</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Chilimo Academy Burayu • Staff & Payroll Engine v2.0
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition"
          >
            Cufi (Close)
          </button>
        </div>

      </div>

      {/* MODAL 1: PAYSLIP VOUCHER MODAL */}
      {selectedSlipForPrint && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="px-6 py-4 bg-emerald-800 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-base">Waraqaa Kaffaltii Mindaa (Official Monthly Payslip)</h3>
              </div>
              <button onClick={() => setSelectedSlipForPrint(null)} className="text-emerald-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Body */}
            <div className="p-6 text-slate-800 text-xs space-y-4" id="printable-payslip">
              <div className="text-center border-b pb-3 border-slate-200">
                <h2 className="text-base font-black text-slate-900 tracking-wide uppercase">{CHILIMO_INFO.name}</h2>
                <p className="text-[11px] text-slate-500">{CHILIMO_INFO.location} • Bilbila: {CHILIMO_INFO.phone}</p>
                <div className="mt-1 inline-block px-3 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                  WARAQAA MINDAA (PAYSLIP) - {selectedSlipForPrint.month}
                </div>
              </div>

              {/* Employee Info Grid */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Maqaa Hojjetaa:</span>
                  <span className="font-bold text-slate-900 text-xs">{selectedSlipForPrint.employeeName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Lakk Eenyummaa (ID):</span>
                  <span className="font-mono font-bold text-slate-800">{selectedSlipForPrint.employeeId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Gahee Hojii & Kutaa:</span>
                  <span className="font-medium text-slate-800">{selectedSlipForPrint.role} • {selectedSlipForPrint.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Karaa Kaffaltii / Herrega:</span>
                  <span className="font-medium text-slate-800">{selectedSlipForPrint.disbursementMethod} - {selectedSlipForPrint.bankAccountOrTelebirr}</span>
                </div>
              </div>

              {/* Earnings vs Deductions Table */}
              <div className="grid grid-cols-2 gap-4">
                {/* Earnings */}
                <div className="border border-slate-200 rounded-lg p-3">
                  <h4 className="font-bold text-emerald-800 border-b border-slate-200 pb-1 mb-2 text-[11px]">Galiiwwan (Earnings)</h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Mindaa Bu'uuraa:</span>
                      <span className="font-medium">{selectedSlipForPrint.basicSalary.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Durgoowwan Waliigala:</span>
                      <span className="font-medium">{selectedSlipForPrint.totalAllowances.toLocaleString()} ETB</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                      <span>Ida'ama (Gross):</span>
                      <span>{selectedSlipForPrint.grossSalary.toLocaleString()} ETB</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="border border-slate-200 rounded-lg p-3">
                  <h4 className="font-bold text-red-700 border-b border-slate-200 pb-1 mb-2 text-[11px]">Hir'ifamoota (Deductions)</h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Sooroma Hojjetaa (7%):</span>
                      <span className="font-medium text-amber-700">{selectedSlipForPrint.employeePension7Percent.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Gibira Galii (Income Tax):</span>
                      <span className="font-medium text-red-600">{selectedSlipForPrint.incomeTaxDeduction.toLocaleString()} ETB</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                      <span>Ida'ama Hir'ifame:</span>
                      <span>{(selectedSlipForPrint.employeePension7Percent + selectedSlipForPrint.incomeTaxDeduction).toLocaleString()} ETB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Pay Callout */}
              <div className="bg-emerald-50 border-2 border-emerald-400 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-emerald-800 font-bold block text-xs">Mindaa Qulqulluu Kaffalame (Net Salary Payable):</span>
                  <span className="text-[10px] text-emerald-600">Ref: {selectedSlipForPrint.paymentRef}</span>
                </div>
                <div className="text-xl font-black text-emerald-900">
                  {selectedSlipForPrint.netSalary.toLocaleString()} ETB
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-3 gap-3 text-center text-[10px]">
                <div>
                  <div className="h-8 border-b border-slate-300 italic font-serif flex items-end justify-center pb-0.5">
                    {selectedSlipForPrint.preparedBy}
                  </div>
                  <div className="mt-1 text-slate-500">Qopheessaa (Finance)</div>
                </div>
                <div>
                  <div className="h-8 border-b border-slate-300 italic font-serif flex items-end justify-center pb-0.5">
                    {selectedSlipForPrint.approvedBy}
                  </div>
                  <div className="mt-1 text-slate-500">Mirkaneessaa (Principal)</div>
                </div>
                <div>
                  <div className="h-8 border-b border-slate-300 italic font-serif flex items-end justify-center pb-0.5">
                    Mallattoo Hojjetaa
                  </div>
                  <div className="mt-1 text-slate-500">Fudhataa (Employee)</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedSlipForPrint(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 font-medium hover:text-slate-900"
              >
                Cufi
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Maxxansi (Print Slip)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT STAFF MODAL */}
      {isEditingStaff && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {staffForm.id ? "Odeeffannoo Hojjetaa Gulaali" : "Hojjetaa Haaraa Galmeessi (New Staff)"}
              </h3>
              <button onClick={() => setIsEditingStaff(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="p-6 text-xs space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Maqaa Guutuu *</label>
                  <input
                    type="text"
                    required
                    value={staffForm.fullName || ''}
                    onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="Fkn. Barsiisaa Chala"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Saala</label>
                  <select
                    value={staffForm.gender || 'Male'}
                    onChange={(e) => setStaffForm({ ...staffForm, gender: e.target.value as 'Male' | 'Female' })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Male">Dhiira (Male)</option>
                    <option value="Female">Dubara (Female)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Gahee Hojii (Role) *</label>
                  <select
                    value={staffForm.role || 'Teacher'}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Teacher">Teacher (Barsiisaa)</option>
                    <option value="Principal">Principal (Hoogganaa)</option>
                    <option value="Accountant">Accountant (Herregaa)</option>
                    <option value="ICT Specialist">ICT Specialist</option>
                    <option value="School Nurse">School Nurse (Ogeessa Fayyaa)</option>
                    <option value="Bus Driver">Bus Driver (Konkolaachisaa)</option>
                    <option value="Security Officer">Security Officer (Eegumsa)</option>
                    <option value="Cleaner">Cleaner (Qulqullina)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Kutaa / Waajjira (Department)</label>
                  <input
                    type="text"
                    value={staffForm.department || ''}
                    onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="Fkn. Science, Primary, Admin"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Lakk Bilbilaa *</label>
                  <input
                    type="text"
                    required
                    value={staffForm.phone || ''}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="09..."
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Lakk TIN (Koodii Gibiraa)</label>
                  <input
                    type="text"
                    value={staffForm.tinNumber || ''}
                    onChange={(e) => setStaffForm({ ...staffForm, tinNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                    placeholder="0038472910"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Baankii Kaffaltii</label>
                  <select
                    value={staffForm.bankName || 'Commercial Bank of Ethiopia (CBE)'}
                    onChange={(e) => setStaffForm({ ...staffForm, bankName: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Commercial Bank of Ethiopia (CBE)">Commercial Bank of Ethiopia (CBE)</option>
                    <option value="Telebirr">Telebirr Wallet</option>
                    <option value="Awash Bank">Awash Bank</option>
                    <option value="Cooperative Bank of Oromia">Cooperative Bank of Oromia</option>
                    <option value="Cash">Cash (Waajjira Kaffaltii)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Lakk Herrega Baankii / Telebirr</label>
                  <input
                    type="text"
                    value={staffForm.bankAccountNumber || ''}
                    onChange={(e) => setStaffForm({ ...staffForm, bankAccountNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                    placeholder="1000..."
                  />
                </div>
              </div>

              {/* Salary Breakdown Box */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h5 className="font-bold text-slate-800">Qindaa'ina Mindaa (Salary Structure ETB)</h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-slate-500 text-[10px]">Mindaa Bu'uuraa *</label>
                    <input
                      type="number"
                      required
                      value={staffForm.basicSalary || 0}
                      onChange={(e) => setStaffForm({ ...staffForm, basicSalary: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border rounded focus:ring-2 focus:ring-emerald-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px]">Durgoo Manaa</label>
                    <input
                      type="number"
                      value={staffForm.housingAllowance || 0}
                      onChange={(e) => setStaffForm({ ...staffForm, housingAllowance: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border rounded focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px]">Geejjiba</label>
                    <input
                      type="number"
                      value={staffForm.transportAllowance || 0}
                      onChange={(e) => setStaffForm({ ...staffForm, transportAllowance: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border rounded focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px]">Gahee/Boonaasii</label>
                    <input
                      type="number"
                      value={staffForm.positionAllowance || 0}
                      onChange={(e) => setStaffForm({ ...staffForm, positionAllowance: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border rounded focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditingStaff(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold"
                >
                  Dhiisi (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold"
                >
                  Olkaa'i (Save Staff)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
