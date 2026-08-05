import { UserRole } from './teamManagementService';

export interface UserSubscriptionContext {
  userId: string;
  role: UserRole;
  tier: 'starter' | 'pro' | 'business';
  isSubscriptionActive: boolean;
}

export class RbacAuthGuard {
  static canAccessProFeature(ctx: UserSubscriptionContext): boolean {
    if (!ctx.isSubscriptionActive) return false;
    return ctx.tier === 'pro' || ctx.tier === 'business';
  }

  static canManageTeam(ctx: UserSubscriptionContext): boolean {
    if (!this.canAccessProFeature(ctx)) return false;
    return ctx.role === 'owner' || ctx.role === 'admin';
  }

  static canPublish(ctx: UserSubscriptionContext): boolean {
    if (!ctx.isSubscriptionActive) return false;
    return ctx.role === 'owner' || ctx.role === 'admin' || ctx.role === 'editor';
  }

  static canAccessCompliance(ctx: UserSubscriptionContext): boolean {
    return ctx.tier === 'business' && (ctx.role === 'owner' || ctx.role === 'admin');
  }

  static checkPermission(
    ctx: UserSubscriptionContext,
    requiredRole: UserRole,
    requiredTier: 'starter' | 'pro' | 'business' = 'starter'
  ): { allowed: boolean; reason?: string } {
    const roleHierarchy: Record<UserRole, number> = {
      owner: 4,
      admin: 3,
      editor: 2,
      viewer: 1,
    };

    const tierHierarchy: Record<'starter' | 'pro' | 'business', number> = {
      starter: 1,
      pro: 2,
      business: 3,
    };

    if (!ctx.isSubscriptionActive) {
      return { allowed: false, reason: 'Active subscription required. Upgrade via Stripe.' };
    }

    if (tierHierarchy[ctx.tier] < tierHierarchy[requiredTier]) {
      return { allowed: false, reason: `Requires ${requiredTier.toUpperCase()} tier or higher.` };
    }

    if (roleHierarchy[ctx.role] < roleHierarchy[requiredRole]) {
      return { allowed: false, reason: `Insufficient role permissions. ${requiredRole.toUpperCase()} required.` };
    }

    return { allowed: true };
  }
}
