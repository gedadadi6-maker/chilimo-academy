import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  CheckCircle2, 
  Printer, 
  Upload, 
  Calendar, 
  FileText, 
  Bus, 
  ShieldCheck, 
  Save, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  HeartPulse, 
  Check, 
  RefreshCw,
  Search,
  Eye,
  Landmark,
  Plus,
  Copy
} from 'lucide-react';
import { Language, EnterpriseAdmissionFormData, UserAccount, PaymentMethodEAV } from '../types';
import { 
  CHILIMO_INFO, 
  getStoredEnterpriseAdmissions, 
  saveEnterpriseAdmission,
  getStoredUsers,
  saveAllUsers,
  getStoredPayments,
  saveAllPayments,
  compressImageToDataUrl,
  getStoredAdmissionFeeSettings,
  getSchoolLogoUrl
} from '../data/mockData';

interface EnterpriseAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  currentAdmin: UserAccount;
}

export const EnterpriseAdmissionModal: React.FC<EnterpriseAdmissionModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  currentAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'directory'>('form');
  const [admissions, setAdmissions] = useState<EnterpriseAdmissionFormData[]>(() => getStoredEnterpriseAdmissions());
  const [selectedAdmissionForPrint, setSelectedAdmissionForPrint] = useState<EnterpriseAdmissionFormData | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  const [bankAccounts, setBankAccounts] = useState<PaymentMethodEAV[]>(() => getStoredPayments());
  const [showAddBankForm, setShowAddBankForm] = useState<boolean>(false);
  const [newBankProvider, setNewBankProvider] = useState<string>('Commercial Bank of Ethiopia (CBE)');
  const [newBankAccountNumber, setNewBankAccountNumber] = useState<string>('');
  const [newBankAccountName, setNewBankAccountName] = useState<string>('Chilimo Academy Burayu');
  const [newBankShortCode, setNewBankShortCode] = useState<string>('Mobile Banking / Branch');
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);

  const initialDefaultBank = bankAccounts.find(b => b.active) || bankAccounts[0];

  // Form State matching fd.jpg
  const [formData, setFormData] = useState<EnterpriseAdmissionFormData>({
    admissionNo: `ADM-26-${Math.floor(1000 + Math.random() * 9000)}`,
    admissionFormNo: `R-0154-202-${Math.floor(2020 + Math.random() * 8)}`,
    registrationNo: `REG-2026-BUR-${Math.floor(100 + Math.random() * 900)}`,
    academicSession: '2018 E.C. (2025/2026)',
    fullName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '2015-01-01',
    gender: 'Male',
    bloodGroup: 'Select',
    nationalIdAadhaar: '',
    pinCode: '1000',
    photoUrl: '/assets/aistudio/Chilimo_Academy_Crest_Emblem__1__1e3fdd6e.png',
    classApplied: 'Grade 7',
    section: 'A',
    status: 'Active',
    admissionDate: new Date().toISOString().split('T')[0],
    category: 'Regular',
    religion: 'Protestant',
    nationality: 'Ethiopian',
    mediumOfInstruction: 'Afaan Oromoo',
    fatherOccupation: '',
    motherOccupation: '',
    previousSchool: '',
    lastClassStudied: '',
    transferCertificateNo: '',
    mobileNo: '09',
    alternateMobileNo: '',
    email: '',
    residentialAddress: 'Burayu Town, Kebele ',
    district: 'Burayu Town Administration',
    stateRegion: 'Oromia',
    transportServiceEnabled: false,
    transportRouteId: 'BUS-01',
    transportFeeAmount: 450,
    registrationBankId: initialDefaultBank?.id || '',
    registrationBankProvider: initialDefaultBank?.provider || '',
    registrationBankAccount: initialDefaultBank?.accountNumber || '',
    registrationFeeAmount: 500,
    registrationPaymentRef: ''
  });

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleInputChange = (field: keyof EnterpriseAdmissionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectBankForAdmission = (bank: PaymentMethodEAV) => {
    setFormData(prev => ({
      ...prev,
      registrationBankId: bank.id,
      registrationBankProvider: bank.provider,
      registrationBankAccount: bank.accountNumber
    }));
  };

  const handleSaveNewBankDuringAdmission = () => {
    if (!newBankProvider.trim() || !newBankAccountNumber.trim()) return;
    const newBank: PaymentMethodEAV = {
      id: `PAY-${Math.floor(100 + Math.random() * 900)}`,
      provider: newBankProvider.trim(),
      accountNumber: newBankAccountNumber.trim(),
      accountName: newBankAccountName.trim() || 'Chilimo Academy Burayu',
      qrCodeOrShortCode: newBankShortCode.trim() || 'Bank Transfer',
      active: true,
      instructions: `Pay registration/tuition to ${newBankProvider.trim()} (${newBankAccountNumber.trim()}) and quote Student ID.`
    };
    const updatedBanks = [...bankAccounts, newBank];
    setBankAccounts(updatedBanks);
    saveAllPayments(updatedBanks);
    handleSelectBankForAdmission(newBank);
    setNewBankAccountNumber('');
    setShowAddBankForm(false);
    showToast(`Lakkoofsi baankii haaraan (${newBank.provider}: ${newBank.accountNumber}) galmaa'eera!`);
  };

  const handleGradeChangeWithFee = (grade: string) => {
    const settings = getStoredAdmissionFeeSettings();
    const matchedFee = settings.gradeFees.find(
      g => g.gradeLevel.toLowerCase() === grade.toLowerCase()
    );
    setFormData(prev => ({
      ...prev,
      classApplied: grade,
      registrationFeeAmount: matchedFee?.registrationFee ?? prev.registrationFeeAmount,
      transportFeeAmount: matchedFee?.busFee ?? prev.transportFeeAmount
    }));
  };

  const handleStudentPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageToDataUrl(file, 420, 0.85);
      handleInputChange('photoUrl', compressed);
      showToast('Suuraan barataa/ttuu olkaa\'ameera!');
    } catch {
      showToast('Suuraa dubbisuun hin danda\'amne.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.mobileNo) return;

    saveEnterpriseAdmission(formData);
    const updated = getStoredEnterpriseAdmissions();
    setAdmissions(updated);

    // Also register user into the system so they can log in
    const users = getStoredUsers();
    const newStudentId = `STU-${Math.floor(200 + Math.random() * 800)}`;
    const newStudentAccount: UserAccount = {
      id: newStudentId,
      systemId: `CHA-${formData.admissionNo}`,
      name: formData.fullName,
      email: formData.email || `${formData.fullName.toLowerCase().replace(/\s+/g, '.')}@chilimo.edu.et`,
      role: 'student',
      status: 'active',
      dateCreated: new Date().toISOString().split('T')[0],
      departmentOrGrade: `${formData.classApplied} - Section ${formData.section}`,
      password: '123',
      phone: formData.mobileNo,
      busIdAssigned: formData.transportServiceEnabled ? formData.transportRouteId : undefined,
      photoUrl: formData.photoUrl
    };
    users.push(newStudentAccount);
    saveAllUsers(users);

    showToast(`Barataa/ttuu ${formData.fullName} milkaa'inaan galmaa'eera! (Admission dossier registered!)`);
    setSelectedAdmissionForPrint(formData);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredAdmissions = admissions.filter(a => 
    a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.mobileNo.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header - Styled like Enterprise ERP in fd.jpg */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600 rounded-xl">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold tracking-tight">Galmee Barataa Haaraa (New Admission Dossier)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {formData.academicSession}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Data Click IT Hub ERP Standard • Chilimo Academy, Burayu
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-sm font-medium flex items-center justify-between shadow-inner">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="text-emerald-200 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
                activeTab === 'form'
                  ? 'bg-white text-blue-900 border-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 border-transparent'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Unka Galmee Haaraa (Admission Form)</span>
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
                activeTab === 'directory'
                  ? 'bg-white text-blue-900 border-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 border-transparent'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Galmee Barattoota Galmaa'anii (Registered Dossiers)</span>
              <span className="px-1.5 py-0.2 rounded-full text-xs bg-slate-200 text-slate-700">{admissions.length}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 pb-2 text-xs text-slate-500 font-mono">
            Admission No: <span className="font-bold text-slate-900">{formData.admissionNo}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {/* TAB 1: FORM (Matching fd.jpg layout) */}
          {activeTab === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
              
              {/* Top Reference Numbers */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Admission No *</label>
                  <input
                    type="text"
                    required
                    value={formData.admissionNo}
                    onChange={(e) => handleInputChange('admissionNo', e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg text-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Admission Form No (Opt.)</label>
                  <input
                    type="text"
                    value={formData.admissionFormNo}
                    onChange={(e) => handleInputChange('admissionFormNo', e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg"
                    placeholder="e.g. R-0154-202-2021"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Registration No</label>
                  <input
                    type="text"
                    value={formData.registrationNo}
                    onChange={(e) => handleInputChange('registrationNo', e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg"
                    placeholder="Press enter to auto-fill"
                  />
                </div>
              </div>

              {/* 1. Basic Information Card */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
                  <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Basic Information</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <img
                      src={formData.photoUrl || getSchoolLogoUrl()}
                      alt="Student Portrait"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-300 bg-white shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <label className="block text-xs font-bold text-slate-800">
                        Suuraa Barataa/ttuu Upload Godhi (Student Passport Photo)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleStudentPhotoUpload}
                        className="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#0f1e36] file:text-white hover:file:bg-[#1a3156] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name (Barataa/ttuu) *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter full name (Fkn. Biqila Tolera Gemeda)"
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Father's Name (Maqaa Abbaa)</label>
                      <input
                        type="text"
                        value={formData.fatherName}
                        onChange={(e) => handleInputChange('fatherName', e.target.value)}
                        placeholder="Father's name"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mother's Name (Maqaa Haadhaa)</label>
                      <input
                        type="text"
                        value={formData.motherName}
                        onChange={(e) => handleInputChange('motherName', e.target.value)}
                        placeholder="Mother's name"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value as any)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="Male">Dhiira (Male)</option>
                        <option value="Female">Dubara (Female)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) => handleInputChange('bloodGroup', e.target.value as any)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="Select">Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">National ID / Fayda No</label>
                      <input
                        type="text"
                        value={formData.nationalIdAadhaar}
                        onChange={(e) => handleInputChange('nationalIdAadhaar', e.target.value)}
                        placeholder="e.g. ETH-1234567890"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">PIN / Postal Code (Optional)</label>
                      <input
                        type="text"
                        value={formData.pinCode}
                        onChange={(e) => handleInputChange('pinCode', e.target.value)}
                        placeholder="Pincode / PIN Box"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Photo & Signature (Max 200KB)</label>
                      <div className="border border-dashed border-slate-300 rounded-lg p-2.5 flex items-center justify-between text-xs text-slate-500 bg-slate-50">
                        <span className="truncate">Chilimo_Crest_Emblem.png</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">Attached</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Class & Admission */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
                  <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Class & Admission</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Class *</label>
                    <select
                      value={formData.classApplied}
                      onChange={(e) => handleGradeChangeWithFee(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="KG 1">KG 1</option>
                      <option value="KG 2">KG 2</option>
                      <option value="KG 3">KG 3</option>
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 2">Grade 2</option>
                      <option value="Grade 3">Grade 3</option>
                      <option value="Grade 4">Grade 4</option>
                      <option value="Grade 5">Grade 5</option>
                      <option value="Grade 6">Grade 6</option>
                      <option value="Grade 7">Grade 7</option>
                      <option value="Grade 8">Grade 8</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Section</label>
                    <select
                      value={formData.section}
                      onChange={(e) => handleInputChange('section', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white font-bold text-emerald-700"
                    >
                      <option value="Active">Active</option>
                      <option value="Provisional">Provisional</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Admission Date</label>
                    <input
                      type="date"
                      value={formData.admissionDate}
                      onChange={(e) => handleInputChange('admissionDate', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Regular">Regular</option>
                      <option value="Scholarship">Scholarship (Iskoolaarshippii)</option>
                      <option value="Staff Child">Staff Child</option>
                      <option value="Orphan Support">Orphan Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Religion</label>
                    <select
                      value={formData.religion}
                      onChange={(e) => handleInputChange('religion', e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Protestant">Protestant</option>
                      <option value="Orthodox">Orthodox</option>
                      <option value="Muslim">Muslim</option>
                      <option value="Waaqeffanna">Waaqeffanna</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nationality</label>
                    <input
                      type="text"
                      value={formData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Other Details (Optional) */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
                  <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Other Details (Optional)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Medium of Instruction</label>
                    <select
                      value={formData.mediumOfInstruction}
                      onChange={(e) => handleInputChange('mediumOfInstruction', e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Afaan Oromoo">Afaan Oromoo</option>
                      <option value="English">English</option>
                      <option value="Amharic">Amharic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Father's Occupation</label>
                    <input
                      type="text"
                      value={formData.fatherOccupation}
                      onChange={(e) => handleInputChange('fatherOccupation', e.target.value)}
                      placeholder="e.g. Farmer / Business / Civil Servant"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Previous School</label>
                    <input
                      type="text"
                      value={formData.previousSchool}
                      onChange={(e) => handleInputChange('previousSchool', e.target.value)}
                      placeholder="Name of last school"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Last Class Studied</label>
                    <input
                      type="text"
                      value={formData.lastClassStudied}
                      onChange={(e) => handleInputChange('lastClassStudied', e.target.value)}
                      placeholder="e.g. Grade 6"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Transfer Certificate No (Waraqaa Dabarsaa)</label>
                    <input
                      type="text"
                      value={formData.transferCertificateNo}
                      onChange={(e) => handleInputChange('transferCertificateNo', e.target.value)}
                      placeholder="TC / TO Number"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Contact Details */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
                  <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                    <Phone className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Contact Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile No *</label>
                    <input
                      type="text"
                      required
                      value={formData.mobileNo}
                      onChange={(e) => handleInputChange('mobileNo', e.target.value)}
                      placeholder="+251-09..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Alternate Mobile No</label>
                    <input
                      type="text"
                      value={formData.alternateMobileNo}
                      onChange={(e) => handleInputChange('alternateMobileNo', e.target.value)}
                      placeholder="Alternate number"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Residential Address</label>
                    <input
                      type="text"
                      value={formData.residentialAddress}
                      onChange={(e) => handleInputChange('residentialAddress', e.target.value)}
                      placeholder="Full residential address (Burayu, Kebele...)"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">District / State</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={formData.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        placeholder="District"
                        className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={formData.stateRegion}
                        onChange={(e) => handleInputChange('stateRegion', e.target.value)}
                        placeholder="State"
                        className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Transport Fee Option */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
                  <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                    <Bus className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Transport Fee (Geejjiba Konkolaataa)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Transport Fee Amount (ETB / Month)</label>
                    <input
                      type="number"
                      value={formData.transportFeeAmount}
                      onChange={(e) => handleInputChange('transportFeeAmount', Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="pt-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.transportServiceEnabled}
                        onChange={(e) => handleInputChange('transportServiceEnabled', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-xs font-medium text-slate-700">
                        I want to add transport fee to student (Geejjiba konkolaataa barbaada)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 6. School Bank Accounts & Registration Fee Payment */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        Lakkoofsa Baankii & Kaffaltii Galmee (School Bank Accounts & Registration Fee)
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Admin lakkoofsa baankii filachuu ykn lakkoofsa baankii haaraa yeroo galmee kana irratti kaa&apos;uu danda&apos;a.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddBankForm(v => !v)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddBankForm ? 'Cufi (Close)' : 'Lakkoofsa Baankii Haaraa Kaa\'i (Add Bank)'}</span>
                  </button>
                </div>

                {/* Inline Add School Bank Account Box */}
                {showAddBankForm && (
                  <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-3">
                    <div className="text-xs font-bold text-indigo-950">
                      Lakkoofsa Baankii Haaraa Dabalii (Set New School Bank Account)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Baankii / Provider *
                        </label>
                        <select
                          value={newBankProvider}
                          onChange={(e) => setNewBankProvider(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                        >
                          <option value="Commercial Bank of Ethiopia (CBE)">Commercial Bank of Ethiopia (CBE)</option>
                          <option value="Cooperative Bank of Oromia (COOP)">Cooperative Bank of Oromia (COOP)</option>
                          <option value="Awash Bank">Awash Bank</option>
                          <option value="Oromia Bank">Oromia Bank</option>
                          <option value="Bank of Abyssinia">Bank of Abyssinia</option>
                          <option value="Dashen Bank">Dashen Bank</option>
                          <option value="Telebirr">Telebirr</option>
                          <option value="CBE Birr">CBE Birr</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Maqaa Baankii (Yoo barbaachise edit godhaa)
                        </label>
                        <input
                          type="text"
                          value={newBankProvider}
                          onChange={(e) => setNewBankProvider(e.target.value)}
                          placeholder="Bank Name"
                          className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Lakkoofsa Herrega Baankii (Account Number) *
                        </label>
                        <input
                          type="text"
                          value={newBankAccountNumber}
                          onChange={(e) => setNewBankAccountNumber(e.target.value)}
                          placeholder="e.g. 1000456789123 or 0912305111"
                          className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Maqaa Abbaa Herregaa (Account Holder Name)
                        </label>
                        <input
                          type="text"
                          value={newBankAccountName}
                          onChange={(e) => setNewBankAccountName(e.target.value)}
                          placeholder="Chilimo Academy Burayu"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <input
                        type="text"
                        value={newBankShortCode}
                        onChange={(e) => setNewBankShortCode(e.target.value)}
                        placeholder="Branch / USSD Shortcode (e.g. *847#)"
                        className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleSaveNewBankDuringAdmission}
                        disabled={!newBankProvider.trim() || !newBankAccountNumber.trim()}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Lakkoofsa Baankii Olkaa&apos;i</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Existing Configured School Bank Accounts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {bankAccounts.filter(b => b.active).map((bank) => {
                    const isSelected = formData.registrationBankId === bank.id || formData.registrationBankAccount === bank.accountNumber;
                    return (
                      <div
                        key={bank.id}
                        onClick={() => handleSelectBankForAdmission(bank)}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between gap-2 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                            <span className="font-bold text-xs text-slate-900 truncate">{bank.provider}</span>
                          </div>
                          <div className="font-mono font-black text-indigo-900 text-sm mt-1 select-all">
                            {bank.accountNumber}
                          </div>
                          <div className="text-[10px] text-slate-600 truncate">{bank.accountName}</div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(bank.accountNumber);
                            setCopiedBankId(bank.id);
                            setTimeout(() => setCopiedBankId(null), 1500);
                          }}
                          className="shrink-0 px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[10px] font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedBankId === bank.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedBankId === bank.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Registration Fee Amount & Bank Reference */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kaffaltii Galmee (Registration Fee Amount - ETB)
                    </label>
                    <input
                      type="number"
                      value={formData.registrationFeeAmount ?? 500}
                      onChange={(e) => handleInputChange('registrationFeeAmount', Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Receipt / Bank Reference No. (Nagahee Baankii)
                    </label>
                    <input
                      type="text"
                      value={formData.registrationPaymentRef || ''}
                      onChange={(e) => handleInputChange('registrationPaymentRef', e.target.value)}
                      placeholder="e.g. FT26109ABC or TLB-99401"
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition"
                >
                  Dhiisi (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Galmeessi & Dossier Baasi (Submit Admission)</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 2: REGISTERED ADMISSIONS DIRECTORY */}
          {activeTab === 'directory' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Barbaadi maqaa, Admission No, Bilbila..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="text-xs text-slate-500">
                  Waliigala Barattoota Galmaa'an: <span className="font-bold text-slate-800">{admissions.length}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAdmissions.map((adm) => (
                  <div key={adm.admissionNo} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {adm.admissionNo} • {adm.academicSession}
                          </span>
                          <h4 className="font-bold text-slate-900 text-base mt-1.5">{adm.fullName}</h4>
                          <div className="text-xs text-slate-600 font-medium">
                            {adm.classApplied} (Section {adm.section}) • Status: <span className="text-emerald-700 font-bold">{adm.status}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {adm.category}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Maqaa Abbaa / Haadhaa:</span>
                          <span className="font-medium text-slate-800">{adm.fatherName || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Dhiiga / Saala:</span>
                          <span className="font-medium text-slate-800">{adm.bloodGroup} • {adm.gender}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Bilbila Maatii:</span>
                          <span className="font-mono text-blue-700 font-semibold">{adm.mobileNo}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Teessoo:</span>
                          <span className="font-medium text-slate-700 truncate block">{adm.residentialAddress}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Guyyaa: {adm.admissionDate}</span>
                      <button
                        onClick={() => setSelectedAdmissionForPrint(adm)}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Dossier Baasi (View Card)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>Chilimo Academy Burayu • Enterprise Admission Registry</div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition"
          >
            Cufi (Close)
          </button>
        </div>

      </div>

      {/* MODAL: OFFICIAL ADMISSION DOSSIER CARD */}
      {selectedAdmissionForPrint && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-xs">Official Student Admission Dossier</h3>
              <button onClick={() => setSelectedAdmissionForPrint(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-slate-800 text-xs space-y-4" id="printable-admission-dossier">
              <div className="text-center border-b pb-3 border-slate-200 flex items-center justify-between">
                <div className="text-left">
                  <h2 className="text-base font-black text-slate-900 tracking-wide uppercase">{CHILIMO_INFO.name}</h2>
                  <p className="text-[11px] text-slate-500">Mootummaa Naannoo Oromiyaa • Magaalaa Burayu</p>
                  <p className="text-[10px] text-slate-400">Bilbila: {CHILIMO_INFO.phone} • {CHILIMO_INFO.email}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-1 rounded block border">
                    {selectedAdmissionForPrint.admissionNo}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Session: {selectedAdmissionForPrint.academicSession}</span>
                </div>
              </div>

              {/* Student Summary Banner */}
              <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={selectedAdmissionForPrint.photoUrl || getSchoolLogoUrl()}
                    alt={selectedAdmissionForPrint.fullName}
                    className="w-16 h-16 rounded-xl object-cover border border-blue-200 bg-white shrink-0"
                  />
                  <div>
                    <span className="text-[10px] text-blue-700 block uppercase font-bold">Maqaa Guutuu Barataa/ttuu</span>
                    <div className="text-base font-black text-slate-900">{selectedAdmissionForPrint.fullName}</div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Kutaa: <span className="font-bold">{selectedAdmissionForPrint.classApplied}</span> (Section {selectedAdmissionForPrint.section}) • Saala: {selectedAdmissionForPrint.gender}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block">Dhiiga (Blood Group)</span>
                  <div className="text-base font-bold text-rose-700">{selectedAdmissionForPrint.bloodGroup}</div>
                  <span className="text-[10px] text-slate-400">D.O.B: {selectedAdmissionForPrint.dateOfBirth}</span>
                </div>
              </div>

              {/* Family & Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg p-3 space-y-1.5">
                  <h5 className="font-bold text-slate-800 text-[11px] border-b pb-1">Odeeffannoo Maatii</h5>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Abbaa:</span>
                    <span className="font-semibold">{selectedAdmissionForPrint.fatherName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Haadha:</span>
                    <span className="font-semibold">{selectedAdmissionForPrint.motherName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hojii Abbaa:</span>
                    <span>{selectedAdmissionForPrint.fatherOccupation || 'N/A'}</span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-3 space-y-1.5">
                  <h5 className="font-bold text-slate-800 text-[11px] border-b pb-1">Quunnamtii & Teessoo</h5>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bilbila:</span>
                    <span className="font-mono font-bold text-blue-700">{selectedAdmissionForPrint.mobileNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Teessoo:</span>
                    <span className="truncate">{selectedAdmissionForPrint.residentialAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Magaalaa/Naannoo:</span>
                    <span>{selectedAdmissionForPrint.district}, {selectedAdmissionForPrint.stateRegion}</span>
                  </div>
                </div>
              </div>

              {/* Academic & Transport */}
              <div className="grid grid-cols-2 gap-4 text-[11px]">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Afaan Barnootaa & Amantii:</span>
                  <span className="font-semibold text-slate-800">{selectedAdmissionForPrint.mediumOfInstruction} • {selectedAdmissionForPrint.religion}</span>
                  <span className="text-slate-400 block text-[10px] mt-1">Mana Barumsaa Duraanii:</span>
                  <span className="font-medium text-slate-800">{selectedAdmissionForPrint.previousSchool || 'Burayu Primary'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Tajaajila Geejjibaa (Bus):</span>
                  <span className="font-semibold text-slate-800">
                    {selectedAdmissionForPrint.transportServiceEnabled ? `Eeyyee (${selectedAdmissionForPrint.transportFeeAmount} ETB/ji'a)` : 'Hin barbaadu (Walking)'}
                  </span>
                  <span className="text-slate-400 block text-[10px] mt-1">Lakk Eenyummaa Fayda/Kebele:</span>
                  <span className="font-mono text-slate-700">{selectedAdmissionForPrint.nationalIdAadhaar || 'N/A'}</span>
                </div>
              </div>

              {selectedAdmissionForPrint.registrationBankAccount && (
                <div className="p-3 bg-indigo-50/70 rounded-lg border border-indigo-200 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div>
                    <span className="text-indigo-700 font-bold block text-[10px]">
                      Baankii Kaffaltii Galmee (Registration Bank Account)
                    </span>
                    <span className="font-bold text-slate-900">
                      {selectedAdmissionForPrint.registrationBankProvider}
                    </span>{' '}
                    • <span className="font-mono font-black text-indigo-900">{selectedAdmissionForPrint.registrationBankAccount}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-slate-800">{selectedAdmissionForPrint.registrationFeeAmount || 500} ETB</span>
                    {selectedAdmissionForPrint.registrationPaymentRef && (
                      <span className="block text-[10px] text-slate-600">Ref: {selectedAdmissionForPrint.registrationPaymentRef}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Signatures */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-3 gap-3 text-center text-[10px]">
                <div>
                  <div className="h-8 border-b border-slate-300 italic flex items-end justify-center pb-0.5">
                    Mallattoo Maatii
                  </div>
                  <div className="mt-1 text-slate-500">Maatii Barataa (Parent)</div>
                </div>
                <div>
                  <div className="h-8 border-b border-slate-300 italic flex items-end justify-center pb-0.5">
                    Obbo Geda Dadi
                  </div>
                  <div className="mt-1 text-slate-500">Daarektara (Principal)</div>
                </div>
                <div>
                  <div className="h-8 border-b border-slate-300 italic flex items-end justify-center pb-0.5">
                    Chaappaa Mana Barumsaa
                  </div>
                  <div className="mt-1 text-slate-500">Ofiisii Galmee (Registrar)</div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedAdmissionForPrint(null)}
                className="px-4 py-1.5 text-xs text-slate-600 font-medium"
              >
                Cufi
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Maxxansi (Print Dossier)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
