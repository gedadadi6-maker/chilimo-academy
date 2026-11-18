import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  GraduationCap,
  Users,
  Lock,
  Unlock,
  KeyRound,
  CheckCircle2,
  ShieldCheck,
  Search,
  Copy,
  Check,
  RefreshCw,
  UserPlus,
  Eye,
  EyeOff,
  Save,
  Ban,
} from 'lucide-react';
import { Language, PortalAccessConfig, UserAccount } from '../types';
import {
  getStoredPortalAccessConfig,
  savePortalAccessConfig,
  getStoredUsers,
  saveAllUsers,
  adminResetUserPassword,
  adminToggleUserStatus,
  CHILIMO_INFO,
} from '../data/mockData';

interface PortalAccessControlPanelProps {
  currentLang: Language;
  currentAdmin: UserAccount;
  onUsersUpdated: () => void;
  onNotify: (msg: string) => void;
}

type PortalRoleFilter = 'all' | 'teacher' | 'student' | 'parent';

function generateRandomPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'CHA-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const PortalAccessControlPanel: React.FC<PortalAccessControlPanelProps> = ({
  currentLang,
  currentAdmin,
  onUsersUpdated,
  onNotify,
}) => {
  const [config, setConfig] = useState<PortalAccessConfig>(getStoredPortalAccessConfig);
  const [users, setUsers] = useState<UserAccount[]>(getStoredUsers);
  const [portalFilter, setPortalFilter] = useState<PortalRoleFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState(true);
  const [passwordDrafts, setPasswordDrafts] = useState<Record<string, string>>({});
  const [copiedUserId, setCopiedUserId] = useState<string | null>(null);

  // Quick New Portal User Provisioning State
  const [newRole, setNewRole] = useState<'teacher' | 'student' | 'parent'>('teacher');
  const [newName, setNewName] = useState('');
  const [newLoginId, setNewLoginId] = useState('');
  const [newDeptOrGrade, setNewDeptOrGrade] = useState('Department of Mathematics');
  const [newLinkedStudentId, setNewLinkedStudentId] = useState('151');
  const [newPhone, setNewPhone] = useState('0912305111');
  const [newPassword, setNewPassword] = useState(() => generateRandomPassword());
  const [newStatus, setNewStatus] = useState<'active' | 'suspended'>('active');

  useEffect(() => {
    const sync = () => {
      setConfig(getStoredPortalAccessConfig());
      setUsers(getStoredUsers());
    };
    window.addEventListener('chilimo:data-updated', sync);
    return () => window.removeEventListener('chilimo:data-updated', sync);
  }, []);

  const portalUsers = users.filter(
    (u) => u.role === 'teacher' || u.role === 'student' || u.role === 'parent'
  );

  const countByRole = (role: 'teacher' | 'student' | 'parent') => {
    const list = portalUsers.filter((u) => u.role === role);
    return {
      total: list.length,
      active: list.filter((u) => u.status !== 'suspended').length,
      suspended: list.filter((u) => u.status === 'suspended').length,
    };
  };

  const teacherStats = countByRole('teacher');
  const studentStats = countByRole('student');
  const parentStats = countByRole('parent');

  const handleTogglePortal = (
    key: 'teacherPortalEnabled' | 'studentPortalEnabled' | 'parentPortalEnabled',
    label: string
  ) => {
    const nextValue = !config[key];
    const updated: PortalAccessConfig = {
      ...config,
      [key]: nextValue,
      updatedAt: new Date().toISOString().slice(0, 10),
      updatedBy: currentAdmin.name,
    };
    setConfig(updated);
    savePortalAccessConfig(updated);
    onNotify(
      nextValue
        ? `${label}: Hayyamameera (Portal Access Permitted)!`
        : `${label}: Yeroof Cufameera (Portal Locked by Admin)!`
    );
  };

  const handleSaveMessages = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PortalAccessConfig = {
      ...config,
      updatedAt: new Date().toISOString().slice(0, 10),
      updatedBy: currentAdmin.name,
    };
    setConfig(updated);
    savePortalAccessConfig(updated);
    onNotify('Ergaan cufinsa portaalotaa milkaa\'inaan olkaa\'ameera!');
  };

  const handleSaveUserPassword = (user: UserAccount) => {
    const draft = (passwordDrafts[user.id] ?? user.password ?? '123').trim();
    if (!draft) {
      onNotify('Maaloo passwordii duwwaa hin galchinaa.');
      return;
    }
    const res = adminResetUserPassword(user.id, draft);
    if (res.ok) {
      setUsers(getStoredUsers());
      onUsersUpdated();
      onNotify(`Passwordiin ${user.name} (ID: ${user.id}) gara "${draft}"tti kennameera!`);
    }
  };

  const handleGenerateForUser = (user: UserAccount) => {
    const generated = generateRandomPassword();
    setPasswordDrafts((prev) => ({ ...prev, [user.id]: generated }));
    const res = adminResetUserPassword(user.id, generated);
    if (res.ok) {
      setUsers(getStoredUsers());
      onUsersUpdated();
      onNotify(`Passwordiin haaraan ${generated} ${user.name}f qophaa'eera!`);
    }
  };

  const handleToggleAccountPermission = (user: UserAccount) => {
    const res = adminToggleUserStatus(user.id);
    if (res.ok && res.user) {
      setUsers(getStoredUsers());
      onUsersUpdated();
      onNotify(
        res.user.status === 'active'
          ? `${user.name} (ID: ${user.id}): Seensi Portal Eeyyamameera (Permitted)!`
          : `${user.name} (ID: ${user.id}): Seensi Portal Dhorkameera (Suspended)!`
      );
    }
  };

  const handleCopyCredentials = (u: UserAccount) => {
    const pass = passwordDrafts[u.id] ?? u.password ?? '123';
    const portalTitle =
      u.role === 'teacher'
        ? 'Teacher & Faculty Portal'
        : u.role === 'student'
        ? 'Student & Admissions Portal'
        : 'Parent & Guardian Gateway';
    const text = `CHILIMO ACADEMY — ${portalTitle}\nName: ${u.name}\nLogin ID: ${u.id}\nPassword: ${pass}\nStatus: ${
      u.status === 'suspended' ? 'Suspended' : 'Active (Permitted)'
    }`;
    navigator.clipboard.writeText(text);
    setCopiedUserId(u.id);
    setTimeout(() => setCopiedUserId(null), 1800);
    onNotify(`ID fi Passwordiin ${u.name} copy ta'eera!`);
  };

  const handleCreatePortalAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPassword.trim()) return;

    const existing = getStoredUsers();
    const candidateId =
      newLoginId.trim() || String(Math.floor(200 + Math.random() * 790));

    if (existing.some((u) => u.id.toLowerCase() === candidateId.toLowerCase())) {
      onNotify(`Login ID "${candidateId}" dursee jira. Maaloo ID biraa filadhaa.`);
      return;
    }

    const createdUser: UserAccount = {
      id: candidateId,
      systemId: `CHA-${newRole.slice(0, 3).toUpperCase()}-${candidateId}`,
      name: newName.trim(),
      email: `${newName.trim().toLowerCase().replace(/\s+/g, '.')}@chilimo.edu.et`,
      role: newRole,
      status: newStatus,
      dateCreated: new Date().toISOString().slice(0, 10),
      departmentOrGrade:
        newRole === 'parent'
          ? `Guardian of Student ID: ${newLinkedStudentId}`
          : newDeptOrGrade,
      studentIdLinked: newRole === 'parent' ? newLinkedStudentId : undefined,
      password: newPassword.trim(),
      phone: newPhone.trim() || CHILIMO_INFO.phone,
    };

    const updated = [createdUser, ...existing];
    saveAllUsers(updated);
    setUsers(updated);
    onUsersUpdated();
    setNewName('');
    setNewLoginId('');
    setNewPassword(generateRandomPassword());
    onNotify(
      `Akkawuntiin ${newRole.toUpperCase()} (${createdUser.name} · ID: ${createdUser.id} · Pass: ${createdUser.password}) uumameera!`
    );
  };

  const filteredUsers = portalUsers.filter((u) => {
    const matchesRole = portalFilter === 'all' || u.role === portalFilter;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      u.id.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      (u.departmentOrGrade || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  const portalCardsMeta = [
    {
      key: 'teacherPortalEnabled' as const,
      title: 'Teacher & Faculty Portal',
      subtitleOm: 'Portal Barsiisotaa',
      enabled: config.teacherPortalEnabled,
      stats: teacherStats,
      icon: Briefcase,
      accent: 'teal',
    },
    {
      key: 'studentPortalEnabled' as const,
      title: 'Student & Admissions Portal',
      subtitleOm: 'Portal Barattootaa fi Galmee',
      enabled: config.studentPortalEnabled,
      stats: studentStats,
      icon: GraduationCap,
      accent: 'blue',
    },
    {
      key: 'parentPortalEnabled' as const,
      title: 'Parent & Guardian Gateway',
      subtitleOm: 'Portal Maatii fi Guddistootaa',
      enabled: config.parentPortalEnabled,
      stats: parentStats,
      icon: Users,
      accent: 'amber',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. MASTER PORTAL ACCESS SWITCHES */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0b172a] text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0f1e36]">
                Hayyama Portaalota 3n (Portal Access Gatekeeper)
              </h3>
              <p className="text-xs text-slate-500">
                {currentLang === 'om'
                  ? 'Barsiisonni, Barattoonni fi Maatiin yeroo barbaaddanitti akka seenan eeyyamaa yookaan cufaa.'
                  : 'Permit or lock login access for Teacher Portal, Student & Admissions Portal, and Parent & Guardian Gateway.'}
              </p>
            </div>
          </div>
          {config.updatedAt && (
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
              Updated: {config.updatedAt}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {portalCardsMeta.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.key}
                className={`rounded-xl border p-5 flex flex-col justify-between transition-all ${
                  portal.enabled
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-rose-50/50 border-rose-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-[#0b172a] text-amber-400 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold inline-flex items-center gap-1 ${
                        portal.enabled
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {portal.enabled ? (
                        <>
                          <Unlock className="w-3 h-3" />
                          <span>Eeyyamame (Open)</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>Cufame (Locked)</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h4 className="font-serif text-base font-bold text-[#0b172a]">
                    {portal.title}
                  </h4>
                  <div className="text-xs text-slate-500 mt-0.5">{portal.subtitleOm}</div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs tabular-nums">
                    <span className="text-slate-600">
                      Active: <strong className="text-emerald-700">{portal.stats.active}</strong> /{' '}
                      {portal.stats.total}
                    </span>
                    {portal.stats.suspended > 0 && (
                      <span className="text-rose-700 font-semibold">
                        {portal.stats.suspended} Suspended
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleTogglePortal(portal.key, portal.title)}
                  className={`mt-4 w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    portal.enabled
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {portal.enabled ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Yeroof Cufi (Lock Portal)</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Seensa Eeyyami (Allow Portal)</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Custom Lock Message Settings */}
        <form onSubmit={handleSaveMessages} className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Ergaa Yeroo Cufamu (Afaan Oromoo)
            </label>
            <input
              type="text"
              value={config.lockedMessageOm}
              onChange={(e) => setConfig({ ...config, lockedMessageOm: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>
          <div className="md:col-span-5">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Locked Portal Notice (English)
            </label>
            <input
              type="text"
              value={config.lockedMessageEn}
              onChange={(e) => setConfig({ ...config, lockedMessageEn: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-2 px-3 bg-[#0f1e36] hover:bg-[#1a3156] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-amber-400" />
              <span>Olkaa&apos;i</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. PROVISION NEW PORTAL CREDENTIAL (TEACHER / STUDENT / PARENT) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
          <UserPlus className="w-5 h-5 text-amber-600" />
          <div>
            <h3 className="font-serif text-base font-bold text-[#0f1e36]">
              Akkawuntii fi Passwordii Haaraa Kenni (Issue Portal Login)
            </h3>
            <p className="text-xs text-slate-500">
              Barsiisaa, Barataa yookaan Maatiidhaaf ID fi Passwordii haaraa uumaa eeyyama kennaaf.
            </p>
          </div>
        </div>

        <form onSubmit={handleCreatePortalAccount} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Portal Filadhaa *</label>
            <select
              value={newRole}
              onChange={(e) => {
                const role = e.target.value as 'teacher' | 'student' | 'parent';
                setNewRole(role);
                if (role === 'teacher') setNewDeptOrGrade('Department of Mathematics');
                if (role === 'student') setNewDeptOrGrade('Grade 7 - Section A');
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
            >
              <option value="teacher">Teacher Portal (Barsiisaa)</option>
              <option value="student">Student &amp; Admissions Portal (Barataa)</option>
              <option value="parent">Parent &amp; Guardian Gateway (Maatii)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Maqaa Guutuu (Full Name) *</label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Obbo Tolasaa Guddataa"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Login ID (Optional - Auto)
            </label>
            <input
              type="text"
              value={newLoginId}
              onChange={(e) => setNewLoginId(e.target.value)}
              placeholder="e.g. 205 (or leave blank)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
            />
          </div>

          {newRole === 'parent' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Linked Student ID (Barataa)
              </label>
              <input
                type="text"
                value={newLinkedStudentId}
                onChange={(e) => setNewLinkedStudentId(e.target.value)}
                placeholder="e.g. 151"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {newRole === 'teacher' ? 'Department / Subject' : 'Kutaa (Grade Level)'}
              </label>
              <input
                type="text"
                value={newDeptOrGrade}
                onChange={(e) => setNewDeptOrGrade(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bilbila (Phone)</label>
            <input
              type="text"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Passwordii Kennamu *</label>
            <div className="flex gap-1.5">
              <input
                type="text"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold"
              />
              <button
                type="button"
                onClick={() => setNewPassword(generateRandomPassword())}
                className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 cursor-pointer"
                title="Generate random password"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Haala Eeyyamaa (Permission)</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as 'active' | 'suspended')}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
            >
              <option value="active">Eeyyamame (Active Now)</option>
              <option value="suspended">Yeroof Dhorkame (Pending/Hold)</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#0f1e36] hover:bg-[#1a3156] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer border border-amber-400/30"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Uumi &amp; Password Kenni</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. PER-USER PASSWORD ISSUER & PERMISSION DIRECTORY */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#0f1e36]">
              To&apos;annoo Passwordii fi Eeyyama Tokkoo Tokkoo (User Credentials &amp; Permissions)
            </h3>
            <p className="text-xs text-slate-500">
              Passwordii haaraa kennuuf yookaan eeyyama seensaa (Active / Suspended) to&apos;achuuf fayyadamaa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
            >
              {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPasswords ? 'Hide Passwords' : 'Show Passwords'}</span>
            </button>
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ID, name, phone..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', label: `All Portals (${portalUsers.length})` },
                { id: 'teacher', label: `Teacher Portal (${teacherStats.total})` },
                { id: 'student', label: `Student Portal (${studentStats.total})` },
                { id: 'parent', label: `Parent Gateway (${parentStats.total})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPortalFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  portalFilter === tab.id
                    ? 'bg-[#0f1e36] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">ID &amp; Name</th>
                <th className="py-3 px-4">Portal</th>
                <th className="py-3 px-4">Permission (Eeyyama)</th>
                <th className="py-3 px-4">Assign Custom Password</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const currentPass = u.password || '123';
                const draftVal = passwordDrafts[u.id] ?? currentPass;
                const isSuspended = u.status === 'suspended';
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 tabular-nums">
                          {u.id}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {u.departmentOrGrade || 'General'} · {u.phone || CHILIMO_INFO.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize ${
                          u.role === 'teacher'
                            ? 'bg-teal-100 text-teal-800'
                            : u.role === 'student'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {u.role === 'teacher'
                          ? 'Teacher Portal'
                          : u.role === 'student'
                          ? 'Student Portal'
                          : 'Parent Gateway'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleAccountPermission(u)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer border transition-colors ${
                          !isSuspended
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
                        }`}
                        title="Click to permit or suspend portal access"
                      >
                        {!isSuspended ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Eeyyamame (Active)</span>
                          </>
                        ) : (
                          <>
                            <Ban className="w-3.5 h-3.5 text-rose-600" />
                            <span>Dhorkame (Suspended)</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 max-w-xs">
                        <input
                          type={showPasswords ? 'text' : 'password'}
                          value={draftVal}
                          onChange={(e) =>
                            setPasswordDrafts((prev) => ({ ...prev, [u.id]: e.target.value }))
                          }
                          className="w-32 px-2.5 py-1 bg-white border border-slate-300 rounded font-mono text-xs font-bold text-slate-900"
                          aria-label={`Password for ${u.name}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveUserPassword(u)}
                          className="px-2.5 py-1 bg-[#0f1e36] hover:bg-[#1a3156] text-white rounded text-[11px] font-bold cursor-pointer whitespace-nowrap"
                        >
                          Kenni
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGenerateForUser(u)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 cursor-pointer"
                          title="Auto-generate & save random password"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleCopyCredentials(u)}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        {copiedUserId === u.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-700" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy ID &amp; Pass</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
