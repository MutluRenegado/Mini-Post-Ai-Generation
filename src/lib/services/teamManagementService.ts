export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  workspaceId: string;
  status: 'active' | 'invited' | 'disabled';
  joinedAt: string;
}

export interface WorkspaceConfig {
  id: string;
  name: string;
  ownerId: string;
  membersCount: number;
  planTier: 'starter' | 'pro' | 'business';
  createdAt: string;
}

const TEAM_STORAGE_KEY = 'minipost_backend_team_members_v1';

export class TeamManagementService {
  static getSampleTeamMembers(): TeamMember[] {
    return [
      { id: 'tm_1', name: 'Mini Post Founder', email: 'info@minipostapp.space', role: 'owner', workspaceId: 'ws_main', status: 'active', joinedAt: '2026-01-01T00:00:00Z' },
      { id: 'tm_2', name: 'Alex Creator', email: 'alex@minipost.app', role: 'admin', workspaceId: 'ws_main', status: 'active', joinedAt: '2026-02-15T00:00:00Z' },
      { id: 'tm_3', name: 'Sam Editor', email: 'sam@minipost.app', role: 'editor', workspaceId: 'ws_main', status: 'active', joinedAt: '2026-03-10T00:00:00Z' },
      { id: 'tm_4', name: 'Jordan Analyst', email: 'jordan@minipost.app', role: 'viewer', workspaceId: 'ws_main', status: 'active', joinedAt: '2026-04-01T00:00:00Z' },
    ];
  }

  static getTeamMembers(): TeamMember[] {
    if (typeof window === 'undefined') {
      return this.getSampleTeamMembers();
    }
    try {
      const raw = localStorage.getItem(TEAM_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load team members', e);
    }
    return this.getSampleTeamMembers();
  }

  static inviteMember(email: string, role: UserRole): TeamMember[] {
    const current = this.getTeamMembers();
    const newMember: TeamMember = {
      id: `tm_${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      workspaceId: 'ws_main',
      status: 'invited',
      joinedAt: new Date().toISOString(),
    };

    const updated = [...current, newMember];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to invite member', e);
      }
    }
    return updated;
  }

  static updateRole(memberId: string, newRole: UserRole): TeamMember[] {
    const current = this.getTeamMembers();
    const updated = current.map((m) => (m.id === memberId ? { ...m, role: newRole } : m));
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update member role', e);
      }
    }
    return updated;
  }
}
