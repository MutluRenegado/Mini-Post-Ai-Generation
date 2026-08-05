export interface AuditLogEntry {
  id: string;
  action: string;
  actorEmail: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
  status: 'success' | 'failure';
}

const AUDIT_STORAGE_KEY = 'minipost_backend_audit_logs_v1';

export class AuditLogService {
  static getAuditLogs(): AuditLogEntry[] {
    if (typeof window === 'undefined') {
      return this.getSampleAuditLogs();
    }
    try {
      const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load audit logs', e);
    }
    return this.getSampleAuditLogs();
  }

  static recordLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry[] {
    const current = this.getAuditLogs();
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [newEntry, ...current];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to record audit log', e);
      }
    }
    return updated;
  }

  static getSampleAuditLogs(): AuditLogEntry[] {
    return [
      { id: 'aud_1', action: 'DISPATCH_BROADCAST', actorEmail: 'admin@minipostapp.space', details: 'Triggered 11-channel multi-modal broadcast', timestamp: new Date().toISOString(), status: 'success' },
      { id: 'aud_2', action: 'BRAND_KIT_SAVE', actorEmail: 'admin@minipostapp.space', details: 'Updated primary color palette and tone rules', timestamp: new Date().toISOString(), status: 'success' },
      { id: 'aud_3', action: 'ROLE_UPDATE', actorEmail: 'admin@minipostapp.space', details: 'Promoted alex@minipost.app to admin role', timestamp: new Date().toISOString(), status: 'success' },
    ];
  }
}
