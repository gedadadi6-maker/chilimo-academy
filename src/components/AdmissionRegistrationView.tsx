import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  Copy, 
  Check, 
  Search, 
  Bus, 
  Landmark,
  Lock,
  Upload,
  FileText,
  X
} from 'lucide-react';
import { Language, ApplicationRecord, PaymentMethodEAV, AdmissionFeeSettings, PaymentInfoSettings } from '../types';
import { translations } from '../translations';
import {
  submitGuestApplication,
  CHILIMO_INFO,
  getStoredPayments,
  getStoredAdmissionFeeSettings,
  getStoredPaymentInfoSettings,
  getSchoolLogoUrl
} from '../data/mockData';
import { readAndCompressUpload } from '../utils/imageUpload';
import { submitPublicApplicationToCloud } from '../lib/backupAndSync';

interface AdmissionRegistrationViewProps {
  currentLang: Language;
  onBack: () => void;
  onSuccess: (code: string) => void;
}

export const AdmissionRegistrationView: React.FC<AdmissionRegistrationViewProps> = ({
  currentLang,
  onBack,
  onSuccess
}) => {
  const t = translations[currentLang];
  const [activeBanks, setActiveBanks] = useState<PaymentMethodEAV[]>(() => getStoredPayments().filter(p => p.active));
  const [admissionSettings, setAdmissionSettings] = useState<AdmissionFeeSettings>(getStoredAdmissionFeeSettings);
  const [paymentInfoSettings, setPaymentInfoSettings] = useState<PaymentInfoSettings>(getStoredPaymentInfoSettings);

  useEffect(() => {
    const sync = () => {
      setActiveBanks(getStoredPayments().filter(p => p.active));
      setAdmissionSettings(getStoredAdmissionFeeSettings());
      setPaymentInfoSettings(getStoredPaymentInfoSettings());
    };
    window.addEventListener('chilimo:data-updated', sync);
    return () => window.removeEventListener('chilimo:data-updated', sync);
  }, []);

  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('0912305111');
  const [email, setEmail] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Grade 1');
  const [birthDate, setBirthDate] = useState('2019-06-12');
  const [address, setAddress] = useState('Burayu, Oromia');
  const [needBus, setNeedBus] = useState('yes');
  const [busRoutePref, setBusRoutePref] = useState('Burayu Gefersa Line');
  const [selectedBankProvider, setSelectedBankProvider] = useState<string>(activeBanks[0]?.provider || '');
  const [regFeeRef, setRegFeeRef] = useState('');
  const [docDataUrl, setDocDataUrl] = useState('');
  const [docFileName, setDocFileName] = useState('');
  const [receiptDataUrl, setReceiptDataUrl] = useState('');
  const [receiptFileName, setReceiptFileName] = useState('');
  const [uploadError, setUploadError] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedRecord, setGeneratedRecord] = useState<ApplicationRecord | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'doc' | 'receipt'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    try {
      const res = await readAndCompressUpload(file);
      if (target === 'doc') {
        setDocDataUrl(res.dataUrl);
        setDocFileName(res.fileName);
      } else {
        setReceiptDataUrl(res.dataUrl);
        setReceiptFileName(res.fileName);
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Upload failed.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !phone) return;

    const bankDetail = regFeeRef.trim()
      ? ` Fee Bank: ${selectedBankProvider || 'N/A'} (Ref: ${regFeeRef.trim()}).`
      : '';
    const detailsText = `Parent: ${parentName}. DOB: ${birthDate}. Address: ${address}. Bus Transport: ${needBus === 'yes' ? busRoutePref : 'No'}.${bankDetail}`;

    const newRecord = submitGuestApplication({
      fullName: studentName,
      email: email || `${studentName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: phone,
      applicantType: 'student',
      gradeOrSubject: gradeLevel,
      details: detailsText,
      documentDataUrl: docDataUrl || undefined,
      documentName: docFileName || undefined,
      receiptImageDataUrl: receiptDataUrl || undefined,
      receiptFileName: receiptFileName || undefined
    });

    submitPublicApplicationToCloud({
      trackingCode: newRecord.id,
      fullName: newRecord.fullName,
      email: newRecord.email,
      phone: newRecord.phone,
      applicantType: newRecord.applicantType,
      gradeOrSubject: newRecord.gradeOrSubject,
      details: newRecord.details,
      stage: newRecord.status
    });

    setGeneratedRecord(newRecord);
    setIsSubmitted(true);
  };

  const handleCopy = () => {
    if (generatedRecord) {
      navigator.clipboard.writeText(generatedRecord.id);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleCopyBankAccount = (bank: PaymentMethodEAV) => {
    navigator.clipboard.writeText(bank.accountNumber);
    setCopiedBankId(bank.id);
    setTimeout(() => setCopiedBankId(null), 2000);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-[85vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Back Link */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0f1e36] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToHome}</span>
        </button>

        {!admissionSettings.admissionsOpen ? (
          <div className="bg-white rounded-2xl border border-amber-300 p-8 sm:p-10 shadow-md text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#0f1e36]">
              Galmeen Yeroof Cufameera (Admissions Currently Closed)
            </h2>
            <p className="text-sm text-slate-700 max-w-lg mx-auto">
              {currentLang === 'om' ? admissionSettings.closedMessageOm : admissionSettings.closedMessageEn}
            </p>
            <div className="text-xs font-mono font-bold text-amber-800">
              {admissionSettings.academicYearLabel} · Tel: {CHILIMO_INFO.phone}
            </div>
            <div>
              <button
                onClick={onBack}
                className="px-6 py-2.5 bg-[#0f1e36] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                {t.backToHome}
              </button>
            </div>
          </div>
        ) : isSubmitted && generatedRecord ? (
          /* SUCCESS SCREEN */
          <div className="bg-white rounded-2xl border border-amber-300 p-8 sm:p-10 shadow-md text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              Registration Application Submitted!
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto mb-6">
              Your application has been registered in the Chilimo Academy admissions registry. Please save your tracking code:
            </p>

            {/* Generated Code Display Box */}
            <div className="max-w-md mx-auto bg-[#0f1e36] text-white rounded-xl p-6 mb-6 text-center shadow-inner border border-amber-400/40">
              <span className="text-xs uppercase tracking-widest text-amber-400 block mb-1 font-bold">
                Chilimo Academy Admission Tracking Code
              </span>
              <div className="text-3xl font-mono font-black tracking-widest text-white my-2">
                {generatedRecord.id}
              </div>
              <div className="flex justify-center mt-3">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#172c4e] hover:bg-[#203c6b] text-xs font-semibold rounded text-amber-300 transition-colors cursor-pointer border border-amber-400/30"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? "Copied!" : "Copy Code"}</span>
                </button>
              </div>
            </div>

            {activeBanks.length > 0 && (
              <div className="max-w-lg mx-auto mb-6 text-left bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0f1e36] mb-2.5">
                  <Landmark className="w-4 h-4 text-amber-600" />
                  <span>Lakkoofsa Baankii Mana Barumsaa (Official School Bank Accounts)</span>
                </div>
                <div className="space-y-2">
                  {activeBanks.map((bank) => (
                    <div key={bank.id} className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate">{bank.provider}</div>
                        <div className="font-mono font-bold text-indigo-800">{bank.accountNumber}</div>
                        <div className="text-[11px] text-slate-500 truncate">{bank.accountName}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyBankAccount(bank)}
                        className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold cursor-pointer"
                      >
                        {copiedBankId === bank.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedBankId === bank.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => onSuccess(generatedRecord.id)}
                className="px-6 py-2.5 bg-[#0f1e36] hover:bg-[#1a3156] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer border border-amber-400/30"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>Track Application Status</span>
              </button>
              <button
                onClick={onBack}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {t.backToHome}
              </button>
            </div>
          </div>
        ) : (
          /* ADMISSION FORM */
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            
            {/* Header */}
            <div className="bg-[#0f1e36] text-white p-6 sm:p-8 flex items-center gap-4 border-b border-slate-800">
              <img 
                src={getSchoolLogoUrl()} 
                alt="Chilimo Logo" 
                className="w-16 h-16 object-contain bg-white/10 p-1 rounded-xl"
              />
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
                  Chilimo Academy • {admissionSettings.academicYearLabel}
                </span>
                <h1 className="font-serif text-2xl font-black text-white mt-0.5">
                  Guest Student Admission Registration
                </h1>
                <p className="text-xs text-slate-300">
                  Campus: Burayu, Oromia, Ethiopia • Phone: {CHILIMO_INFO.phone}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Caaltuu Dibaba Hundee"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Grade Applying For (KG 1-3 & Grade 1-8) *
                  </label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-slate-900"
                  >
                    <optgroup label="Kindergarten Early Learning">
                      <option value="KG 1 - Early Learners (Age 3-4)">KG 1 - Early Learners (Age 3-4)</option>
                      <option value="KG 2 - Kindergarten (Age 4-5)">KG 2 - Kindergarten (Age 4-5)</option>
                      <option value="KG 3 - Prep (Age 5-6)">KG 3 - Prep (Age 5-6)</option>
                    </optgroup>
                    <optgroup label="Primary School (Grades 1 - 8)">
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 2">Grade 2</option>
                      <option value="Grade 3">Grade 3</option>
                      <option value="Grade 4">Grade 4</option>
                      <option value="Grade 5">Grade 5</option>
                      <option value="Grade 6">Grade 6</option>
                      <option value="Grade 7">Grade 7</option>
                      <option value="Grade 8">Grade 8</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Parent / Guardian Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Dibaba Hundee"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912305111"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="gemedadadi66@gmail.com"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Residential Address (Burayu)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Burayu Gefersa"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* School Bus Option */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                  <Bus className="w-4 h-4 text-amber-700" />
                  <span>Request Chilimo Academy School Bus Transportation?</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                    <input
                      type="radio"
                      name="needBus"
                      checked={needBus === 'yes'}
                      onChange={() => setNeedBus('yes')}
                    />
                    <span>Yes, require bus</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="needBus"
                      checked={needBus === 'no'}
                      onChange={() => setNeedBus('no')}
                    />
                    <span>No, private transport</span>
                  </label>
                </div>

                {needBus === 'yes' && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Select Preferred Burayu Bus Route
                    </label>
                    <select
                      value={busRoutePref}
                      onChange={(e) => setBusRoutePref(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-semibold"
                    >
                      <option value="Burayu Gefersa Line">Burayu Gefersa Line (Bus #01)</option>
                      <option value="Burayu Keta & Town Center">Burayu Keta & Town Center (Bus #02)</option>
                      <option value="Burayu Melka Gahwe & Ashawa">Burayu Melka Gahwe & Ashawa (Bus #03)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* School Bank Accounts Configured by Admin */}
              {activeBanks.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0f1e36]">
                      <Landmark className="w-4 h-4 text-indigo-700" />
                      <span>Lakkoofsa Baankii Kaffaltii Galmee (Official School Bank Accounts)</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 font-mono">
                      Tel: {paymentInfoSettings.bursarPhone}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {currentLang === 'om' ? paymentInfoSettings.generalInstructionsOm : paymentInfoSettings.generalInstructionsEn}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeBanks.map((bank) => {
                      const isSelected = selectedBankProvider === bank.provider;
                      return (
                        <div
                          key={bank.id}
                          onClick={() => setSelectedBankProvider(bank.provider)}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 truncate">{bank.provider}</div>
                              <div className="font-mono font-black text-indigo-800 text-sm mt-0.5 select-all">
                                {bank.accountNumber}
                              </div>
                              <div className="text-[11px] text-slate-600 truncate">{bank.accountName}</div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyBankAccount(bank);
                              }}
                              className="shrink-0 inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                            >
                              {copiedBankId === bank.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedBankId === bank.id ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          {bank.instructions && (
                            <p className="text-[10px] text-slate-500 mt-1.5 line-clamp-2">{bank.instructions}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Receipt / Bank Reference No. (Yoo kaffaltan - Optional)
                    </label>
                    <input
                      type="text"
                      value={regFeeRef}
                      onChange={(e) => setRegFeeRef(e.target.value)}
                      placeholder="e.g. FT26109X882 or Telebirr Ref (optional)"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Student Documents & Bank Slip Upload */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-[#0f1e36] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Waraqaa Ragaa &amp; Nagahee Galmee Ol-kaayi (Upload Documents &amp; Slip - Optional)</span>
                </div>
                {uploadError && <div className="text-xs text-rose-600">{uploadError}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700">
                      Ragaa Dhalootaa / Transcript (Birth Cert / Card)
                    </label>
                    <label className="flex items-center gap-2 px-3 py-2 bg-white border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                      <Upload className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="truncate text-slate-600">{docFileName || 'Filadhu (JPG/PNG/PDF)'}</span>
                      <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileSelect(e, 'doc')} className="hidden" />
                    </label>
                    {docFileName && (
                      <div className="flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
                        <span className="truncate">{docFileName}</span>
                        <button type="button" onClick={() => { setDocDataUrl(''); setDocFileName(''); }} className="text-rose-600 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700">
                      Suuraa Nagahee Kaffaltii Galmee (Payment Slip)
                    </label>
                    <label className="flex items-center gap-2 px-3 py-2 bg-white border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                      <Upload className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="truncate text-slate-600">{receiptFileName || 'Suuraa nagahee filadhu'}</span>
                      <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileSelect(e, 'receipt')} className="hidden" />
                    </label>
                    {receiptFileName && (
                      <div className="flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
                        <span className="truncate">{receiptFileName}</span>
                        <button type="button" onClick={() => { setReceiptDataUrl(''); setReceiptFileName(''); }} className="text-rose-600 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0f1e36] hover:bg-[#1a3156] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer border border-amber-400/30"
                >
                  Submit Admission Application
                </button>
              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};
