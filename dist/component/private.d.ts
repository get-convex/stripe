export declare const listSubscriptionsWithCreationTime: import("convex/server").RegisteredQuery<"public", {
    stripeCustomerId: string;
}, Promise<{
    _creationTime: number;
    stripeSubscriptionId: string;
    stripeCustomerId: string;
    status: string;
}[]>>;
export declare const updateSubscriptionQuantityInternal: import("convex/server").RegisteredMutation<"public", {
    stripeSubscriptionId: string;
    quantity: number;
}, Promise<null>>;
export declare const handleCustomerCreated: import("convex/server").RegisteredMutation<"public", {
    email?: string | undefined;
    name?: string | undefined;
    metadata?: any;
    stripeCustomerId: string;
}, Promise<null>>;
export declare const handleCustomerUpdated: import("convex/server").RegisteredMutation<"public", {
    email?: string | undefined;
    name?: string | undefined;
    metadata?: any;
    stripeCustomerId: string;
}, Promise<null>>;
export declare const handleSubscriptionCreated: import("convex/server").RegisteredMutation<"public", {
    metadata?: any;
    quantity?: number | undefined;
    cancelAt?: number | undefined;
    stripeSubscriptionId: string;
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: number;
    stripeCustomerId: string;
    priceId: string;
}, Promise<null>>;
export declare const handleSubscriptionUpdated: import("convex/server").RegisteredMutation<"public", {
    metadata?: any;
    quantity?: number | undefined;
    cancelAt?: number | undefined;
    priceId?: string | undefined;
    stripeSubscriptionId: string;
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: number;
}, Promise<null>>;
export declare const handleSubscriptionDeleted: import("convex/server").RegisteredMutation<"public", {
    cancelAt?: number | undefined;
    cancelAtPeriodEnd?: boolean | undefined;
    currentPeriodEnd?: number | undefined;
    stripeSubscriptionId: string;
}, Promise<null>>;
export declare const handleCheckoutSessionCompleted: import("convex/server").RegisteredMutation<"public", {
    metadata?: any;
    stripeCustomerId?: string | undefined;
    mode: string;
    stripeCheckoutSessionId: string;
}, Promise<null>>;
export declare const handleInvoiceCreated: import("convex/server").RegisteredMutation<"public", {
    stripeSubscriptionId?: string | undefined;
    status: string;
    stripeCustomerId: string;
    amountDue: number;
    amountPaid: number;
    stripeInvoiceId: string;
    created: number;
}, Promise<null>>;
export declare const handleInvoicePaid: import("convex/server").RegisteredMutation<"public", {
    amountPaid: number;
    stripeInvoiceId: string;
}, Promise<null>>;
export declare const handleInvoicePaymentFailed: import("convex/server").RegisteredMutation<"public", {
    stripeInvoiceId: string;
}, Promise<null>>;
export declare const handlePaymentIntentSucceeded: import("convex/server").RegisteredMutation<"public", {
    metadata?: any;
    stripeCustomerId?: string | undefined;
    status: string;
    amount: number;
    created: number;
    currency: string;
    stripePaymentIntentId: string;
}, Promise<null>>;
export declare const updatePaymentCustomer: import("convex/server").RegisteredMutation<"public", {
    stripeCustomerId: string;
    stripePaymentIntentId: string;
}, Promise<null>>;
//# sourceMappingURL=private.d.ts.map