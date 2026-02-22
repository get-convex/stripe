/**
 * Get a customer by their Stripe customer ID.
 */
export declare const getCustomer: import("convex/server").RegisteredQuery<"public", {
    stripeCustomerId: string;
}, Promise<{
    email?: string | undefined;
    name?: string | undefined;
    metadata?: any;
    userId?: string | undefined;
    stripeCustomerId: string;
} | null>>;
/**
 * Get a customer by their email address.
 * Uses the by_email index for efficient lookup.
 */
export declare const getCustomerByEmail: import("convex/server").RegisteredQuery<"public", {
    email: string;
}, Promise<{
    email?: string | undefined;
    name?: string | undefined;
    metadata?: any;
    userId?: string | undefined;
    stripeCustomerId: string;
} | null>>;
/**
 * Get a customer by their user ID.
 * Uses the by_user_id index for efficient lookup.
 */
export declare const getCustomerByUserId: import("convex/server").RegisteredQuery<"public", {
    userId: string;
}, Promise<{
    email?: string | undefined;
    name?: string | undefined;
    metadata?: any;
    userId?: string | undefined;
    stripeCustomerId: string;
} | null>>;
/**
 * Get a subscription by its Stripe subscription ID.
 */
export declare const getSubscription: import("convex/server").RegisteredQuery<"public", {
    stripeSubscriptionId: string;
}, Promise<{
    metadata?: any;
    userId?: string | undefined;
    quantity?: number | undefined;
    cancelAt?: number | undefined;
    orgId?: string | undefined;
    stripeSubscriptionId: string;
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: number;
    stripeCustomerId: string;
    priceId: string;
} | null>>;
/**
 * List all subscriptions for a customer.
 */
export declare const listSubscriptions: import("convex/server").RegisteredQuery<"public", {
    stripeCustomerId: string;
}, Promise<{
    metadata?: any;
    userId?: string | undefined;
    quantity?: number | undefined;
    cancelAt?: number | undefined;
    orgId?: string | undefined;
    stripeSubscriptionId: string;
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: number;
    stripeCustomerId: string;
    priceId: string;
}[]>>;
/**
 * Get a subscription by organization ID.
 * Useful for looking up subscriptions by custom orgId.
 */
export declare const getSubscriptionByOrgId: import("convex/server").RegisteredQuery<"public", {
    orgId: string;
}, Promise<{
    metadata?: any;
    userId?: string | undefined;
    quantity?: number | undefined;
    cancelAt?: number | undefined;
    orgId?: string | undefined;
    stripeSubscriptionId: string;
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: number;
    stripeCustomerId: string;
    priceId: string;
} | null>>;
/**
 * List all subscriptions for an organization ID.
 */
export declare const listSubscriptionsByOrgId: import("convex/server").RegisteredQuery<"public", {
    orgId: string;
}, Promise<{
    metadata?: any;
    userId?: string | undefined;
    quantity?: number | undefined;
    cancelAt?: number | undefined;
    orgId?: string | undefined;
    stripeSubscriptionId: string;
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: number;
    stripeCustomerId: string;
    priceId: string;
}[]>>;
/**
 * List all subscriptions for a user ID.
 * Useful for looking up subscriptions by custom userId.
 */
export declare const listSubscriptionsByUserId: import("convex/server").RegisteredQuery<"public", {
    userId: string;
}, Promise<{
    metadata?: any;
    userId?: string | undefined;
    quantity?: number | undefined;
    cancelAt?: number | undefined;
    orgId?: string | undefined;
    stripeSubscriptionId: string;
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: number;
    stripeCustomerId: string;
    priceId: string;
}[]>>;
/**
 * Get a payment by its Stripe payment intent ID.
 */
export declare const getPayment: import("convex/server").RegisteredQuery<"public", {
    stripePaymentIntentId: string;
}, Promise<{
    metadata?: any;
    userId?: string | undefined;
    stripeCustomerId?: string | undefined;
    orgId?: string | undefined;
    status: string;
    amount: number;
    created: number;
    currency: string;
    stripePaymentIntentId: string;
} | null>>;
/**
 * List payments for a customer.
 */
