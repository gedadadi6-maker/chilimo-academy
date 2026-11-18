import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  FileText,
  Printer,
  Save,
  Trash2,
  Copy,
  Check,
  Plus,
  Clock
} from 'lucide-react';
import { Language, SchoolOfficialLetter, UserAccount } from '../types';
import {
  CHILIMO_INFO,
  getSchoolLogoUrl,
  getStoredOfficialLetters,
  saveAllOfficialLetters
} from '../data/mockData';

interface SchoolLetterheadStudioProps {
  currentLang: Language;
  currentAdmin: UserAccount;
  onNotify: (msg: string) => void;
}

interface LetterTemplate {
  key: string;
  label: string;
  recipient: string;
  subject: string;
  body: string;
}

const LETTER_TEMPLATES: LetterTemplate[] = [
  {
    key: 'Blank Letterhead',
    label: 'Xalayaa Qulqulluu (Blank Official Letter)',
    recipient: 'Gara / To: ___________________________',
    subject: 'Dhimma / Subject: ___________________________',
    body: 'Kabajamoo ___________________________,\n\nIbsa fi ergaa ofii asitti barreessaa...\n\nKabaja guddaadhaan,'
  },
  {
    key: 'To Whom It May Concern',
    label: 'To Whom It May Concern (Waraqaa Mirkaneessaa)',
    recipient: 'To Whom It May Concern',
    subject: 'Mirkaneessa Barataa / Student Enrollment Confirmation',
    body: 'Xalayaan kun barataa/ttuu _______________________ bara barnootaa 2018/2019 E.C. keessa Mana Barumsaa Chilimo Academy Magaalaa Burayu kutaa _______ keessatti barachaa jiraachuu isaa/ishee ni mirkaneessa.\n\nBarataan/ttun kun naamusa gaarii fi hordoffii barnootaa cimaa kan qabu/du yoo ta\'u, dhimma isaanii irratti deeggarsi barbaachisaa ta\'e hundi akka godhamuuf kabajaan gaafanna.'
  },
  {
    key: 'PTA Meeting Invitation',
    label: 'Waamicha Walgahii Maatii (PTA Meeting Call)',
    recipient: 'Gara Maatii & Guddistoota Barattootaa Hundaaf',
    subject: 'Waamicha Walgahii Maatii fi Barsiisotaa (WBG / PTA)',
    body: 'Kabajamoo Maatii Barattootaa,\n\nHoggansi Mana Barumsaa Chilimo Academy qophii barnootaa fi guddina barattootaa irratti mari\'achuuf walgahii waliigalaa guyyaa _______________ sa\'aatii _______ irratti galma mana barumsaa keessatti qopheesseera.\n\nArgamuun keessan milkaa\'ina barnoota ijoollee keessaniif murteessaa waan ta\'eef sa\'aatii kabajuun akka argamtan kabajaan isin beeksifna.'
  },
  {
    key: 'Fee Reminder',
    label: 'Yaadachiisa Kaffaltii (Official Fee Notice)',
    recipient: 'Gara Maatii Barataa/ttuu _______________________',
    subject: 'Yaadachiisa Kaffaltii Mana Barumsaa (Tuition / Bus Fee)',
    body: 'Kabajamoo Maatii,\n\nKaffaltiin barnootaa / geejjibaa ji\'a _______________ hanga ammaatti waan hin raawwatamneef, kaffaltii __________ ETB lakkoofsa herrega baankii mana barumsaa ykn Telebirr (0912305111) irratti guyyaa hojii 5 keessatti akka xumurtan kabajaan isin yaadachiifna.\n\nKaffaltii duraan raawwattan yoo jiraate nagahee baankii portal maatii irratti galchuun mirkaneessaa.'
  },
  {
    key: 'Award & Appreciation',
    label: 'Xalayaa Galateeffannaa & Badhaasaa (Merit Letter)',
    recipient: 'Gara _______________________',
    subject: 'Galateeffannaa fi Beekkamtii Hojii / Barnootaa',
    body: 'Kabajamoo _______________________,\n\nBara barnootaa kana keessa naamusa gaarii, tattaaffii cimaa fi bu\'aa olaanaa mana barumsaa Chilimo Academy keessatti agarsiiftaniif hoggansi mana barumsaa maqaa hawaasa barnootaatiin galata guddaa isiniif dhiyeessa.\n\nFuuldurattis fakkeenyummaa gaarii kanaan akka itti fuftan abdii guddaa qabna.'
  },
  {
    key: 'Disciplinary / Attendance Notice',
    label: 'Yaadachiisa Naamusaa fi Hordoffii (Conduct Notice)',
    recipient: 'Gara Maatii Barataa/ttuu _______________________',
    subject: 'Marii Naamusaa fi Hordoffii Daree',
    body: 'Kabajamoo Maatii,\n\nBarataa/ttuu _______________________ kutaa _______ irratti dhimma hordoffii daree fi naamusa barnootaa irratti mari\'achuun barbaachisaa ta\'ee waan argameef, guyyaa _______________ sa\'aatii _______ irratti biiroo Daarektaraatti akka dhiyaattan kabajaan isin beeksifna.'
  },
  {
    key: 'Staff Experience Letter',
    label: 'Waraqaa Muuxannoo Hojii (Experience Letter)',
    recipient: 'Gara Qaama Dhimmi Ilaallatu Hundaaf / To Whom It May Concern',
    subject: 'Mirkaneessa Hojii fi Muuxannoo (Certificate of Employment)',
    body: 'Xalayaan kun Obbo / Aaddee _______________________ guyyaa ___________ irraa eegalee hanga ___________tti Mana Barumsaa Chilimo Academy Magaalaa Burayu keessatti sadarkaa hojii _______________________ tiin amanamummaa fi gahumsa olaanaadhaan tajaajilaa turuu isaanii ni mirkaneessa.'
  }
];

