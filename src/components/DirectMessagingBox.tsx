import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  User, 
  Clock, 
  CheckCheck, 
  Sparkles, 
  Check, 
  Inbox,
  Search
} from 'lucide-react';
import { UserAccount, ParentTeacherMessage } from '../types';
import { 
  getStoredMessages, 
  sendDirectMessage, 
  getStoredUsers 
} from '../data/mockData';

interface DirectMessagingBoxProps {
  currentUser: UserAccount;
}

export const DirectMessagingBox: React.FC<DirectMessagingBoxProps> = ({
  currentUser
}) => {
  const [messages, setMessages] = useState<ParentTeacherMessage[]>(getStoredMessages());
  const [activePartnerId, setActivePartnerId] = useState<string>(() => {
    // If parent, default to teacher 153. If teacher, default to parent 163.
    return currentUser.role === 'parent' ? '153' : '163';
  });

  const [newMessageText, setNewMessageText] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const allUsers = getStoredUsers();

  // Potential conversation partners based on role
  const potentialPartners = allUsers.filter(u => {
    if (u.id === currentUser.id) return false;
    if (currentUser.role === 'parent') {
      return u.role === 'teacher' || u.role === 'admin';
    }
    if (currentUser.role === 'teacher') {
      return u.role === 'parent' || u.role === 'admin' || u.role === 'student';
    }
    return true;
  });

  const activePartner = allUsers.find(u => u.id === activePartnerId) || potentialPartners[0];

  // Filter conversation messages between currentUser and activePartner
  const conversation = messages.filter(
    m => (m.senderId === currentUser.id && m.recipientId === activePartnerId) ||
         (m.senderId === activePartnerId && m.recipientId === currentUser.id)
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activePartner) return;

    const sent = sendDirectMessage({
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role as any,
      recipientId: activePartner.id,
      recipientName: activePartner.name,
      recipientRole: activePartner.role as any,
      studentIdLinked: currentUser.role === 'parent' ? currentUser.studentIdLinked || '151' : undefined,
      studentName: "Biqila Tolera Gemeda",
      subject: messageSubject || `Ergaa Haaraa (${activePartner.name}tiif)`,
      messageText: newMessageText.trim()
    });

    setMessages([sent, ...messages]);
    setNewMessageText('');
    setMessageSubject('');
    setToast("Ergaan Keessan Milkaa'inaan Ergameera (Message sent successfully)!");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[550px]">
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-[#0f1e36] text-white px-4 py-2.5 rounded-lg shadow-xl border border-amber-500/50 flex items-center gap-2 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Left Sidebar: Partner Contacts */}
      <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-black text-[#0f1e36] uppercase tracking-wider">
              Walqunnamtii Kallattii (Messages)
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Barsiisota, Maatii fi Bulchiinsa wajjin ergaa walii ergaa
          </p>
        </div>

        {/* Contacts list */}
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
          {potentialPartners.map(partner => {
            const isSelected = partner.id === activePartnerId;
            const lastMsg = messages.find(
              m => (m.senderId === partner.id && m.recipientId === currentUser.id) ||
                   (m.senderId === currentUser.id && m.recipientId === partner.id)
            );

            return (
              <button
                key={partner.id}
                onClick={() => setActivePartnerId(partner.id)}
                className={`w-full text-left p-3.5 transition flex items-start gap-3 ${
                  isSelected ? 'bg-amber-100/70 border-r-4 border-amber-500' : 'hover:bg-slate-100'
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  partner.role === 'admin' ? 'bg-rose-100 text-rose-800' :
                  partner.role === 'teacher' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {partner.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 truncate">
                      {partner.name}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                      partner.role === 'admin' ? 'bg-rose-50 text-rose-700' :
                      partner.role === 'teacher' ? 'bg-sky-50 text-sky-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {partner.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {lastMsg ? lastMsg.messageText : "Ergaa haaraa erguuf tuqi..."}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Chat Panel */}
      <div className="flex-1 flex flex-col bg-white">
        
        {/* Chat Partner Header */}
        {activePartner ? (
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0f1e36] text-white flex items-center justify-center font-black text-sm">
                {activePartner.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">
                  {activePartner.name}
                </h4>
                <div className="text-[10px] text-slate-500">
                  {activePartner.departmentOrGrade || activePartner.email} • ID: {activePartner.id}
                </div>
              </div>
            </div>

            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Toora Irra Jira (Online)
            </span>
          </div>
        ) : null}

        {/* Message Thread History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
          {conversation.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Inbox className="w-10 h-10 mb-2 stroke-1" />
              <p className="text-xs font-bold text-slate-600">Ammaaf ergaan hin jiru</p>
              <p className="text-[11px] text-slate-400">Ergaa jalqabaa barreessuun walqunnamtii eegalaa!</p>
            </div>
          ) : (
            conversation.slice().reverse().map(msg => {
              const isMine = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-md p-3.5 rounded-2xl text-xs ${
                    isMine
                      ? 'bg-[#0f1e36] text-white rounded-br-xs shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                  }`}>
                    {msg.subject && (
                      <div className={`font-bold text-[11px] pb-1 mb-1 border-b ${
                        isMine ? 'text-amber-300 border-white/20' : 'text-slate-900 border-slate-100'
                      }`}>
                        {msg.subject}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.messageText}</p>
                    <div className={`text-[9px] mt-1.5 flex items-center justify-end gap-1 ${
                      isMine ? 'text-slate-300' : 'text-slate-400'
                    }`}>
                      <span>{msg.timestamp}</span>
                      {isMine && <CheckCheck className="w-3 h-3 text-amber-400" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white">
          <div className="mb-2">
            <input
              type="text"
              value={messageSubject}
              onChange={(e) => setMessageSubject(e.target.value)}
              placeholder="Mata-duree ergaa (Subject)..."
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <textarea
              rows={2}
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder="Ergaa keessan asitti barreessaa (Type your message)..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
              required
            />
            <button
              type="submit"
              className="px-4 py-3 bg-[#0f1e36] hover:bg-slate-800 text-white rounded-xl font-black text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>Ergi</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