export declare const listPayments: import("convex/server").RegisteredQuery<"public", {
    stripeCustomerId: string;
}, Promise<{
    metadata?: any;
    userId?: string | undefined;
    stripeCustomerId?: string | undefined;
    orgId?: string | undefined;
    status: string;
    amount: number;
    created: number;
    currency: string;
    stripePaymentIntentId: string;
}[]>>;
/**
 * List payments for a user ID.
 */
export declare const listPaymentsByUserId: import("convex/server").RegisteredQuery<"public", {
    userId: string;
}, Promise<{
    metadata?: any;
    userId?: string | undefined;
    stripeCustomerId?: string | undefined;
    orgId?: string | undefined;
    status: string;
    amount: number;
    created: number;
    currency: string;
    stripePaymentIntentId: string;
}[]>>;
/**
 * List payments for an organization ID.
 */
export declare const listPaymentsByOrgId: import("convex/server").RegisteredQuery<"public", {
    orgId: string;
}, Promise<{
    metadata?: any;
    userId?: string | undefined;
    stripeCustomerId?: string | undefined;
    orgId?: string | undefined;
    status: string;
    amount: number;
    created: number;
    currency: string;
    stripePaymentIntentId: string;
}[]>>;
/**
 * List invoices for a customer.
 */
export declare const listInvoices: import("convex/server").RegisteredQuery<"public", {
    stripeCustomerId: string;
}, Promise<{
    userId?: string | undefined;
    stripeSubscriptionId?: string | undefined;
    orgId?: string | undefined;
    status: string;
    stripeCustomerId: string;
    amountDue: number;
    amountPaid: number;
    stripeInvoiceId: string;
    created: number;
}[]>>;
/**
 * List invoices for an organization ID.
 */
export declare const listInvoicesByOrgId: import("convex/server").RegisteredQuery<"public", {
    orgId: string;
}, Promise<{
    userId?: string | undefined;
    stripeSubscriptionId?: string | undefined;
    orgId?: string | undefined;
    status: string;
    stripeCustomerId: string;
    amountDue: number;
    amountPaid: number;
    stripeInvoiceId: string;
    created: number;
}[]>>;
/**
 * List invoices for a user ID.
 */
export declare const listInvoicesByUserId: import("convex/server").RegisteredQuery<"public", {
    userId: string;
}, Promise<{
    userId?: string | undefined;
    stripeSubscriptionId?: string | undefined;
    orgId?: string | undefined;
    status: string;
    stripeCustomerId: string;
    amountDue: number;
    amountPaid: number;
    stripeInvoiceId: string;
    created: number;
}[]>>;
/**
 * Get a checkout session by its Stripe checkout session ID.
 */
export declare const getCheckoutSession: import("convex/server").RegisteredQuery<"public", {
    stripeCheckoutSessionId: string;
}, Promise<{
    metadata?: any;
    stripeCustomerId?: string | undefined;
    status: string;
    mode: string;
    stripeCheckoutSessionId: string;
} | null>>;
/**
 * List checkout sessions for a customer.
 */
export declare const listCheckoutSessions: import("convex/server").RegisteredQuery<"public", {
    stripeCustomerId: string;
}, Promise<{
    metadata?: any;
    stripeCustomerId?: string | undefined;
    status: string;
    mode: string;
    stripeCheckoutSessionId: string;
}[]>>;
/**
 * Create or update a customer with metadata.
 * Returns the stripeCustomerId for consistency with the API.
 */
export declare const createOrUpdateCustomer: import("convex/server").RegisteredMutation<"public", {
    email?: string | undefined;
    name?: string | undefined;
    metadata?: any;
    stripeCustomerId: string;
}, Promise<string>>;
/**
 * Update subscription metadata for custom lookups.
 * You can provide orgId and userId for efficient indexed lookups,
 * and additional data in the metadata field.
 */
export declare const updateSubscriptionMetadata: import("convex/server").RegisteredMutation<"public", {
    userId?: string | undefined;
    orgId?: string | undefined;
    metadata: any;
    stripeSubscriptionId: string;
}, Promise<null>>;
/**
 * Update subscription quantity (for seat-based pricing).
 * This will update both Stripe and the local database.
 * Reads STRIPE_SECRET_KEY from environment variables.
 */
export declare const updateSubscriptionQuantity: import("convex/server").RegisteredAction<"public", {
    stripeSubscriptionId: string;
    quantity: number;
}, Promise<null>>;
//# sourceMappingURL=public.d.ts.map