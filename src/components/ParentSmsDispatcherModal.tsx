import React, { useState } from 'react';
import { 
  Send, 
  Smartphone, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  Calendar, 
  X,
  Sparkles,
  PhoneCall,
  MessageSquare
} from 'lucide-react';
import { ParentSmsNotification } from '../types';
import { 
  getStoredSmsNotifications, 
  dispatchParentSms, 
  CHILIMO_INFO,
  getStoredUsers 
} from '../data/mockData';

interface ParentSmsDispatcherModalProps {
  onClose: () => void;
  defaultStudentId?: string;
}

export const ParentSmsDispatcherModal: React.FC<ParentSmsDispatcherModalProps> = ({
  onClose,
  defaultStudentId = "151"
}) => {
  const [history, setHistory] = useState<ParentSmsNotification[]>(getStoredSmsNotifications());
  const [selectedStudentId, setSelectedStudentId] = useState<string>(defaultStudentId);
  const [recipientPhone, setRecipientPhone] = useState<string>("0912305111");
  const [recipientName, setRecipientName] = useState<string>("Aaddee Aster Tolera (Haadha Biqilaa)");
  const [templateType, setTemplateType] = useState<ParentSmsNotification['templateType']>('payment_reminder');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [lastDispatchedSms, setLastDispatchedSms] = useState<ParentSmsNotification | null>(history[0] || null);
  const [toast, setToast] = useState<string | null>(null);

  const students = getStoredUsers().filter(u => u.role === 'student');

  const templates: Record<ParentSmsNotification['templateType'], string> = {
    payment_reminder: `[CHILIMO ACADEMY] Kabajamoo ${recipientName}, Kaffaltiin barumsaa ji'a Sadaasaa barataa Biqila Tolera (ID: ${selectedStudentId}) 1,500 ETB kaffalamuun isaa hin mirkanoofne. Karaa Telebirr (${CHILIMO_INFO.phone}) ykn CBE (1000456789123) kaffaluun nu beeksisaa. Burayu Campus.`,
    attendance_alert: `[CHILIMO ACADEMY - ARIFAACHIISA] Kabajamoo maatii, barataan keessan Biqila Tolera (ID: ${selectedStudentId}) har'a daree hin galle. Sababa isaa beekuuf bilbila ${CHILIMO_INFO.phone} irratti waajjira bulchiinsaa qunnamaa.`,
    report_card: `[CHILIMO ACADEMY] Baga gammaddan! Kaardiin qabxii Biqila Tolera (ID: ${selectedStudentId}) qophaa'eera. Qabxii: %93.2 (Sadarkaa 2ffaa). Student Portal irraa ilaaluu fi maxxanfachuu dandeessu.`,
    school_holiday: `[CHILIMO ACADEMY] Beeksisa: Boru sababa ayyaanaatiin manni barumsaa cufaa ta'a. Guyyaa itti aanu barnoonni akkuma duritti itti fufa. Chilimo Academy Burayu.`,
    custom: customMessage || `[CHILIMO ACADEMY] Ergaa kabajamoo maatii barataa Biqilaatiif: ...`
  };

  const currentPreviewMessage = templateType === 'custom' ? customMessage : templates[templateType];

  const handleStudentSelect = (id: string) => {
    setSelectedStudentId(id);
    if (id === '151') {
      setRecipientName("Aaddee Aster Tolera (Haadha Biqilaa)");
      setRecipientPhone("0912305111");
    } else {
      setRecipientName("Maatii Barataa (Parent)");
      setRecipientPhone("0911002233");
    }
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPreviewMessage.trim()) return;

    const dispatched = dispatchParentSms({
      parentPhone: recipientPhone,
      parentName: recipientName,
      studentId: selectedStudentId,
      studentName: "Biqila Tolera Gemeda",
      templateType,
      messageText: currentPreviewMessage
    });

    setHistory([dispatched, ...history]);
    setLastDispatchedSms(dispatched);
    setToast(`Ergaan SMS bilbila ${recipientPhone} irratti milkaa'inaan ergameera!`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        
        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 bg-[#0f1e36] text-white px-4 py-2.5 rounded-xl shadow-xl border border-amber-400 flex items-center gap-2 text-xs font-bold animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {toast}
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 rounded-2xl shadow-sm">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#0f1e36]">
                  Sirna Ergaa SMS fi Beeksisa Bilbila Maatiif
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                  SMS Gateway Live
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Automated Parent SMS Dispatcher with Live Mobile Phone Preview • Chilimo Academy Burayu
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Grid: Form on Left, Mobile Phone Simulator on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
          
          {/* Left Column: Composer Form */}
          <div className="lg:col-span-7 space-y-4">
            
            <form onSubmit={handleSendSms} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Select Student */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Barataa Filadhaa (Target Student)
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => handleStudentSelect(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} (ID: {s.id})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Parent Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bilbila Maatii (Parent Phone #)
                  </label>
                  <input
                    type="text"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Template Category Selector Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Gosa Ergaa Filadhaa (SMS Category & Template)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'payment_reminder', label: '💳 Akeekkachiisa Kaffaltii' },
                    { id: 'attendance_alert', label: '⚠️ Hafaa Daree (Absence)' },
                    { id: 'report_card', label: '📜 Kaardii Qabxii' },
                    { id: 'custom', label: '✍️ Ergaa Ofii (Custom)' }
                  ].map(tmpl => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setTemplateType(tmpl.id as any)}
                      className={`p-2.5 rounded-xl text-[11px] font-bold text-left transition border ${
                        templateType === tmpl.id
                          ? 'bg-[#0f1e36] text-white border-amber-400 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Composer Area */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-bold text-slate-700">Qabiyyee Ergaa (SMS Body):</span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {currentPreviewMessage.length} characters • 1 SMS Segment
                  </span>
                </div>
                {templateType === 'custom' ? (
                  <textarea
                    rows={4}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Ergaa keessan asitti barreessaa..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
                    required
                  />
                ) : (
                  <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed font-medium">
                    {templates[templateType]}
                  </div>
                )}
              </div>

              {/* Dispatch Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  Sender ID: <strong className="text-slate-800">CHILIMO-ACADEMY</strong>
                </span>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl font-black text-xs shadow-md flex items-center gap-2 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>SMS Bilbilatti Ergi (Send Parent SMS)</span>
                </button>
              </div>

            </form>

            {/* Dispatched History Table */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <h4 className="text-xs font-black text-[#0f1e36] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Ergaawwan Dhiheenya Ergamani (SMS Dispatch Log)
              </h4>
              <div className="overflow-x-auto max-h-48 overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[10px] uppercase text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="py-2">Bilbila</th>
                      <th className="py-2">Gosa</th>
                      <th className="py-2">Sa'aatii</th>
                      <th className="py-2 text-right">Haala</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {history.map(sms => (
                      <tr key={sms.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setLastDispatchedSms(sms)}>
                        <td className="py-2.5 font-mono font-bold text-slate-800">{sms.parentPhone}</td>
                        <td className="py-2.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {sms.templateType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-500 text-[11px]">{sms.sentAt}</td>
                        <td className="py-2.5 text-right font-black text-[10px] text-emerald-600">
                          ✓ DELIVERED
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Mobile Phone Mockup Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            <div className="text-center mb-3">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Moodeela Bilbila Maatii (Parent Phone Preview)
              </span>
              <p className="text-[11px] text-slate-500">
                Ergaan kun bilbila maatii irratti akkamitti akka mul'atu
              </p>
            </div>

            {/* Mobile Device Frame */}
            <div className="w-[300px] h-[550px] bg-slate-900 rounded-[45px] p-3 shadow-2xl border-4 border-slate-700 relative flex flex-col justify-between">
              
              {/* Phone Speaker Notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-700 mr-2"></div>
                <div className="w-10 h-1 rounded-full bg-slate-700"></div>
              </div>

              {/* Phone Screen */}
              <div className="flex-1 bg-gradient-to-b from-slate-100 to-slate-200 rounded-[35px] overflow-hidden flex flex-col justify-between p-3 relative shadow-inner">
                
                {/* Phone Top Status Bar */}
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-700 px-2 pt-1 mb-2">
                  <span>09:41</span>
                  <div className="flex items-center gap-1">
                    <span>5G</span>
                    <span className="text-xs">📶</span>
                    <span className="text-xs">🔋</span>
                  </div>
                </div>

                {/* Top Push Notification Banner */}
                <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-slate-200 mb-3 animate-pulse">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">💬</span>
                      <strong className="text-[11px] font-black text-[#0f1e36]">CHILIMO-ACADEMY</strong>
                    </div>
                    <span className="text-[9px] text-slate-400">Amma (Just Now)</span>
                  </div>
                  <p className="text-[10px] text-slate-800 line-clamp-2 font-medium">
                    {currentPreviewMessage}
                  </p>
                </div>

                {/* SMS Conversation App Screen */}
                <div className="flex-1 bg-white rounded-2xl p-2.5 shadow-xs overflow-y-auto space-y-2 border border-slate-100 flex flex-col justify-end">
                  
                  <div className="text-center my-1">
                    <span className="text-[9px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">
                      Har'a (Today)
                    </span>
                  </div>

                  {/* Incoming SMS Bubble */}
                  <div className="bg-emerald-500 text-white p-3 rounded-2xl rounded-tl-xs max-w-[90%] self-start shadow-xs text-[11px] space-y-1">
                    <div className="font-black text-[9px] text-emerald-100 tracking-wider">
                      CHILIMO-ACADEMY
                    </div>
                    <p className="leading-snug">
                      {lastDispatchedSms ? lastDispatchedSms.messageText : currentPreviewMessage}
                    </p>
                    <div className="text-[8px] text-emerald-100 text-right">
                      {lastDispatchedSms ? lastDispatchedSms.sentAt.split(' ')[1] : '09:41 AM'}
                    </div>
                  </div>

                </div>

                {/* SMS Input simulation bar at bottom of phone */}
                <div className="pt-2 flex items-center gap-1">
                  <div className="flex-1 bg-white rounded-full px-3 py-1 text-[10px] text-slate-400 border border-slate-200">
                    Text message...
                  </div>
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                    ↑
                  </div>
                </div>

              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-2"></div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
