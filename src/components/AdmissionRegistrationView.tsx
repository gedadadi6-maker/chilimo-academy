import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle, 
  Copy, 
  Check, 
  Search, 
  Bus, 
  School,
  FileCheck2,
  Calendar,
  Phone
} from 'lucide-react';
import { Language, ApplicationRecord } from '../types';
import { translations } from '../translations';
import { submitGuestApplication, CHILIMO_INFO } from '../data/mockData';

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

  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('0912305111');
  const [email, setEmail] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Grade 1');
  const [birthDate, setBirthDate] = useState('2019-06-12');
  const [address, setAddress] = useState('Burayu, Oromia');
  const [needBus, setNeedBus] = useState('yes');
  const [busRoutePref, setBusRoutePref] = useState('Burayu Gefersa Line');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedRecord, setGeneratedRecord] = useState<ApplicationRecord | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !phone) return;

    const newRecord = submitGuestApplication({
      fullName: studentName,
      email: email || `${studentName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: phone,
      applicantType: 'student',
      gradeOrSubject: gradeLevel,
      details: `Parent: ${parentName}. DOB: ${birthDate}. Address: ${address}. Bus Transport: ${needBus === 'yes' ? busRoutePref : 'No'}.`
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

        {isSubmitted && generatedRecord ? (
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
            <div className="max-w-md mx-auto bg-[#0f1e36] text-white rounded-xl p-6 mb-8 text-center shadow-inner border border-amber-400/40">
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
                src={CHILIMO_INFO.logoUrl} 
                alt="Chilimo Logo" 
                className="w-16 h-16 object-contain bg-white/10 p-1 rounded-xl"
              />
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
                  Chilimo Academy • {CHILIMO_INFO.grades}
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
