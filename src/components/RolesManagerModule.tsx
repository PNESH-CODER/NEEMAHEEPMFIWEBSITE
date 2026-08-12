import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Sliders, Shield, ShieldCheck, ShieldAlert, Users, UserCheck, UserX, UserPlus, 
  CheckCircle2, XCircle, Search, Filter, Plus, Trash2, Edit3, Eye, Copy, Check, 
  RefreshCw, ChevronRight, CheckSquare, X, Info, Wand2, Layers, AlertCircle, 
  ArrowRight, GitBranch, Key, Lock, Unlock, FileText, Download, Zap, Globe, SmartphoneNfc, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ================= TYPES & INTERFACES =================
export interface EnterpriseRole {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  userCount: number;
  permissionsCount: number;
  color: string;
  category: 'System' | 'Editorial' | 'Operations' | 'Custom';
  canManageUsers: boolean;
  canManageRoles: boolean;
  canManageSecurity: boolean;
  canManageContent: boolean;
  parentRoleId?: string;
}

export interface UserRoleMapping {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Disabled' | 'Pending';
  assignedDate: string;
  assignedBy: string;
  hasCustomOverrides: boolean;
}

export interface PermissionOverride {
  id: string;
  userId: string;
  username: string;
  moduleId: string;
  moduleName: string;
  action: string;
  type: 'Grant' | 'Revoke';
  reason: string;
  grantedBy: string;
  grantedDate: string;
}

export interface RolesAuditLog {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  targetRoleOrUser: string;
  details: string;
  status: 'Success' | 'Warning';
}

// ================= CONSTANTS =================
export const CMS_MODULES = [
  { id: 'mod_articles', name: 'Articles & Content' },
  { id: 'mod_media', name: 'Media Library (DAM)' },
  { id: 'mod_categories', name: 'Categories & Tags' },
  { id: 'mod_comments', name: 'Comments & Moderation' },
  { id: 'mod_beneficiaries', name: 'Beneficiaries & Loans' },
  { id: 'mod_vacancies', name: 'Careers & Vacancies' },
  { id: 'mod_analytics', name: 'Analytics & Reports' },
  { id: 'mod_roles', name: 'Roles & Permissions' },
  { id: 'mod_security', name: 'Security & Auth Policies' },
  { id: 'mod_system', name: 'System Settings & Backups' },
];

export const PERMISSION_ACTIONS = [
  'View', 'Create', 'Edit', 'Delete', 'Publish', 'Moderate', 'Approve', 'Configure', 'Export'
];

const INITIAL_ROLES: EnterpriseRole[] = [
  {
    id: 'role-1',
    name: 'Site Administrator',
    description: 'Full unrestricted system administration access across all CMS modules, roles, and security policies.',
    isDefault: true,
    userCount: 2,
    permissionsCount: 224,
    color: '#074504',
    category: 'System',
    canManageUsers: true,
    canManageRoles: true,
    canManageSecurity: true,
    canManageContent: true,
  },
  {
    id: 'role-2',
    name: 'Editor',
    description: 'Full editorial control over articles, media, categories, comments moderation, and publishing workflows.',
    isDefault: true,
    userCount: 4,
    permissionsCount: 128,
    color: '#C0991B',
    category: 'Editorial',
    canManageUsers: false,
    canManageRoles: false,
    canManageSecurity: false,
    canManageContent: true,
  },
  {
    id: 'role-3',
    name: 'Author',
    description: 'Create, edit, and publish own articles, manage assigned publishing workflows, upload media, and submit content for editorial review.',
    isDefault: true,
    userCount: 8,
    permissionsCount: 54,
    color: '#2563EB',
    category: 'Editorial',
    canManageUsers: false,
    canManageRoles: false,
    canManageSecurity: false,
    canManageContent: true,
    parentRoleId: 'role-2',
  },
  {
    id: 'role-4',
    name: 'Webmaster',
    description: 'Manage comment moderation, beneficiary stories, vacancies, SEO tags, and public website pages.',
    isDefault: true,
    userCount: 3,
    permissionsCount: 86,
    color: '#059669',
    category: 'Operations',
    canManageUsers: false,
    canManageRoles: false,
    canManageSecurity: false,
    canManageContent: true,
  },
];