export const SchoolLetterheadStudio: React.FC<SchoolLetterheadStudioProps> = ({
  currentAdmin,
  onNotify
}) => {
  const [logoUrl, setLogoUrl] = useState<string>(getSchoolLogoUrl);
  const [letters, setLetters] = useState<SchoolOfficialLetter[]>(() => getStoredOfficialLetters());

  const [templateType, setTemplateType] = useState<string>('To Whom It May Concern');
  const [refNo, setRefNo] = useState<string>(`CHA/BUR/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 899)}`);
  const [dateText, setDateText] = useState<string>(new Date().toISOString().split('T')[0]);
  const [recipient, setRecipient] = useState<string>(LETTER_TEMPLATES[1].recipient);
  const [subject, setSubject] = useState<string>(LETTER_TEMPLATES[1].subject);
  const [body, setBody] = useState<string>(LETTER_TEMPLATES[1].body);
  const [signatoryName, setSignatoryName] = useState<string>(currentAdmin.name || 'Obbo Geda Dadi');
  const [signatoryTitle, setSignatoryTitle] = useState<string>('Daarektara Mana Barumsaa (School Principal)');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const syncLogo = () => setLogoUrl(getSchoolLogoUrl());
    window.addEventListener('chilimo:data-updated', syncLogo);
    return () => window.removeEventListener('chilimo:data-updated', syncLogo);
  }, []);

  useEffect(() => {
    QRCode.toDataURL(
      JSON.stringify({
        school: 'Chilimo Academy Burayu',
        refNo,
        date: dateText,
        subject,
        signatory: signatoryName
      }),
      { width: 160, margin: 1, color: { dark: '#0b172a', light: '#ffffff' } }
    )
      .then(setQrUrl)
      .catch(() => {});
  }, [refNo, dateText, subject, signatoryName]);

  const handleApplyTemplate = (key: string) => {
    setTemplateType(key);
    const found = LETTER_TEMPLATES.find(t => t.key === key);
    if (found) {
      setRecipient(found.recipient);
      setSubject(found.subject);
      setBody(found.body);
    }
  };

  const handleSaveLetter = () => {
    const newLetter: SchoolOfficialLetter = {
      id: `LTR-${Date.now().toString().slice(-5)}`,
      refNo: refNo.trim() || `CHA/BUR/${Date.now()}`,
      dateText: dateText.trim(),
      templateType,
      recipient: recipient.trim(),
      subject: subject.trim(),
      body,
      signatoryName: signatoryName.trim(),
      signatoryTitle: signatoryTitle.trim(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newLetter, ...letters];
    setLetters(updated);
    saveAllOfficialLetters(updated);
    onNotify(`Xalayaan (${newLetter.refNo}) kuusaa mana barumsaatti olkaa'ameera!`);
  };

  const handleLoadLetter = (l: SchoolOfficialLetter) => {
    setTemplateType(l.templateType);
    setRefNo(l.refNo);
    setDateText(l.dateText);
    setRecipient(l.recipient);
    setSubject(l.subject);
    setBody(l.body);
    setSignatoryName(l.signatoryName);
    setSignatoryTitle(l.signatoryTitle);
    onNotify(`Xalayaan (${l.refNo}) banameera.`);
  };

  const handleDeleteLetter = (id: string) => {
    const updated = letters.filter(l => l.id !== id);
    setLetters(updated);
    saveAllOfficialLetters(updated);
    onNotify('Xalayaan kuusaa irraa haqameera.');
  };

  const handleCopyText = () => {
    const plain = `CHILIMO ACADEMY — BURAYU, OROMIA\nRef: ${refNo} | Date: ${dateText}\nTo: ${recipient}\nSubject: ${subject}\n\n${body}\n\n${signatoryName}\n${signatoryTitle}`;
    navigator.clipboard.writeText(plain);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start print:block">
        {/* Left Editor Panel (Hidden during Print) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 print:hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="font-serif text-base font-bold text-[#0f1e36]">
                  Official School Letterhead Writer
                </h3>
                <p className="text-[11px] text-slate-500">
                  Xalayaa adda addaa letterhead mana barumsaa irratti barreessaa &amp; maxxansaa
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setRefNo(`CHA/BUR/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 899)}`);
                handleApplyTemplate('Blank Letterhead');
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Haaraa</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Gosa Xalayaa (Letter Template)
            </label>
            <select
              value={templateType}
              onChange={(e) => handleApplyTemplate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
            >
              {LETTER_TEMPLATES.map(tpl => (
                <option key={tpl.key} value={tpl.key}>{tpl.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lakk. Xalayaa (Ref No.)</label>
              <input
                type="text"
                value={refNo}
                onChange={(e) => setRefNo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Guyyaa (Date)</label>
              <input
                type="text"
                value={dateText}
                onChange={(e) => setDateText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Gara (Recipient / To)</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Dhimma (Subject)</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Qaama Xalayaa (Letter Content)</label>
            <textarea
              rows={7}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Maqaa Mallatteessaa (Signatory)</label>
              <input
                type="text"
                value={signatoryName}
                onChange={(e) => setSignatoryName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gahee Hojii (Title)</label>
              <input
                type="text"
                value={signatoryTitle}
                onChange={(e) => setSignatoryTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleSaveLetter}
              className="flex-1 py-2.5 px-3 bg-[#0f1e36] hover:bg-[#1a3156] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-amber-400" />
              <span>Olkaa&apos;i (Save)</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-[#0f1e36] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Maxxansi / PDF</span>
            </button>
            <button
              type="button"
              onClick={handleCopyText}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Saved Archive List */}
          {letters.length > 0 && (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Xalayaawwan Kuufaman ({letters.length})</span>
              </div>
              <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                {letters.map(l => (
                  <div
                    key={l.id}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-2 text-xs"
                  >
                    <button
                      type="button"
                      onClick={() => handleLoadLetter(l)}
                      className="text-left min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="font-bold text-slate-900 truncate">{l.subject}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {l.refNo} • {l.createdAt}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLetter(l.id)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                      title="Delete saved letter"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Printable Official A4 Letterhead Sheet */}
        <div className="lg:col-span-7 print:w-full">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-lg overflow-hidden print:border-0 print:shadow-none print:rounded-none">
            {/* Top Institutional Crest Accent Band */}
            <div className="h-2.5 bg-gradient-to-r from-[#0b172a] via-amber-500 to-[#0b172a]" />

            <div className="p-8 sm:p-10 min-h-[760px] print:min-h-[250mm] print:p-6 flex flex-col justify-between">
              <div>
                {/* Official Letterhead Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b-2 border-[#0b172a]">
                  <div className="flex items-center gap-4">
                    <img
                      src={logoUrl}
                      alt="Chilimo Academy Crest"
                      className="w-20 h-20 object-contain shrink-0"
                    />
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                        Mootummaa Naannoo Oromiyaa • Bulchiinsa Magaalaa Burayyuu
                      </div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#0b172a] tracking-tight">
                        {CHILIMO_INFO.name.toUpperCase()}
                      </h2>
                      <div className="text-xs font-semibold text-slate-600">
                        KG 1–3 &amp; Primary (Grades 1–8) • &ldquo;{CHILIMO_INFO.motto}&rdquo;
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-slate-600 space-y-0.5 font-mono">
                    <div>Tel: {CHILIMO_INFO.phone}</div>
                    <div>Email: {CHILIMO_INFO.email}</div>
                    <div>Burayu, Oromia, Ethiopia</div>
                  </div>
                </div>

                {/* Ref & Date Strip */}
                <div className="flex flex-wrap justify-between items-center gap-2 py-4 text-xs border-b border-slate-200">
                  <div>
                    <span className="text-slate-500 font-semibold">Lakk. / Ref. No: </span>
                    <strong className="font-mono text-[#0b172a]">{refNo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold">Guyyaa / Date: </span>
                    <strong className="font-mono text-[#0b172a]">{dateText}</strong>
                  </div>
                </div>

                {/* Recipient & Subject */}
                <div className="mt-6 space-y-3 text-sm text-slate-900">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      Gara / To:
                    </span>
                    <p className="font-bold text-slate-900 mt-0.5">{recipient}</p>
                  </div>

                  <div className="pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Dhimma / Subject:{' '}
                    </span>
                    <span className="font-bold underline decoration-amber-500 underline-offset-4 text-[#0b172a]">
                      {subject}
                    </span>
                  </div>
                </div>

                {/* Letter Body */}
                <div className="mt-7 text-sm text-slate-800 leading-7 whitespace-pre-wrap font-serif">
                  {body}
                </div>
              </div>

              {/* Official Signature, School Seal & QR Footer */}
              <div className="mt-12 pt-6 border-t border-slate-200 flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-2">
                  <div className="w-56 border-b border-slate-400 pb-2 font-serif italic text-slate-700 text-sm">
                    {signatoryName}
                  </div>
                  <div className="text-xs font-bold text-[#0b172a]">{signatoryName}</div>
                  <div className="text-[11px] text-slate-500">{signatoryTitle}</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#0b172a]/50 flex flex-col items-center justify-center text-center p-2 text-[9px] font-bold uppercase tracking-wider text-[#0b172a]/70">
                    <span>Chilimo Academy</span>
                    <span className="text-amber-700">Official Seal</span>
                    <span>Burayu</span>
                  </div>

                  {qrUrl && (
                    <div className="text-center">
                      <img src={qrUrl} alt="Letter QR Verification" className="w-16 h-16 border border-slate-200 p-1 rounded" />
                      <span className="block text-[9px] font-mono text-slate-400 mt-0.5">Verify Doc</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Contact Bar */}
            <div className="bg-[#0b172a] text-amber-200 text-[10px] px-8 py-2.5 flex flex-wrap justify-between items-center gap-2">
              <span>CHILIMO ACADEMY • BURAYU, OROMIA</span>
              <span className="font-mono">Tel: {CHILIMO_INFO.phone} • {CHILIMO_INFO.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
