import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Award, Printer, ShieldCheck, UserCheck } from 'lucide-react';
import { Language, UserAccount } from '../types';
import { CHILIMO_INFO, getSchoolLogoUrl, getStoredUsers } from '../data/mockData';

interface CertificateGeneratorPanelProps {
  currentLang: Language;
  currentAdmin: UserAccount;
}

type CertificateKind = 'transfer' | 'grade8_completion' | 'honor_roll';

export const CertificateGeneratorPanel: React.FC<CertificateGeneratorPanelProps> = ({
  currentAdmin
}) => {
  const students = getStoredUsers().filter(u => u.role === 'student');
  const [logoUrl, setLogoUrl] = useState<string>(getSchoolLogoUrl);
  const [certKind, setCertKind] = useState<CertificateKind>('grade8_completion');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '151');
  const [studentName, setStudentName] = useState<string>(students[0]?.name || 'Biqila Tolera Gemeda');
  const [gradeLevel, setGradeLevel] = useState<string>(students[0]?.departmentOrGrade || 'Grade 7 - Section B');
  const [academicYear, setAcademicYear] = useState<string>('2018 E.C. (2025/2026)');
  const [conductRemark, setConductRemark] = useState<string>('Very Good / Exemplar Conduct');
  const [destinationSchool, setDestinationSchool] = useState<string>('Any Recognized Ethiopian Primary / Secondary School');
  const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [certNo, setCertNo] = useState<string>(`CHA-CERT-${Math.floor(10000 + Math.random() * 89999)}`);
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const syncLogo = () => setLogoUrl(getSchoolLogoUrl());
    window.addEventListener('chilimo:data-updated', syncLogo);
    return () => window.removeEventListener('chilimo:data-updated', syncLogo);
  }, []);

  useEffect(() => {
    QRCode.toDataURL(
      JSON.stringify({
        school: 'Chilimo Academy Burayu',
        certNo,
        type: certKind,
        studentId: selectedStudentId,
        studentName,
        academicYear,
        issuedBy: currentAdmin.name,
        issueDate
      }),
      { width: 180, margin: 1, color: { dark: '#0b172a', light: '#ffffff' } }
    )
      .then(setQrUrl)
      .catch(() => {});
  }, [certNo, certKind, selectedStudentId, studentName, academicYear, currentAdmin.name, issueDate]);

  const handlePickStudent = (id: string) => {
    setSelectedStudentId(id);
    const s = students.find(u => u.id === id);
    if (s) {
      setStudentName(s.name);
      setGradeLevel(s.departmentOrGrade || 'Grade 7');
    }
  };

  const titleByType: Record<CertificateKind, { om: string; en: string }> = {
    grade8_completion: {
      om: 'Waraqaa Ragaa Xumura Sadarkaa 1ffaa (Kutaa 8ffaa)',
      en: 'Primary School Completion & Character Certificate'
    },
    transfer: {
      om: 'Waraqaa Ragaa Dabarsaa Barataa (Transfer Certificate / TO)',
      en: 'Official Student Transfer Clearance Certificate'
    },
    honor_roll: {
      om: 'Waraqaa Ragaa Badhaasa Qabxii Olaanaa (Honor Roll)',
      en: 'Certificate of Academic Excellence & Merit'
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start print:block">
      {/* Controls */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 print:hidden">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Award className="w-5 h-5 text-amber-600" />
          <div>
            <h3 className="font-serif text-base font-bold text-[#0f1e36]">
              Waraqaa Ragaa (Certificates &amp; TO)
            </h3>
            <p className="text-[11px] text-slate-500">
              Waraqaa Dabarsaa, Xumura Kutaa 8ffaa fi Badhaasaa QR qabu maxxansaa
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Gosa Waraqaa Ragaa (Certificate Type)</label>
          <select
            value={certKind}
            onChange={(e) => setCertKind(e.target.value as CertificateKind)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
          >
            <option value="grade8_completion">Waraqaa Xumura Kutaa 8ffaa (Completion)</option>
            <option value="transfer">Waraqaa Dabarsaa (Transfer / TO)</option>
            <option value="honor_roll">Waraqaa Badhaasa Qabxii Olaanaa (Merit)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Barataa Filadhaa (Select Enrolled Student)</label>
          <select
            value={selectedStudentId}
            onChange={(e) => handlePickStudent(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} (ID: {s.id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Maqaa Guutuu Barataa (Full Name)</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kutaa (Grade)</label>
            <input
              type="text"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bara Barnootaa</label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Naamusa (Conduct &amp; Character)</label>
          <input
            type="text"
            value={conductRemark}
            onChange={(e) => setConductRemark(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
          />
        </div>

        {certKind === 'transfer' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mana Barumsaa Itti Darbu (Transfer To)</label>
            <input
              type="text"
              value={destinationSchool}
              onChange={(e) => setDestinationSchool(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Lakk. Ragaa</label>
            <input
              type="text"
              value={certNo}
              onChange={(e) => setCertNo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Guyyaa Kenname</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="w-full py-2.5 bg-[#0f1e36] hover:bg-[#1a3156] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer border border-amber-400/30"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>Waraqaa Ragaa Maxxansi (Print Certificate)</span>
        </button>
      </div>

      {/* Certificate Preview */}
      <div className="lg:col-span-8 print:w-full">
        <div className="bg-white rounded-2xl border-4 border-[#0b172a] p-2 shadow-lg print:shadow-none">
          <div className="border-2 border-amber-500 rounded-xl p-8 sm:p-10 text-center space-y-6">
            <div className="flex flex-col items-center">
              <img src={logoUrl} alt="Chilimo Academy Crest" className="w-20 h-20 object-contain mb-2" />
              <div className="text-[11px] font-bold uppercase tracking-widest text-amber-700">
                Mootummaa Naannoo Oromiyaa • Burayu City Administration
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#0b172a] tracking-wide mt-1">
                {CHILIMO_INFO.name.toUpperCase()}
              </h2>
              <div className="text-xs font-mono text-slate-500 mt-1">
                Certificate No: {certNo} • Issued: {issueDate}
              </div>
            </div>

            <div className="py-3 px-6 bg-[#0b172a] text-white rounded-lg inline-block">
              <div className="font-serif text-lg sm:text-xl font-bold text-amber-300">
                {titleByType[certKind].om}
              </div>
              <div className="text-xs text-slate-200">{titleByType[certKind].en}</div>
            </div>

            <div className="max-w-2xl mx-auto text-sm sm:text-base text-slate-700 leading-relaxed font-serif">
              <p>
                This is to officially certify that <strong className="text-[#0b172a] text-lg underline decoration-amber-500 underline-offset-4">{studentName}</strong>{' '}
                (Student ID: <span className="font-mono font-bold">{selectedStudentId}</span>) has been a bonafide student of{' '}
                <strong>Chilimo Academy</strong> in <strong>{gradeLevel}</strong> during the academic year{' '}
                <strong>{academicYear}</strong>.
              </p>
              {certKind === 'transfer' ? (
                <p className="mt-3">
                  All tuition, bus, and library obligations have been duly cleared. Transfer is granted to{' '}
                  <strong>{destinationSchool}</strong> with conduct evaluated as <strong>{conductRemark}</strong>.
                </p>
              ) : certKind === 'grade8_completion' ? (
                <p className="mt-3">
                  Having fulfilled all academic requirements prescribed by the Oromia Education Bureau, this certificate of
                  completion and good character (<strong>{conductRemark}</strong>) is awarded.
                </p>
              ) : (
                <p className="mt-3">
                  Recognized for outstanding academic achievement, discipline, and leadership (<strong>{conductRemark}</strong>).
                </p>
              )}
            </div>

            <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-4 items-end text-xs">
              <div className="text-left">
                <div className="border-b border-slate-400 pb-1 font-serif italic text-slate-700">
                  {currentAdmin.name}
                </div>
                <div className="font-bold text-[#0b172a] mt-1">School Principal / Registrar</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px] mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Record</span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Tel: {CHILIMO_INFO.phone}</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                {qrUrl && (
                  <img src={qrUrl} alt="Certificate QR" className="w-20 h-20 border border-slate-200 p-1 rounded" />
                )}
                <span className="text-[9px] font-mono text-slate-400 mt-0.5">Scan to Verify</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