const INITIAL_USER_MAPPINGS: UserRoleMapping[] = [
  {
    id: 'usr-1',
    username: 'ptrckmunene@gmail.com',
    name: 'Patrick Munene',
    email: 'ptrckmunene@gmail.com',
    role: 'Superadmin',
    department: 'Executive Administration',
    status: 'Active',
    assignedDate: '2025-01-10',
    assignedBy: 'System Initializer',
    hasCustomOverrides: false,
  },
  {
    id: 'usr-2',
    username: 'muthonichar12@gmail.com',
    name: 'Charity Muthoni',
    email: 'muthonichar12@gmail.com',
    role: 'Author',
    department: 'CMS Editorial',
    status: 'Active',
    assignedDate: '2025-03-15',
    assignedBy: 'Patrick Munene',
    hasCustomOverrides: false,
  },
];

const INITIAL_AUDIT_LOGS: RolesAuditLog[] = [
  {
    id: 'audit-1',
    timestamp: '2026-07-31 14:40:12',
    event: 'Role Permission Toggled',
    actor: 'admin_neema1',
    targetRoleOrUser: 'Role: Editor',
    details: 'Enabled comment deletion rights across Editor role.',
    status: 'Success',
  },
  {
    id: 'audit-2',
    timestamp: '2026-07-31 11:20:00',
    event: 'User Role Reassigned',
    actor: 'admin_neema1',
    targetRoleOrUser: 'User: Grace Wanjiku',
    details: 'Promoted from Author to Editor.',
    status: 'Success',
  },
  {
    id: 'audit-3',
    timestamp: '2026-07-28 09:15:30',
    event: 'Custom Role Created',
    actor: 'admin_neema1',
    targetRoleOrUser: 'Role: Auditor',
    details: 'Created custom role for beneficiary loan audit access.',
    status: 'Success',
  },
];

