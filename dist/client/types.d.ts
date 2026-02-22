import type { HttpRouter, GenericActionCtx, GenericMutationCtx, GenericDataModel, GenericQueryCtx } from "convex/server";
import type Stripe from "stripe";
export type QueryCtx = Pick<GenericQueryCtx<GenericDataModel>, "runQuery">;
export type MutationCtx = Pick<GenericMutationCtx<GenericDataModel>, "runQuery" | "runMutation">;
export type ActionCtx = Pick<GenericActionCtx<GenericDataModel>, "runQuery" | "runMutation" | "runAction">;
/**
 * Handler function for a specific Stripe webhook event.
 * Receives the action context and the full Stripe event object.
 */
export type StripeEventHandler<T extends Stripe.Event.Type = Stripe.Event.Type> = (ctx: GenericActionCtx<GenericDataModel>, event: Stripe.Event & {
    type: T;
}) => Promise<void>;
/**
 * Map of event types to their handlers.
 * Users can provide handlers for any Stripe webhook event type.
 */
export type StripeEventHandlers = {
    [K in Stripe.Event.Type]?: StripeEventHandler<K>;
};
/**
 * Configuration for webhook registration.
 */
export type RegisterRoutesConfig = {
    /**
     * Optional webhook path. Defaults to "/stripe/webhook"
     */
    webhookPath?: string;
    /**
     * Optional event handlers that run after default processing.
     * The component will handle database syncing automatically,
     * and then call your custom handlers.
     */
    events?: StripeEventHandlers;
    /**
     * Optional generic event handler that runs for all events.
     * This runs after default processing and before specific event handlers.
     */
    onEvent?: StripeEventHandler;
    /**
     * Stripe webhook secret for signature verification.
     * Defaults to process.env.STRIPE_WEBHOOK_SECRET
     */
    STRIPE_WEBHOOK_SECRET?: string;
    /**
     * Stripe secret key for API calls.
     * Defaults to process.env.STRIPE_SECRET_KEY
     */
    STRIPE_SECRET_KEY?: string;
};
/**
 * Type for the HttpRouter to be used in registerRoutes
 */
export type { HttpRouter };
//# sourceMappingURL=types.d.ts.map