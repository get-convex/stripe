import type { ActionCtx, HttpRouter, RegisterRoutesConfig, StripeEventHandlers } from "./types.js";
import type { ComponentApi } from "../component/_generated/component.js";
export type StripeComponent = ComponentApi;
export type { RegisterRoutesConfig, StripeEventHandlers };
/**
 * Stripe Component Client
 *
 * Provides methods for managing Stripe customers, subscriptions, payments,
 * and webhooks through Convex.
 */
export declare class StripeSubscriptions {
    component: StripeComponent;
    private _apiKey;
    constructor(component: StripeComponent, options?: {
        STRIPE_SECRET_KEY?: string;
    });
    get apiKey(): string;
    /**
     * Update subscription quantity (for seat-based pricing).
     * This will update both Stripe and the local database.
     */
    updateSubscriptionQuantity(ctx: ActionCtx, args: {
        stripeSubscriptionId: string;
        quantity: number;
    }): Promise<null>;
    /**
     * Cancel a subscription either immediately or at period end.
     * Updates both Stripe and the local database.
     */
    cancelSubscription(ctx: ActionCtx, args: {
        stripeSubscriptionId: string;
        cancelAtPeriodEnd?: boolean;
    }): Promise<null>;
    /**
     * Reactivate a subscription that was set to cancel at period end.
     * Updates both Stripe and the local database.
     */
    reactivateSubscription(ctx: ActionCtx, args: {
        stripeSubscriptionId: string;
    }): Promise<null>;
    /**
     * Create a Stripe Checkout session for one-time payments or subscriptions.
     */
    /**
       * Create a Stripe Checkout session for one-time payments or subscriptions.
       */
    createCheckoutSession(ctx: ActionCtx, args: {
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
        /** Enable the promotion code input field on hosted checkout.
         *  Mutually exclusive with `discounts`. */
        allowPromotionCodes?: boolean;
        /** Explicit list of payment method types.
         *  If omitted, Stripe uses Dashboard payment method settings. */
        paymentMethodTypes?: string[];
        /** Payment method-specific options. */
        paymentMethodOptions?: Record<string, unknown>;
        /** Server-applied discounts (coupon or promotion code IDs).
         *  Mutually exclusive with `allowPromotionCodes`. */
        discounts?: Array<{
            coupon?: string;
            promotion_code?: string;
        }>;
        /** Locale for the checkout page. */
        locale?: string;
        /** Currency override. Required when using price_data instead of a Price ID. */
        currency?: string;
    }): Promise<{
        sessionId: string;
        url: string | null;
    }>;
    /**
     * Create a new Stripe customer.
     *
     * @param args.idempotencyKey - Optional key to prevent duplicate customer creation.
     *   If two requests come in with the same key, Stripe returns the same customer.
     *   Recommended: pass `userId` to prevent race conditions.
     */
    createCustomer(ctx: ActionCtx, args: {
        email?: string;
        name?: string;
        metadata?: Record<string, string>;
        idempotencyKey?: string;
    }): Promise<{
        customerId: string;
    }>;
    /**
     * Get or create a Stripe customer for a user.
     * Checks existing customers, subscriptions, and payments to avoid duplicates.
     */
    getOrCreateCustomer(ctx: ActionCtx, args: {
        userId: string;
        email?: string;
        name?: string;
    }): Promise<{
        customerId: any;
        isNew: boolean;
    }>;
    /**
     * Create a Stripe Customer Portal session for managing subscriptions.
     */
    createCustomerPortalSession(ctx: ActionCtx, args: {
        customerId: string;
        returnUrl: string;
    }): Promise<{
        url: string;
    }>;
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
export declare function registerRoutes(http: HttpRouter, component: ComponentApi, config?: RegisterRoutesConfig): void;
export default StripeSubscriptions;
//# sourceMappingURL=index.d.ts.map