import { httpActionGeneric } from "convex/server";
import StripeSDK from "stripe";
import type {
  MutationCtx,
  ActionCtx,
  HttpRouter,
  RegisterRoutesConfig,
  StripeEventHandlers,
} from "./types.js";
import type { ComponentApi } from "../component/_generated/component.js";

/**
 * Time window (in seconds) to check for recent subscriptions when processing
 * payment_intent.succeeded events. This helps avoid creating duplicate payment
 * records for subscription payments.
 */
const RECENT_SUBSCRIPTION_WINDOW_SECONDS = 10 * 60; // 10 minutes

export type StripeComponent = ComponentApi;

export type { RegisterRoutesConfig, StripeEventHandlers };

/**
 * Stripe Component Client
 *
 * Provides methods for managing Stripe customers, subscriptions, payments,
 * and webhooks through Convex.
 */
export class StripeSubscriptions {
  private _apiKey: string;
  constructor(
    public component: StripeComponent,
    options?: {
      STRIPE_SECRET_KEY?: string;
    }
  ) {
    this._apiKey = options?.STRIPE_SECRET_KEY ?? process.env.STRIPE_SECRET_KEY!;
  }
  get apiKey() {
    if (!this._apiKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }
    return this._apiKey;
  }

  /**
   * Update subscription quantity (for seat-based pricing).
   * This will update both Stripe and the local database.
   */
  async updateSubscriptionQuantity(
    ctx: ActionCtx,
    args: {
      stripeSubscriptionId: string;
      quantity: number;
    }
  ) {
    // Delegate to the component's public action
    await ctx.runAction(this.component.public.updateSubscriptionQuantity, {
      stripeSubscriptionId: args.stripeSubscriptionId,
      quantity: args.quantity,
    });

    return null;
  }

