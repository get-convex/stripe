import { v } from "convex/values";
import { mutation } from "./_generated/server.js";

// ============================================================================
// INTERNAL MUTATIONS (for webhooks and internal use)
// ============================================================================

export const updateSubscriptionQuantityInternal = mutation({
    args: {
        stripeSubscriptionId: v.string(),
        quantity: v.number(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const subscription = await ctx.db
            .query("subscriptions")
            .withIndex("by_stripe_subscription_id", (q) =>
                q.eq("stripeSubscriptionId", args.stripeSubscriptionId)
            )
            .unique();

        if (subscription) {
            await ctx.db.patch(subscription._id, {
                quantity: args.quantity,
            });
        }

        return null;
    },
});

export const handleCustomerCreated = mutation({
    args: {
        stripeCustomerId: v.string(),
        email: v.optional(v.string()),
        name: v.optional(v.string()),
        metadata: v.optional(v.any()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("customers")
            .withIndex("by_stripe_customer_id", (q) =>
                q.eq("stripeCustomerId", args.stripeCustomerId)
            )
            .unique();

        if (!existing) {
            await ctx.db.insert("customers", {
                stripeCustomerId: args.stripeCustomerId,
                email: args.email,
                name: args.name,
                metadata: args.metadata || {},
            });
        }

        return null;
    },
});

export const handleCustomerUpdated = mutation({
    args: {
        stripeCustomerId: v.string(),
        email: v.optional(v.string()),
        name: v.optional(v.string()),
        metadata: v.optional(v.any()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const customer = await ctx.db
            .query("customers")
            .withIndex("by_stripe_customer_id", (q) =>
                q.eq("stripeCustomerId", args.stripeCustomerId)
            )
            .unique();

        if (customer) {
            await ctx.db.patch(customer._id, {
                email: args.email,
                name: args.name,
                metadata: args.metadata,
            });
        }

        return null;
    },
});

export const handleSubscriptionCreated = mutation({
    args: {
        stripeSubscriptionId: v.string(),
        stripeCustomerId: v.string(),
        status: v.string(),
        currentPeriodEnd: v.number(),
        cancelAtPeriodEnd: v.boolean(),
        quantity: v.optional(v.number()),
        priceId: v.string(),
        metadata: v.optional(v.any()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("subscriptions")
            .withIndex("by_stripe_subscription_id", (q) =>
                q.eq("stripeSubscriptionId", args.stripeSubscriptionId)
            )
            .unique();

        // Extract orgId and userId from metadata if present
        const metadata = args.metadata || {};
        const orgId = metadata.orgId as string | undefined;
        const userId = metadata.userId as string | undefined;

        if (!existing) {
            await ctx.db.insert("subscriptions", {
                stripeSubscriptionId: args.stripeSubscriptionId,
                stripeCustomerId: args.stripeCustomerId,
                status: args.status,
                currentPeriodEnd: args.currentPeriodEnd,
                cancelAtPeriodEnd: args.cancelAtPeriodEnd,
                quantity: args.quantity,
                priceId: args.priceId,
                metadata: metadata,
                orgId: orgId,
                userId: userId,
            });
        }

        // Backfill any invoices that were created before this subscription
        // (fixes webhook timing issues where invoice arrives before subscription)
        if (orgId || userId) {
            const invoices = await ctx.db
                .query("invoices")
                .withIndex("by_stripe_subscription_id", (q) =>
                    q.eq("stripeSubscriptionId", args.stripeSubscriptionId)
                )
                .collect();

            for (const invoice of invoices) {
                if (!invoice.orgId || !invoice.userId) {
                    await ctx.db.patch(invoice._id, {
                        ...(orgId && !invoice.orgId && { orgId }),
                        ...(userId && !invoice.userId && { userId }),
                    });
                }
            }
        }

        return null;
    },
});

export const handleSubscriptionUpdated = mutation({
    args: {
        stripeSubscriptionId: v.string(),
        status: v.string(),
        currentPeriodEnd: v.number(),
        cancelAtPeriodEnd: v.boolean(),
        quantity: v.optional(v.number()),
        metadata: v.optional(v.any()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const subscription = await ctx.db
            .query("subscriptions")
            .withIndex("by_stripe_subscription_id", (q) =>
                q.eq("stripeSubscriptionId", args.stripeSubscriptionId)
            )
            .unique();

        if (subscription) {
            // Extract orgId and userId from metadata if present
            const metadata = args.metadata || {};
            const orgId = metadata.orgId as string | undefined;
            const userId = metadata.userId as string | undefined;

            await ctx.db.patch(subscription._id, {
                status: args.status,
                currentPeriodEnd: args.currentPeriodEnd,
                cancelAtPeriodEnd: args.cancelAtPeriodEnd,
                quantity: args.quantity,
                // Only update metadata fields if provided
                ...(args.metadata !== undefined && { metadata }),
                ...(orgId !== undefined && { orgId }),
                ...(userId !== undefined && { userId }),
            });
        }

        return null;
    },
});

export const handleSubscriptionDeleted = mutation({
    args: {
        stripeSubscriptionId: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const subscription = await ctx.db
            .query("subscriptions")
            .withIndex("by_stripe_subscription_id", (q) =>
                q.eq("stripeSubscriptionId", args.stripeSubscriptionId)
            )
            .unique();

        if (subscription) {
            await ctx.db.patch(subscription._id, {
                status: "canceled",
            });
        }

        return null;
    },
});

export const handleCheckoutSessionCompleted = mutation({
    args: {
        stripeCheckoutSessionId: v.string(),
        stripeCustomerId: v.optional(v.string()),
        mode: v.string(),
        metadata: v.optional(v.any()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("checkout_sessions")
            .withIndex("by_stripe_checkout_session_id", (q) =>
                q.eq("stripeCheckoutSessionId", args.stripeCheckoutSessionId)
            )
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, {
                status: "complete",
                stripeCustomerId: args.stripeCustomerId,
            });
        } else {
            await ctx.db.insert("checkout_sessions", {
                stripeCheckoutSessionId: args.stripeCheckoutSessionId,
                stripeCustomerId: args.stripeCustomerId,
                status: "complete",
                mode: args.mode,
                metadata: args.metadata || {},
            });
        }

        return null;
    },
});

export const handleInvoiceCreated = mutation({
    args: {
        stripeInvoiceId: v.string(),
        stripeCustomerId: v.string(),
        stripeSubscriptionId: v.optional(v.string()),
        status: v.string(),
        amountDue: v.number(),
        amountPaid: v.number(),
        created: v.number(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("invoices")
            .withIndex("by_stripe_invoice_id", (q) =>
                q.eq("stripeInvoiceId", args.stripeInvoiceId)
            )
            .unique();

        if (!existing) {
            // Look up orgId/userId from the subscription if available
            let orgId: string | undefined;
            let userId: string | undefined;

            if (args.stripeSubscriptionId) {
                const subscription = await ctx.db
                    .query("subscriptions")
                    .withIndex("by_stripe_subscription_id", (q) =>
                        q.eq("stripeSubscriptionId", args.stripeSubscriptionId!)
                    )
                    .unique();

                if (subscription) {
                    orgId = subscription.orgId;
                    userId = subscription.userId;
                }
            }

            await ctx.db.insert("invoices", {
                stripeInvoiceId: args.stripeInvoiceId,
                stripeCustomerId: args.stripeCustomerId,
                stripeSubscriptionId: args.stripeSubscriptionId,
                status: args.status,
                amountDue: args.amountDue,
                amountPaid: args.amountPaid,
                created: args.created,
                orgId,
                userId,
            });
        }

        return null;
    },
});

export const handleInvoicePaid = mutation({
    args: {
        stripeInvoiceId: v.string(),
        amountPaid: v.number(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const invoice = await ctx.db
            .query("invoices")
            .withIndex("by_stripe_invoice_id", (q) =>
                q.eq("stripeInvoiceId", args.stripeInvoiceId)
            )
            .unique();

        if (invoice) {
            await ctx.db.patch(invoice._id, {
                status: "paid",
                amountPaid: args.amountPaid,
            });
        }

        return null;
    },
});

export const handleInvoicePaymentFailed = mutation({
    args: {
        stripeInvoiceId: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const invoice = await ctx.db
            .query("invoices")
            .withIndex("by_stripe_invoice_id", (q) =>
                q.eq("stripeInvoiceId", args.stripeInvoiceId)
            )
            .unique();

        if (invoice) {
            await ctx.db.patch(invoice._id, {
                status: "open",
            });
        }

        return null;
    },
});

export const handlePaymentIntentSucceeded = mutation({
    args: {
        stripePaymentIntentId: v.string(),
        stripeCustomerId: v.optional(v.string()),
        amount: v.number(),
        currency: v.string(),
        status: v.string(),
        created: v.number(),
        metadata: v.optional(v.any()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("payments")
            .withIndex("by_stripe_payment_intent_id", (q) =>
                q.eq("stripePaymentIntentId", args.stripePaymentIntentId)
            )
            .unique();

        if (!existing) {
            // Extract orgId and userId from metadata if present
            const metadata = args.metadata || {};
            const orgId = metadata.orgId as string | undefined;
            const userId = metadata.userId as string | undefined;

            await ctx.db.insert("payments", {
                stripePaymentIntentId: args.stripePaymentIntentId,
                stripeCustomerId: args.stripeCustomerId,
                amount: args.amount,
                currency: args.currency,
                status: args.status,
                created: args.created,
                metadata: metadata,
                orgId: orgId,
                userId: userId,
            });
        } else if (args.stripeCustomerId && !existing.stripeCustomerId) {
            // Update customer ID if it wasn't set initially (webhook timing issue)
            await ctx.db.patch(existing._id, {
                stripeCustomerId: args.stripeCustomerId,
            });
        }

        return null;
    },
});

export const updatePaymentCustomer = mutation({
    args: {
        stripePaymentIntentId: v.string(),
        stripeCustomerId: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const payment = await ctx.db
            .query("payments")
            .withIndex("by_stripe_payment_intent_id", (q) =>
                q.eq("stripePaymentIntentId", args.stripePaymentIntentId)
            )
            .unique();

        if (payment && !payment.stripeCustomerId) {
            await ctx.db.patch(payment._id, {
                stripeCustomerId: args.stripeCustomerId,
            });
        }

        return null;
    },
});
