'use client';

import React, { useState, useEffect } from 'react';
import { Users, Shield, Lock, Layers, Plus, CheckCircle2, UserCheck, Key } from 'lucide-react';
import { TeamManagementService, TeamMember, UserRole } from '@/lib/services/teamManagementService';

interface TeamManagementViewProps {
  onBack?: () => void;
  initialTab?: 'teams' | 'roles' | 'workspaces' | 'permissions';
}

export function TeamManagementView({ initialTab = 'teams' }: TeamManagementViewProps) {
  const [mounted, setMounted] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [activeTab, setActiveTab] = useState<'teams' | 'roles' | 'workspaces' | 'permissions'>(initialTab);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('editor');

  useEffect(() => {
    setMounted(true);
    setMembers(TeamManagementService.getTeamMembers());
  }, []);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const updated = TeamManagementService.inviteMember(inviteEmail.trim(), inviteRole);
    setMembers(updated);
    setInviteEmail('');
  };

  if (!mounted) {
    return <div className="p-8 max-w-7xl mx-auto text-slate-400 font-mono text-sm animate-pulse">Loading Team & Workspaces Administration...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-slate-100 space-y-6 font-sans">
      <div className="bg-[#0F131E] border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono font-bold">
            <Users className="w-3.5 h-3.5" /> ADMINISTRATION & TEAM GOVERNANCE
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight pt-1">Teams, Workspaces & Permissions</h1>
          <p className="text-xs text-slate-400">Multi-seat workspace management, role builder, and granular permission controls.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl overflow-x-auto">
          {[
            { id: 'teams', label: 'Team Members' },
            { id: 'roles', label: 'Role Builder' },
            { id: 'workspaces', label: 'Workspaces' },
            { id: 'permissions', label: 'Permissions Matrix' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'teams' && (
        <div className="space-y-6">
          {/* Invite Member Form */}
          <form onSubmit={handleInvite} className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl flex flex-col sm:flex-row items-center gap-3">
            <input
              type="email"
              placeholder="Enter team member email address..."
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as UserRole)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Invite Member
            </button>
          </form>

          {/* Members Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="divide-y divide-slate-800/80">
              {members.map((m) => (
                <div key={m.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs uppercase">
                      {m.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{m.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{m.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-bold uppercase">
                      {m.role}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { role: 'Owner', desc: 'Full administrative control over billing, team management, and workspace deletion.', badge: 'LEVEL 4' },
            { role: 'Admin', desc: 'Can manage team invites, integration OAuth tokens, and approve post broadcasts.', badge: 'LEVEL 3' },
            { role: 'Editor', desc: 'Can generate, schedule, and edit content across all 11 social channels.', badge: 'LEVEL 2' },
            { role: 'Viewer', desc: 'Read-only access to content calendar, asset library, and analytics dashboards.', badge: 'LEVEL 1' },
          ].map((r) => (
            <div key={r.role} className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{r.role}</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-purple-400">{r.badge}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'workspaces' && (
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-white">Active Team Workspaces</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-white">Main Marketing HQ</div>
              <p className="text-[10px] text-slate-400 font-mono">ID: ws_main • 4 Seats Active • Pro Plan Tier</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-white">Global Product Launch</div>
              <p className="text-[10px] text-slate-400 font-mono">ID: ws_launch • 2 Seats Active • Pro Plan Tier</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'permissions' && (
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3">
          <h3 className="text-sm font-bold text-white">Granular Permission Matrix</h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span>Multi-Platform Dispatch Broadcast</span>
              <span className="text-emerald-400">Owner, Admin, Editor</span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span>Stripe Subscription & Billing Sync</span>
              <span className="text-purple-400">Owner Only</span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span>Brand Kit & Logo Asset Modifications</span>
              <span className="text-emerald-400">Owner, Admin</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamManagementView;