  /**
   * Cancel a subscription either immediately or at period end.
   * Updates both Stripe and the local database.
   */
  async cancelSubscription(
    ctx: ActionCtx,
    args: {
      stripeSubscriptionId: string;
      cancelAtPeriodEnd?: boolean;
    }
  ) {
    const stripe = new StripeSDK(this.apiKey);
    const cancelAtPeriodEnd = args.cancelAtPeriodEnd ?? true;

    let subscription: StripeSDK.Subscription;

    if (cancelAtPeriodEnd) {
      subscription = await stripe.subscriptions.update(args.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
    } else {
      subscription = await stripe.subscriptions.cancel(args.stripeSubscriptionId);
    }

    // Update local database immediately (don't wait for webhook)
    await ctx.runMutation(this.component.private.handleSubscriptionUpdated, {
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: subscription.items.data[0]?.current_period_end || 0,
      cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
      quantity: subscription.items.data[0]?.quantity ?? 1,
      metadata: subscription.metadata || {},
    });

    return null;
  }

  /**
   * Reactivate a subscription that was set to cancel at period end.
   * Updates both Stripe and the local database.
   */
  async reactivateSubscription(
    ctx: ActionCtx,
    args: {
      stripeSubscriptionId: string;
    }
  ) {
    const stripe = new StripeSDK(this.apiKey);

    // Reactivate by setting cancel_at_period_end to false
    const subscription = await stripe.subscriptions.update(args.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    // Update local database immediately
    await ctx.runMutation(this.component.private.handleSubscriptionUpdated, {
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: subscription.items.data[0]?.current_period_end || 0,
      cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
      quantity: subscription.items.data[0]?.quantity ?? 1,
      metadata: subscription.metadata || {},
    });

    return null;
  }

  // ============================================================================
  // CHECKOUT & PAYMENTS
  // ============================================================================

  /**
   * Create a Stripe Checkout session for one-time payments or subscriptions.
   */
  async createCheckoutSession(
    ctx: ActionCtx,
    args: {
      priceId: string;
      customerId?: string;
      mode: "payment" | "subscription" | "setup";
      successUrl: string;
      cancelUrl: string;
      quantity?: number;
      metadata?: Record<string, string>;
      /** Metadata to attach to the subscription (only for mode: "subscription") */
      subscriptionMetadata?: Record<string, string>;
      /** Metadata to attach to the payment intent (only for mode: "payment") */
      paymentIntentMetadata?: Record<string, string>;
    }
  ) {
    const stripe = new StripeSDK(this.apiKey);

    const sessionParams: StripeSDK.Checkout.SessionCreateParams = {
      mode: args.mode,
      line_items: [
        {
          price: args.priceId,
          quantity: args.quantity ?? 1,
        },
      ],
      success_url: args.successUrl,
      cancel_url: args.cancelUrl,
      metadata: args.metadata || {},
    };

    if (args.customerId) {
      sessionParams.customer = args.customerId;
    }

    // Add subscription metadata for linking userId/orgId
    if (args.mode === "subscription" && args.subscriptionMetadata) {
      sessionParams.subscription_data = {
        metadata: args.subscriptionMetadata,
      };
    }

    // Add payment intent metadata for linking userId/orgId
    if (args.mode === "payment" && args.paymentIntentMetadata) {
      sessionParams.payment_intent_data = {
        metadata: args.paymentIntentMetadata,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  /**
   * Create a new Stripe customer.
   * 
   * @param args.idempotencyKey - Optional key to prevent duplicate customer creation.
   *   If two requests come in with the same key, Stripe returns the same customer.
   *   Recommended: pass `userId` to prevent race conditions.
   */
  async createCustomer(
    ctx: ActionCtx,
    args: {
      email?: string;
      name?: string;
      metadata?: Record<string, string>;
      idempotencyKey?: string;
    }
  ) {
    const stripe = new StripeSDK(this.apiKey);

    // Use idempotency key to prevent duplicate customers from race conditions
    const requestOptions = args.idempotencyKey 
      ? { idempotencyKey: `create_customer_${args.idempotencyKey}` }
      : undefined;

    const customer = await stripe.customers.create({
      email: args.email,
      name: args.name,
      metadata: args.metadata,
    }, requestOptions);

    // Store in our database
    await ctx.runMutation(this.component.public.createOrUpdateCustomer, {
      stripeCustomerId: customer.id,
      email: args.email,
      name: args.name,
      metadata: args.metadata,
    });

    return {
      customerId: customer.id,
    };
  }

  /**
   * Get or create a Stripe customer for a user.
   * Checks existing subscriptions/payments first to avoid duplicates.
   */
  async getOrCreateCustomer(
    ctx: ActionCtx,
    args: {
      userId: string;
      email?: string;
      name?: string;
    }
  ) {
    // Check if customer exists by userId in subscriptions
    const existingSubs = await ctx.runQuery(
      this.component.public.listSubscriptionsByUserId,
      { userId: args.userId }
    );

    if (existingSubs.length > 0) {
      return { customerId: existingSubs[0].stripeCustomerId, isNew: false };
    }

    // Check existing payments
    const existingPayments = await ctx.runQuery(
      this.component.public.listPaymentsByUserId,
      { userId: args.userId }
    );

    if (existingPayments.length > 0 && existingPayments[0].stripeCustomerId) {
      return { customerId: existingPayments[0].stripeCustomerId, isNew: false };
    }

    // Create a new customer with idempotency key to prevent race conditions
    const result = await this.createCustomer(ctx, {
      email: args.email,
      name: args.name,
      metadata: { userId: args.userId },
      idempotencyKey: args.userId, // Prevents duplicate customers if called concurrently
    });

    return { customerId: result.customerId, isNew: true };
  }

  /**
   * Create a Stripe Customer Portal session for managing subscriptions.
   */
  async createCustomerPortalSession(
    ctx: ActionCtx,
    args: {
      customerId: string;
      returnUrl: string;
    }
  ) {
    const stripe = new StripeSDK(this.apiKey);

    const session = await stripe.billingPortal.sessions.create({
      customer: args.customerId,
      return_url: args.returnUrl,
    });

    return {
      url: session.url,
    };
  }

  // ============================================================================
  // WEBHOOK REGISTRATION
  // ============================================================================
}
/**
 * Register webhook routes with the HTTP router.
 * This simplifies webhook setup by handling signature verification
 * and routing events to the appropriate handlers automatically.
 *
 * @param http - The HTTP router instance
 * @param config - Optional configuration for webhook path and event handlers
 *
 * @example
 * ```typescript
 * // convex/http.ts
 * import { httpRouter } from "convex/server";
 * import { stripe } from "./stripe";
 *
 * const http = httpRouter();
 *
 * stripe.registerRoutes(http, {
 *   events: {
 *     "customer.subscription.updated": async (ctx, event) => {
 *       // Your custom logic after default handling
 *       console.log("Subscription updated:", event.data.object);
 *     },
 *   },
 * });
 *
 * export default http;
 * ```
 */
export function registerRoutes<Ctx extends ActionCtx = ActionCtx>(
  http: HttpRouter,
  component: ComponentApi,
  config?: RegisterRoutesConfig<Ctx>,
) {
  const webhookPath = config?.webhookPath ?? "/stripe/webhook";
  const eventHandlers = config?.events ?? {};

  http.route({
    path: webhookPath,
    method: "POST",
    handler: httpActionGeneric(async (ctx, req) => {
      const webhookSecret =
        config?.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        console.error("❌ STRIPE_WEBHOOK_SECRET is not set");
        return new Response("Webhook secret not configured", { status: 500 });
      }

      const signature = req.headers.get("stripe-signature");
      if (!signature) {
        console.error("❌ No Stripe signature in headers");
        return new Response("No signature provided", { status: 400 });
      }

      const body = await req.text();

      const apiKey = config?.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;

      if (!apiKey) {
        console.error("❌ STRIPE_SECRET_KEY is not set");
        return new Response("Stripe secret key not configured", {
          status: 500,
        });
      }

      const stripe = new StripeSDK(apiKey);

      // Verify webhook signature
      let event: StripeSDK.Event;
      try {
        event = await stripe.webhooks.constructEventAsync(
          body,
          signature,
          webhookSecret
        );
      } catch (err) {
        console.error("❌ Webhook signature verification failed:", err);
        return new Response(
          `Webhook signature verification failed: ${err instanceof Error ? err.message : String(err)}`,
          { status: 400 }
        );
      }

      // Process the event with default handlers
      try {
        await processEvent(ctx, component, event, stripe);

        // Call generic event handler if provided
        if (config?.onEvent) {
          await config.onEvent(ctx, event);
        }

        // Call custom event handler if provided
        const eventType = event.type;
        const customHandler:
          | ((ctx: any, event: any) => Promise<void>)
          | undefined = eventHandlers[eventType] as any;
        if (customHandler) {
          await customHandler(ctx, event);
        }
      } catch (error) {
        console.error("❌ Error processing webhook:", error);
        return new Response("Error processing webhook", { status: 500 });
      }

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }),
  });
}

/**
 * Internal method to process Stripe webhook events with default handling.
 * This handles the database syncing for all supported event types.
 */
async function processEvent(
  ctx: MutationCtx | ActionCtx,
  component: ComponentApi,
  event: StripeSDK.Event,
  stripe: StripeSDK
): Promise<void> {
  switch (event.type) {
    case "customer.created":
    case "customer.updated": {
      const customer = event.data.object as StripeSDK.Customer;
      const handler =
        event.type === "customer.created"
          ? component.private.handleCustomerCreated
          : component.private.handleCustomerUpdated;

      await ctx.runMutation(handler, {
        stripeCustomerId: customer.id,
        email: customer.email || undefined,
        name: customer.name || undefined,
        metadata: customer.metadata,
      });
      break;
    }

    case "customer.subscription.created": {
      const subscription = event.data.object as StripeSDK.Subscription;
      await ctx.runMutation(component.private.handleSubscriptionCreated, {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        status: subscription.status,
        currentPeriodEnd: subscription.items.data[0]?.current_period_end || 0,
        cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
        quantity: subscription.items.data[0]?.quantity ?? 1,
        priceId: subscription.items.data[0]?.price.id || "",
        metadata: subscription.metadata || {},
      });
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as any;
      await ctx.runMutation(component.private.handleSubscriptionUpdated, {
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.items.data[0]?.current_period_end || 0,
        cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
        quantity: subscription.items.data[0]?.quantity ?? 1,
        metadata: subscription.metadata || {},
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as StripeSDK.Subscription;
      await ctx.runMutation(component.private.handleSubscriptionDeleted, {
        stripeSubscriptionId: subscription.id,
      });
      break;
    }

    case "checkout.session.completed": {
      const session = event.data.object as StripeSDK.Checkout.Session;
      await ctx.runMutation(component.private.handleCheckoutSessionCompleted, {
        stripeCheckoutSessionId: session.id,
        stripeCustomerId: session.customer
          ? (session.customer as string)
          : undefined,
        mode: session.mode || "payment",
        metadata: session.metadata || undefined,
      });

      // For payment mode, link the payment to the customer if we have both
      if (
        session.mode === "payment" &&
        session.customer &&
        session.payment_intent
      ) {
        await ctx.runMutation(component.private.updatePaymentCustomer, {
          stripePaymentIntentId: session.payment_intent as string,
          stripeCustomerId: session.customer as string,
        });
      }

      // For subscription mode, fetch and store the latest invoice
      if (session.mode === "subscription" && session.subscription) {
        try {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          if (subscription.latest_invoice) {
            const invoice = await stripe.invoices.retrieve(
              subscription.latest_invoice as string
            );
            await ctx.runMutation(component.private.handleInvoiceCreated, {
              stripeInvoiceId: invoice.id,
              stripeCustomerId: invoice.customer as string,
              stripeSubscriptionId: subscription.id,
              status: invoice.status || "paid",
              amountDue: invoice.amount_due,
              amountPaid: invoice.amount_paid,
              created: invoice.created,
            });
          }
        } catch (err) {
          console.error("Error fetching invoice for subscription:", err);
        }
      }
      break;
    }

    case "invoice.created":
    case "invoice.finalized": {
      const invoice = event.data.object as StripeSDK.Invoice;
      await ctx.runMutation(component.private.handleInvoiceCreated, {
        stripeInvoiceId: invoice.id,
        stripeCustomerId: invoice.customer as string,
        stripeSubscriptionId: (invoice as any).subscription as
          | string
          | undefined,
        status: invoice.status || "open",
        amountDue: invoice.amount_due,
        amountPaid: invoice.amount_paid,
        created: invoice.created,
      });
      break;
    }

    case "invoice.paid":
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as any;
      await ctx.runMutation(component.private.handleInvoicePaid, {
        stripeInvoiceId: invoice.id,
        amountPaid: invoice.amount_paid,
      });
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as StripeSDK.Invoice;
      await ctx.runMutation(component.private.handleInvoicePaymentFailed, {
        stripeInvoiceId: invoice.id,
      });
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as any;

      // Check if this is a subscription payment
      if (paymentIntent.invoice) {
        try {
          const invoice = await stripe.invoices.retrieve(
            paymentIntent.invoice as string
          );
          if ((invoice as any).subscription) {
            console.log(
              "⏭️ Skipping payment_intent.succeeded - subscription payment"
            );
            break;
          }
        } catch (err) {
          console.error("Error checking invoice:", err);
        }
      }

      // Check for recent subscriptions
      if (paymentIntent.customer) {
        const recentSubscriptions = await ctx.runQuery(
          component.public.listSubscriptions,
          {
            stripeCustomerId: paymentIntent.customer as string,
          }
        );

        const recentWindowStart = Date.now() / 1000 - RECENT_SUBSCRIPTION_WINDOW_SECONDS;
        const recentSubscription = recentSubscriptions.find(
          (sub: any) => sub._creationTime > recentWindowStart
        );

        if (recentSubscription) {
          console.log(
            "⏭️ Skipping payment_intent.succeeded - recent subscription"
          );
          break;
        }
      }

      await ctx.runMutation(component.private.handlePaymentIntentSucceeded, {
        stripePaymentIntentId: paymentIntent.id,
        stripeCustomerId: paymentIntent.customer
          ? (paymentIntent.customer as string)
          : undefined,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        created: paymentIntent.created,
        metadata: paymentIntent.metadata || {},
      });
      break;
    }

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }
}

export default StripeSubscriptions;