export default function RolesManagerModule({ className = '' }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'roles_list' | 'permissions_matrix' | 'user_assignments' | 'audit_log'
  >('overview');

  // Master State
  const [roles, setRoles] = useState<EnterpriseRole[]>(INITIAL_ROLES);
  const [userMappings, setUserMappings] = useState<UserRoleMapping[]>(INITIAL_USER_MAPPINGS);
  const [auditLogs, setAuditLogs] = useState<RolesAuditLog[]>(INITIAL_AUDIT_LOGS);

  // New User Creation Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Superadmin' | 'Author' | 'Editor' | 'Moderator'>('Author');
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);

  // Sync with Supabase user_roles
  const fetchSupabaseUserRoles = async () => {
    try {
      const { data, error } = await supabase.from('user_roles').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        const mapped: UserRoleMapping[] = data.map((u: any) => ({
          id: u.id,
          username: u.email,
          name: u.user_name || u.email.split('@')[0],
          email: u.email,
          role: u.role,
          department: u.department || (u.role === 'Superadmin' ? 'Executive Administration' : 'CMS Editorial'),
          status: u.status || 'Active',
          assignedDate: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : '2026-08-12',
          assignedBy: u.assigned_by || 'Patrick Munene',
          hasCustomOverrides: false,
        }));
        setUserMappings(mapped);
      }
    } catch (err) {
      console.warn("Supabase user roles fetch notice:", err);
    }
  };

  useEffect(() => {
    fetchSupabaseUserRoles();
  }, []);

  // Modal States
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleCategory, setNewRoleCategory] = useState<'Custom' | 'Editorial' | 'Operations'>('Custom');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('role-[#C0991B]');
  const [matrixRoleFilter, setMatrixRoleFilter] = useState<string>('role-2');

  // Interactive Permission Matrix State: [roleId][moduleId][action] = boolean
  const [permissionMatrix, setPermissionMatrix] = useState<Record<string, Record<string, Record<string, boolean>>>>(() => {
    const matrix: Record<string, Record<string, Record<string, boolean>>> = {};
    INITIAL_ROLES.forEach(role => {
      matrix[role.id] = {};
      CMS_MODULES.forEach(mod => {
        matrix[role.id][mod.id] = {};
        PERMISSION_ACTIONS.forEach(act => {
          if (role.id === 'role-1') {
            matrix[role.id][mod.id][act] = true;
          } else if (role.id === 'role-2') {
            matrix[role.id][mod.id][act] = ['View', 'Create', 'Edit', 'Publish', 'Moderate', 'Approve'].includes(act) && !mod.id.includes('security') && !mod.id.includes('system');
          } else if (role.id === 'role-3') {
            matrix[role.id][mod.id][act] = ['View', 'Create', 'Edit', 'Publish'].includes(act) && mod.id === 'mod_articles';
          } else if (role.id === 'role-4') {
            matrix[role.id][mod.id][act] = act === 'View' || (act === 'Moderate' && mod.id === 'mod_comments');
          } else {
            matrix[role.id][mod.id][act] = act === 'View' && (mod.id === 'mod_beneficiaries' || mod.id === 'mod_analytics');
          }
        });
      });
    });
    return matrix;
  });

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const logAuditEvent = (event: string, targetRoleOrUser: string, details: string) => {
    const log: RolesAuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      event,
      actor: 'admin_neema1',
      targetRoleOrUser,
      details,
      status: 'Success',
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Handlers
  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName) return;
    const roleId = `role-${Date.now()}`;
    const newRole: EnterpriseRole = {
      id: roleId,
      name: newRoleName,
      description: newRoleDesc || 'Custom enterprise role definition.',
      isDefault: false,
      userCount: 0,
      permissionsCount: 18,
      color: '#8B5CF6',
      category: newRoleCategory,
      canManageUsers: false,
      canManageRoles: false,
      canManageSecurity: false,
      canManageContent: true,
    };

    // Initialize matrix for new role
    setPermissionMatrix(prev => {
      const next = { ...prev };
      next[roleId] = {};
      CMS_MODULES.forEach(m => {
        next[roleId][m.id] = {};
        PERMISSION_ACTIONS.forEach(act => {
          next[roleId][m.id][act] = act === 'View';
        });
      });
      return next;
    });

    setRoles(prev => [...prev, newRole]);
    setNewRoleName('');
    setNewRoleDesc('');
    setShowCreateRoleModal(false);
    showToast(`Role "${newRoleName}" created successfully.`);
    logAuditEvent('Role Created', `Role: ${newRoleName}`, `Created new ${newRoleCategory} role with standard view rights.`);
  };

  const handleDeleteRole = (roleId: string, roleName: string) => {
    if (roles.find(r => r.id === roleId)?.isDefault) {
      showToast('System default roles cannot be deleted.', 'error');
      return;
    }
    setRoles(prev => prev.filter(r => r.id !== roleId));
    showToast(`Deleted role "${roleName}".`);
    logAuditEvent('Role Deleted', `Role: ${roleName}`, `Removed custom role definition.`);
  };

  const handleTogglePermission = (roleId: string, moduleId: string, action: string) => {
    setPermissionMatrix(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next[roleId]) next[roleId] = {};
      if (!next[roleId][moduleId]) next[roleId][moduleId] = {};
      next[roleId][moduleId][action] = !next[roleId][moduleId][action];
      return next;
    });
    showToast('Permission matrix updated in memory cache.');
  };

  const handleSetModuleAllPermissions = (roleId: string, moduleId: string, value: boolean) => {
    setPermissionMatrix(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next[roleId]) next[roleId] = {};
      next[roleId][moduleId] = {};
      PERMISSION_ACTIONS.forEach(act => {
        next[roleId][moduleId][act] = value;
      });
      return next;
    });
    showToast(`Updated all permissions for module in role.`);
  };

  const handleReassignUserRole = (userId: string, newRole: string) => {
    setUserMappings(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    showToast(`Reassigned user to role "${newRole}".`);
    logAuditEvent('User Role Reassigned', `User ID: ${userId}`, `Updated role mapping to ${newRole}`);
  };

  // Public Login Test Bench State
  const [publicOtpPhone, setPublicOtpPhone] = useState('');
  const [otpMsg, setOtpMsg] = useState<string | null>(null);

  const handleSendPublicTestOtp = () => {
    if (!publicOtpPhone) return;
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpMsg(`Test OTP (${generated}) dispatched to ${publicOtpPhone} via Neema M-PESA SMS Gateway!`);
    setTimeout(() => setOtpMsg(null), 8000);
  };

  // Metrics
  const totalRoles = roles.length;
  const totalUsersMapped = userMappings.length;

  const SUB_TABS = [
    { id: 'overview', label: 'Overview', icon: Sliders, badge: 'Overview' },
    { id: 'permissions_matrix', label: 'Permission Matrix', icon: ShieldCheck, badge: 'Matrix' },
    { id: 'user_assignments', label: 'User Mappings', icon: Users, badge: `${totalUsersMapped}` },
    { id: 'audit_log', label: 'Audit Log', icon: FileText, badge: `${auditLogs.length}` },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* MODULE HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#074504] text-white rounded-2xl border border-[#C0991B]/30 shadow-lg p-6 md:p-8 space-y-4">
        {/* 1. Title */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-[#C0991B] shrink-0" />
            <span>ROLE MANAGEMENT MODULE</span>
          </h2>
          <span className="px-3 py-1 bg-[#C0991B] text-[#074504] text-[10px] font-black rounded-full uppercase shadow-xs">
            Access Control
          </span>
        </div>

        {/* 2. Description Text */}
        <p className="text-xs md:text-sm text-gray-200 font-medium leading-relaxed max-w-4xl">
          Comprehensive role definitions, module-level permission matrix, publishing workflows, and audit logging for seamless access control.
        </p>

        {/* 3. CTA buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setShowCreateRoleModal(true)}
            className="px-4 py-2.5 bg-[#C0991B] hover:bg-[#a88414] text-[#074504] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Create Custom Role
          </button>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl border bg-emerald-50 border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 shadow-md"
          >
            <div className="flex items-center gap-2 text-xs font-black uppercase">
              <CheckCircle2 className="w-4 h-4 text-[#074504]" />
              <span>{toast.msg}</span>
            </div>
            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUB-TABS */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {SUB_TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                isActive
                  ? 'bg-[#074504] text-white border-[#074504] shadow-xs'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C0991B]' : 'text-gray-500'}`} />
              <span>{tab.label}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black ${
                isActive ? 'bg-[#C0991B] text-[#074504]' : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: OVERVIEW DASHBOARD ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-white p-4.5 rounded-2xl border-t-4 border-t-[#074504] border-x border-b border-gray-200 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-wider">Defined Roles</span>
                <Shield className="w-5 h-5 text-[#074504]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#074504]">{totalRoles} Roles</span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-[#C0991B]/30">4 Default</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">Site Admin, Editor, Author & Webmaster</p>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-wider">Permission Matrix Scope</span>
                <ShieldCheck className="w-5 h-5 text-[#C0991B]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-900">10 Modules</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">9 Actions</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">90 Granular Rights per Role</p>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border-t-4 border-t-blue-600 border-x border-b border-gray-200 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-wider">User-Role Mappings</span>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-900">{totalUsersMapped} Users</span>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">100% Mapped</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">Mapped to Executive & Editorial Staff</p>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border-t-4 border-t-purple-600 border-x border-b border-gray-200 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-wider">Publishing Workflows</span>
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-900">Active</span>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">Author & Editor</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">Article publishing permissions enabled for authors</p>
            </div>
          </div>

          {/* MAIN GRID - DENSE AND BALANCED TO MINIMIZE BLANK SPACES */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* ROLE CARDS QUICK VIEW */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <h3 className="font-black text-xs text-[#074504] uppercase flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#C0991B]" /> Enterprise Role Catalog
                  </h3>
                  <button
                    onClick={() => setActiveTab('roles_list')}
                    className="text-xs font-bold text-[#074504] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View All Roles <ChevronRight className="w-3.5 h-3.5 text-[#C0991B]" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roles.map(r => (
                    <div key={r.id} className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-2 hover:border-[#C0991B] transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#074504] uppercase flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                          {r.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-gray-200 rounded-full text-gray-700">
                          {r.userCount} Users
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 leading-relaxed font-medium line-clamp-2">{r.description}</p>
                      <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[10px] font-bold text-gray-500">
                        <span>{r.permissionsCount} Rights</span>
                        <span className="text-[#C0991B] font-black">{r.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AUDIT TRAIL */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <h3 className="font-black text-xs text-[#074504] uppercase flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#C0991B]" /> Recent Audit Trail
                  </h3>
                  <button
                    onClick={() => setActiveTab('audit_log')}
                    className="text-xs font-bold text-[#074504] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View Full Log <ChevronRight className="w-3.5 h-3.5 text-[#C0991B]" />
                  </button>
                </div>

                <div className="space-y-2">
                  {auditLogs.slice(0, 3).map(log => (
                    <div key={log.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="font-black text-[#074504] block">{log.event} ({log.targetRoleOrUser})</span>
                        <span className="text-gray-600 font-medium text-[11px]">{log.details}</span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR: ROLE ACCESS RISK & MATRIX HEALTH MONITOR */}
            <div className="space-y-4">
              {/* 1. Role Matrix Health & Access Integrity Sentinel */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="font-black text-xs text-[#074504] uppercase flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#C0991B]" /> Matrix Health Monitor
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Synced
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="font-bold text-gray-700">Active Mapped Roles</span>
                    <span className="font-black text-[#074504]">{roles.length} Roles</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="font-bold text-gray-700">Privilege Drift Alert</span>
                    <span className="font-black text-emerald-600">None (0)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <h4 className="font-black text-xs text-[#074504] uppercase border-b border-gray-100 pb-2">Quick Navigation</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('permissions_matrix')}
                    className="w-full p-2.5 bg-gray-50 hover:bg-amber-50 hover:border-[#C0991B]/50 text-[#074504] font-bold text-xs rounded-xl border border-gray-200 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <span>Edit Permission Matrix</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C0991B]" />
                  </button>

                  <button
                    onClick={() => setActiveTab('user_assignments')}
                    className="w-full p-2.5 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 text-[#074504] font-bold text-xs rounded-xl border border-gray-200 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <span>Map User Roles</span>
                    <Users className="w-3.5 h-3.5 text-[#C0991B]" />
                  </button>

                  <button
                    onClick={() => setActiveTab('audit_log')}
                    className="w-full p-2.5 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 text-[#074504] font-bold text-xs rounded-xl border border-gray-200 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <span>View Audit Logs</span>
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                  </button>
                </div>
              </div>

              <div className="bg-amber-50/80 p-4 rounded-2xl border border-[#C0991B]/30 space-y-1.5 text-xs text-amber-900">
                <span className="font-black uppercase text-[10px] tracking-wider text-[#074504] block">Role Security Tip</span>
                <p className="text-[11px] font-medium leading-relaxed">
                  Roles take effect immediately across all logged-in CMS administrators without requiring a session restart.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}



      {/* ================= TAB 3: PERMISSION MATRIX ================= */}
      {activeTab === 'permissions_matrix' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Bar with Add Role Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <div>
              <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C0991B]" /> Enterprise Permission Matrix & Role Manager
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Configure module-level action rights across default system roles and add custom roles
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setShowCreateRoleModal(true)}
                className="px-4 py-2.5 bg-[#074504] text-[#C0991B] hover:bg-[#053203] font-black text-xs uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#C0991B]" />
                <span>+ Add New Role</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#074504] font-black text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-gray-200 shadow-xs"
              >
                <X className="w-4 h-4 text-gray-500" />
                <span>Exit Matrix</span>
              </button>
            </div>
          </div>

          {/* Role Cards Grid formatted as Role Manager covering all default & custom roles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black text-[#074504] uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#C0991B]" /> Select Role to Edit Matrix Rights ({roles.length} Roles)
              </span>
              <span className="text-[11px] text-gray-500 font-medium">Click any role card below to switch matrix view</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {roles.map(r => {
                const isSelected = matrixRoleFilter === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setMatrixRoleFilter(r.id)}
                    className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer relative space-y-2.5 ${
                      isSelected
                        ? 'border-2 border-[#074504] ring-2 ring-[#C0991B]/40 shadow-md bg-emerald-50/20'
                        : 'border-gray-200 hover:border-[#C0991B] shadow-xs hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                        <h4 className="font-black text-xs text-[#074504] truncate">{r.name}</h4>
                      </div>
                      {r.isDefault ? (
                        <span className="px-1.5 py-0.5 bg-amber-50 text-[#826507] text-[8px] font-black rounded-md border border-[#C0991B]/30 uppercase shrink-0">
                          Default
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-purple-50 text-purple-800 text-[8px] font-black rounded-md border border-purple-200 uppercase shrink-0">
                          Custom
                        </span>
                      )}
                    </div>

                    <p className="text-[10.5px] text-gray-500 font-medium line-clamp-2 leading-tight">{r.description}</p>

                    <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[10px] font-bold">
                      <span className="text-gray-500">{r.userCount} Users</span>
                      <span className="text-[#074504] font-black">{r.permissionsCount} Rights</span>
                    </div>

                    {isSelected && (
                      <div className="bg-[#074504] text-[#C0991B] text-[9px] font-black uppercase text-center py-1 rounded-lg flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#C0991B]" /> Matrix Selected
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Matrix Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: roles.find(r => r.id === matrixRoleFilter)?.color || '#074504' }} />
                <h4 className="font-black text-sm text-[#074504]">
                  Permission Matrix Rights for: <span className="text-[#C0991B] uppercase">{roles.find(r => r.id === matrixRoleFilter)?.name}</span>
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    CMS_MODULES.forEach(m => handleSetModuleAllPermissions(matrixRoleFilter, m.id, true));
                    showToast('Granted all permissions across all modules for role.');
                  }}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#074504] rounded-xl text-xs font-bold uppercase transition-all cursor-pointer border border-emerald-200"
                >
                  Grant All Rights
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Saved permission matrix configuration for role!')}
                  className="px-4 py-1.5 bg-[#074504] text-[#C0991B] hover:bg-[#053203] rounded-xl text-xs font-black uppercase transition-all cursor-pointer shadow-xs"
                >
                  Save Matrix Changes
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black text-gray-500 uppercase">
                    <th className="px-3 py-2.5">CMS Module</th>
                    {PERMISSION_ACTIONS.map(action => (
                      <th key={action} className="px-1.5 py-2.5 text-center">{action}</th>
                    ))}
                    <th className="px-2 py-2.5 text-right">Toggle All</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {CMS_MODULES.map(mod => {
                    const roleMatrix = permissionMatrix[matrixRoleFilter]?.[mod.id] || {};
                    const allChecked = PERMISSION_ACTIONS.every(act => !!roleMatrix[act]);

                    return (
                      <tr key={mod.id} className="hover:bg-gray-50/80">
                        <td className="px-3 py-2.5 font-bold text-[#074504] text-xs whitespace-nowrap">
                          {mod.name}
                        </td>
                        {PERMISSION_ACTIONS.map(action => {
                          const checked = !!roleMatrix[action];
                          return (
                            <td key={action} className="px-1.5 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleTogglePermission(matrixRoleFilter, mod.id, action)}
                                className={`w-5.5 h-5.5 rounded-md inline-flex items-center justify-center transition-all cursor-pointer ${
                                  checked 
                                    ? 'bg-[#074504] text-[#C0991B] shadow-xs' 
                                    : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
                                }`}
                              >
                                {checked ? <Check className="w-3 h-3 stroke-[3]" /> : <X className="w-2.5 h-2.5" />}
                              </button>
                            </td>
                          );
                        })}
                        <td className="px-2 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleSetModuleAllPermissions(matrixRoleFilter, mod.id, !allChecked)}
                            className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[9.5px] uppercase rounded-md cursor-pointer whitespace-nowrap"
                          >
                            {allChecked ? 'Uncheck All' : 'Check All'}
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
      )}

      {/* ================= TAB 4: USER ASSIGNMENTS ================= */}
      {activeTab === 'user_assignments' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                <Users className="w-4 h-4 text-[#C0991B]" /> User-Role Mapping Directory (Supabase Backend)
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Note: CMS Users can only be created and assigned by the Superadmin.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2.5 bg-[#074504] text-[#C0991B] font-black text-xs uppercase tracking-wider rounded-xl hover:bg-[#053203] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <UserPlus className="w-4 h-4 text-[#C0991B]" /> Register New CMS User
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black text-gray-500 uppercase">
                  <th className="p-4">User Details</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Reassign Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {userMappings.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/80">
                    <td className="p-4 font-bold">
                      <div className="text-[#074504] font-black flex items-center gap-1.5">
                        {u.role === 'Superadmin' ? <Shield className="w-3.5 h-3.5 text-[#C0991B]" /> : <UserCheck className="w-3.5 h-3.5 text-[#2563EB]" />}
                        {u.name}
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono mt-0.5">{u.email}</div>
                    </td>
                    <td className="p-4 font-medium text-gray-700">{u.department}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-black rounded-full border uppercase ${
                        u.role === 'Superadmin' 
                          ? 'bg-emerald-50 text-[#074504] border-[#074504]/30'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={u.role}
                        onChange={async e => {
                          const newRole = e.target.value;
                          handleReassignUserRole(u.id, newRole);
                          try {
                            await supabase.from('user_roles').update({ role: newRole }).eq('email', u.email);
                            showToast(`Updated ${u.name}'s role to ${newRole} in Supabase.`);
                          } catch (err) {
                            console.warn("Role update notice:", err);
                          }
                        }}
                        className="p-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#074504]"
                      >
                        {roles.map(r => (
                          <option key={r.id} value={r.name}>{r.name}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* REGISTER NEW CMS USER MODAL */}
          <AnimatePresence>
            {showAddUserModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-gray-100 shadow-2xl space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-[#074504]" />
                      <h3 className="font-black text-sm text-[#074504] uppercase">Register New CMS User</h3>
                    </div>
                    <button
                      onClick={() => setShowAddUserModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newUserName.trim() || !newUserEmail.trim()) {
                      showToast('User Name and Email are required.', 'error');
                      return;
                    }
                    setIsSubmittingUser(true);
                    try {
                      const email = newUserEmail.toLowerCase().trim();
                      const { error } = await supabase.from('user_roles').insert([{
                        user_name: newUserName.trim(),
                        email: email,
                        role: newUserRole,
                        department: newUserRole === 'Superadmin' ? 'Executive Administration' : 'CMS Editorial',
                        status: 'Active',
                        assigned_by: 'Patrick Munene (Superadmin)'
                      }]);

                      if (error) throw error;

                      showToast(`CMS User "${newUserName}" created successfully as ${newUserRole}!`);
                      setShowAddUserModal(false);
                      setNewUserName('');
                      setNewUserEmail('');
                      fetchSupabaseUserRoles();
                    } catch (err: any) {
                      showToast(err.message || 'Error creating user role in Supabase.', 'error');
                    } finally {
                      setIsSubmittingUser(false);
                    }
                  }} className="space-y-4 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-500">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={newUserName}
                        onChange={e => setNewUserName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl font-bold text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#074504]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-500">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. johndoe@gmail.com"
                        value={newUserEmail}
                        onChange={e => setNewUserEmail(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl font-bold text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#074504]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-500">CMS Access Role</label>
                      <select
                        value={newUserRole}
                        onChange={(e: any) => setNewUserRole(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl font-bold text-xs text-[#074504] focus:outline-none focus:ring-2 focus:ring-[#074504]"
                      >
                        <option value="Superadmin">Superadmin (All rights & privileges)</option>
                        <option value="Author">Author (Limited rights & publishing)</option>
                        <option value="Editor">Editor (Editorial control)</option>
                        <option value="Moderator">Moderator (Comments & webmaster)</option>
                      </select>
                    </div>

                    <div className="pt-3 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddUserModal(false)}
                        className="px-4 py-2.5 bg-gray-100 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingUser}
                        className="px-5 py-2.5 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl hover:bg-[#053203] shadow-md flex items-center gap-2"
                      >
                        {isSubmittingUser ? 'Registering...' : 'Register User'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ================= TAB 6: AUDIT LOG ================= */}
      {activeTab === 'audit_log' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C0991B]" /> Role & Privilege Change Log
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Audit history of role creation, matrix modifications, and assignments</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs divide-y divide-gray-100">
            {auditLogs.map(log => (
              <div key={log.id} className="p-4 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-black text-[#074504] block">{log.event} ({log.targetRoleOrUser})</span>
                  <span className="text-gray-600 font-medium text-[11px]">{log.details}</span>
                  <span className="text-[10px] text-gray-400 font-mono block">Actor: {log.actor}</span>
                </div>
                <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
