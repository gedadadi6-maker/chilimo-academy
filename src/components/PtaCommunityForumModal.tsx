import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Calendar, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Send, 
  FileText, 
  Check, 
  AlertCircle,
  HelpCircle,
  Plus
} from 'lucide-react';
import { PtaMeetingRecord, ParentCommunityFeedback } from '../types';
import { 
  getStoredPtaMeetings, 
  getStoredParentFeedbacks, 
  submitParentFeedback,
  CHILIMO_INFO 
} from '../data/mockData';

interface PtaCommunityForumModalProps {
  onClose: () => void;
  userRole?: string;
  parentNameDefault?: string;
  parentPhoneDefault?: string;
}

export const PtaCommunityForumModal: React.FC<PtaCommunityForumModalProps> = ({
  onClose,
  userRole = 'parent',
  parentNameDefault = "Aaddee Aster Tolera",
  parentPhoneDefault = "0912305111"
}) => {
  const [activeTab, setActiveTab] = useState<'meetings' | 'feedback_box'>('meetings');
  const [meetings, setMeetings] = useState<PtaMeetingRecord[]>(getStoredPtaMeetings());
  const [feedbacks, setFeedbacks] = useState<ParentCommunityFeedback[]>(getStoredParentFeedbacks());
  const [toast, setToast] = useState<string | null>(null);

  // Parent Feedback Form
  const [senderName, setSenderName] = useState<string>(parentNameDefault);
  const [senderPhone, setSenderPhone] = useState<string>(parentPhoneDefault);
  const [fbCategory, setFbCategory] = useState<ParentCommunityFeedback['category']>('Barnoota & Barsiisota');
  const [fbTopic, setFbTopic] = useState<string>('');
  const [fbMessage, setFbMessage] = useState<string>('');

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbTopic.trim() || !fbMessage.trim()) return;

    const newFb = submitParentFeedback({
      parentName: senderName || "Maatii Barataa",
      parentPhone: senderPhone || "0912305111",
      studentIdLinked: "151",
      category: fbCategory,
      topic: fbTopic,
      message: fbMessage
    });

    setFeedbacks(getStoredParentFeedbacks());
    setFbTopic('');
    setFbMessage('');
    setToast("Yaanni keessan hoggansa mana barumsaatiif qaqqabeera! Galatoomaa.");
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[94vh] overflow-y-auto">
        
        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 bg-[#0f1e36] text-white px-5 py-3 rounded-2xl shadow-xl border border-amber-400 flex items-center gap-2 text-xs font-bold animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toast}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#0f1e36]">
                  Koree Maatii fi Barsiisotaa - WBG (PTA Meeting & Community Forum)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800">
                  Parent-School Partnership
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Chilimo Academy Parent-Teacher Association (WBG) Assemblies & Suggestions Box
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pt-4 border-b border-slate-100 pb-3">
          <button
            onClick={() => setActiveTab('meetings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'meetings'
                ? 'bg-purple-700 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Walga'ii WBG (PTA Assemblies)</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback_box')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'feedback_box'
                ? 'bg-purple-700 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Yaada fi Komii Maatii (Feedback Box)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold">
              {feedbacks.length}
            </span>
          </button>
        </div>

        {/* TAB 1: PTA MEETINGS & RESOLUTIONS */}
        {activeTab === 'meetings' && (
          <div className="mt-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-[#0f1e36]">
                  Sagantaa Walga'ii Maatii fi Murtoowwan (PTA Assemblies & Resolutions)
                </h3>
                <p className="text-xs text-slate-500">
                  Gabaasa marii, qabxii murtoo, fi sagantaa walga'ii maatii dhiheenyaa
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meetings.map(m => (
                <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        m.status === 'upcoming' 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {m.status === 'upcoming' ? '• Saganteeffameera (Upcoming)' : '✓ Raawwatameera (Completed)'}
                      </span>
                      <span className="text-xs font-mono text-purple-700 font-bold">
                        {m.attendeesCount} Maatii Argamaniiru
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 mb-1">{m.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 font-mono mb-3">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{m.meetingDate} • {m.meetingTime} • {m.location}</span>
                    </p>

                    {/* Agenda */}
                    <div className="bg-slate-50 p-3 rounded-xl text-xs mb-3">
                      <span className="font-bold text-slate-700 block mb-1">Ajandaa Marii (Agenda):</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                        {m.agendaTopics.map((ag, i) => (
                          <li key={i}>{ag}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Resolutions */}
                    <div className="bg-purple-50 p-3 rounded-xl text-xs">
                      <span className="font-bold text-purple-900 block mb-1">Murtoowwan Darban (Resolutions):</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-purple-800">
                        {m.resolutionsAndMinutes.map((res, i) => (
                          <li key={i}>{res}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                    <span>Koree WBG Chilimo Academy</span>
                    <span className="font-mono">Burayu Campus</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PARENT FEEDBACK & SUGGESTIONS BOX */}
        {activeTab === 'feedback_box' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
            
            {/* Left: Feedback Composer Form */}
            <div className="lg:col-span-5 bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
              <div>
                <h3 className="font-bold text-sm text-[#0f1e36]">
                  Yaada ykn Komii Ergaa (Parent Feedback Box)
                </h3>
                <p className="text-xs text-slate-500">
                  Yaadni keessan hoggansa mana barumsaatiin dubbifamee battalatti deebiin itti kennama.
                </p>
              </div>

              <form onSubmit={handleSubmitFeedback} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Maqaa Maatii</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lakk. Bilbilaa</label>
                  <input
                    type="text"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gosa Yaadaa (Category)</label>
                  <select
                    value={fbCategory}
                    onChange={(e) => setFbCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="Barnoota & Barsiisota">Barnoota & Barsiisota</option>
                    <option value="Kaffaltii & Baasii">Kaffaltii & Baasii (Telebirr/CBE)</option>
                    <option value="Konkolaataa & Geejjiba">Konkolaataa & Geejjiba</option>
                    <option value="Nyaata & Qulqullina">Nyaata & Qulqullina</option>
                    <option value="Yaada Waliigalaa">Yaada Waliigalaa</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mata Duree (Subject Topic)</label>
                  <input
                    type="text"
                    placeholder="Fkn: Sa'aatii konkolaataa duraa"
                    value={fbTopic}
                    onChange={(e) => setFbTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Yaada Keessan Guutuu (Message)</label>
                  <textarea
                    rows={4}
                    placeholder="Yaada ijaarsaa ykn komii keessan bal'inaan barreessaa..."
                    value={fbMessage}
                    onChange={(e) => setFbMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-black text-xs shadow-md flex items-center justify-center gap-2 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Yaada Ergi (Submit to Board)</span>
                </button>
              </form>
            </div>

            {/* Right: Live Feedbacks List with Leadership Responses */}
            <div className="lg:col-span-7 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Yaadawwan Maatii Dhiheenya Kennamaniifi Deebii Hoggansaa ({feedbacks.length})
              </h4>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {feedbacks.map(fb => (
                  <div key={fb.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-sm text-slate-900">{fb.topic}</h5>
                        <span className="text-[11px] text-purple-700 font-bold block">{fb.category}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        fb.status === 'board_approved' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : fb.status === 'addressed' 
                          ? 'bg-sky-100 text-sky-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {fb.status === 'board_approved' ? '✓ Board Approved' : fb.status === 'addressed' ? '✓ Deebiin Kennameera' : 'Qorannoorra Jira'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-2.5 rounded-xl">
                      "{fb.message}"
                    </p>

                    <div className="text-[10px] text-slate-400 flex justify-between font-mono">
                      <span>Maatii: {fb.parentName} ({fb.parentPhone})</span>
                      <span>{fb.dateSubmitted}</span>
                    </div>

                    {/* Official Response */}
                    {fb.adminResponse && (
                      <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-xs text-purple-900 mt-2">
                        <strong className="block text-[10px] uppercase tracking-wider text-purple-800">
                          Deebii Hoggansa Mana Barumsaa (Admin Response):
                        </strong>
                        <p className="italic mt-0.5">{fb.adminResponse}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
