export interface TeamMember {
  id: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface WorkspaceConfig {
  id: string;
  name: string;
  members: TeamMember[];
}

export class TeamWorkspaceManager {
  private static activeWorkspace: WorkspaceConfig = {
    id: 'ws_main',
    name: 'MiniPost Studio Team Workspace',
    members: [
      { id: 'u1', name: 'Studio Lead', role: 'admin' },
      { id: 'u2', name: 'Content Strategist', role: 'editor' },
    ],
  };

  static getWorkspace(): WorkspaceConfig {
    return { ...this.activeWorkspace };
  }

  static addMember(member: TeamMember): void {
    this.activeWorkspace.members.push(member);
  }
}
