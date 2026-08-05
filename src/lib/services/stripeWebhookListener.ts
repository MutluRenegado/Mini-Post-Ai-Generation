export interface StripeEventPayload {
  id: string;
  type:
    | 'checkout.session.completed'
    | 'customer.subscription.created'
    | 'customer.subscription.updated'
    | 'customer.subscription.deleted'
    | 'invoice.payment_succeeded';
  data: {
    object: {
      customer_email?: string;
      subscription?: string;
      status?: string;
      metadata?: Record<string, string>;
    };
  };
}

export class StripeWebhookListener {
  static handleWebhookEvent(event: StripeEventPayload): {
    handled: boolean;
    tier?: 'starter' | 'pro' | 'business';
    userEmail?: string;
    message: string;
  } {
    const email = event.data?.object?.customer_email || 'billing@minipostapp.space';

    switch (event.type) {
      case 'checkout.session.completed':
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        return {
          handled: true,
          tier: 'pro',
          userEmail: email,
          message: `Successfully processed ${event.type}. User ${email} tier updated to Pro via Stripe payment link.`,
        };
      case 'customer.subscription.deleted':
        return {
          handled: true,
          tier: 'starter',
          userEmail: email,
          message: `Subscription cancelled for ${email}. Reverted to Starter tier.`,
        };
      default:
        return {
          handled: true,
          message: `Received Stripe webhook event ${event.type}.`,
        };
    }
  }
}
