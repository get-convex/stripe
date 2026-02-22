declare const _default: import("convex/server").SchemaDefinition<{
    customers: import("convex/server").TableDefinition<import("convex/values").VObject<{
        email?: string | undefined;
        name?: string | undefined;
        metadata?: any;
        userId?: string | undefined;
        stripeCustomerId: string;
    }, {
        stripeCustomerId: import("convex/values").VString<string, "required">;
        email: import("convex/values").VString<string | undefined, "optional">;
        name: import("convex/values").VString<string | undefined, "optional">;
        metadata: import("convex/values").VAny<any, "optional", string>;
        userId: import("convex/values").VString<string | undefined, "optional">;
    }, "required", "email" | "name" | "metadata" | "userId" | "stripeCustomerId" | `metadata.${string}`>, {
        by_stripe_customer_id: ["stripeCustomerId", "_creationTime"];
        by_email: ["email", "_creationTime"];
        by_user_id: ["userId", "_creationTime"];
    }, {}, {}>;
    subscriptions: import("convex/server").TableDefinition<import("convex/values").VObject<{
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
    }, {
        stripeSubscriptionId: import("convex/values").VString<string, "required">;
        stripeCustomerId: import("convex/values").VString<string, "required">;
        status: import("convex/values").VString<string, "required">;
        currentPeriodEnd: import("convex/values").VFloat64<number, "required">;
        cancelAtPeriodEnd: import("convex/values").VBoolean<boolean, "required">;
        cancelAt: import("convex/values").VFloat64<number | undefined, "optional">;
        quantity: import("convex/values").VFloat64<number | undefined, "optional">;
        priceId: import("convex/values").VString<string, "required">;
        metadata: import("convex/values").VAny<any, "optional", string>;
        orgId: import("convex/values").VString<string | undefined, "optional">;
        userId: import("convex/values").VString<string | undefined, "optional">;
    }, "required", "metadata" | "userId" | "stripeSubscriptionId" | "quantity" | "cancelAt" | "status" | "cancelAtPeriodEnd" | "currentPeriodEnd" | "stripeCustomerId" | "priceId" | "orgId" | `metadata.${string}`>, {
        by_stripe_subscription_id: ["stripeSubscriptionId", "_creationTime"];
        by_stripe_customer_id: ["stripeCustomerId", "_creationTime"];
        by_org_id: ["orgId", "_creationTime"];
        by_user_id: ["userId", "_creationTime"];
    }, {}, {}>;
    checkout_sessions: import("convex/server").TableDefinition<import("convex/values").VObject<{
        metadata?: any;
        stripeCustomerId?: string | undefined;
        status: string;
        mode: string;
        stripeCheckoutSessionId: string;
    }, {
        stripeCheckoutSessionId: import("convex/values").VString<string, "required">;
        stripeCustomerId: import("convex/values").VString<string | undefined, "optional">;
        status: import("convex/values").VString<string, "required">;
        mode: import("convex/values").VString<string, "required">;
        metadata: import("convex/values").VAny<any, "optional", string>;
    }, "required", "metadata" | "status" | "stripeCustomerId" | "mode" | "stripeCheckoutSessionId" | `metadata.${string}`>, {
        by_stripe_checkout_session_id: ["stripeCheckoutSessionId", "_creationTime"];
        by_stripe_customer_id: ["stripeCustomerId", "_creationTime"];
    }, {}, {}>;
    payments: import("convex/server").TableDefinition<import("convex/values").VObject<{
        metadata?: any;
        userId?: string | undefined;
        stripeCustomerId?: string | undefined;
        orgId?: string | undefined;
        status: string;
        amount: number;
        created: number;
        currency: string;
        stripePaymentIntentId: string;
    }, {
        stripePaymentIntentId: import("convex/values").VString<string, "required">;
        stripeCustomerId: import("convex/values").VString<string | undefined, "optional">;
        amount: import("convex/values").VFloat64<number, "required">;
        currency: import("convex/values").VString<string, "required">;
        status: import("convex/values").VString<string, "required">;
        created: import("convex/values").VFloat64<number, "required">;
        metadata: import("convex/values").VAny<any, "optional", string>;
        orgId: import("convex/values").VString<string | undefined, "optional">;
        userId: import("convex/values").VString<string | undefined, "optional">;
    }, "required", "metadata" | "userId" | "status" | "stripeCustomerId" | "amount" | "created" | "currency" | "stripePaymentIntentId" | "orgId" | `metadata.${string}`>, {
        by_stripe_payment_intent_id: ["stripePaymentIntentId", "_creationTime"];
        by_stripe_customer_id: ["stripeCustomerId", "_creationTime"];
        by_org_id: ["orgId", "_creationTime"];
        by_user_id: ["userId", "_creationTime"];
    }, {}, {}>;
    invoices: import("convex/server").TableDefinition<import("convex/values").VObject<{
        userId?: string | undefined;
        stripeSubscriptionId?: string | undefined;
        orgId?: string | undefined;
        status: string;
        stripeCustomerId: string;
        amountDue: number;
        amountPaid: number;
        stripeInvoiceId: string;
        created: number;
    }, {
        stripeInvoiceId: import("convex/values").VString<string, "required">;
        stripeCustomerId: import("convex/values").VString<string, "required">;
        stripeSubscriptionId: import("convex/values").VString<string | undefined, "optional">;
        status: import("convex/values").VString<string, "required">;
        amountDue: import("convex/values").VFloat64<number, "required">;
        amountPaid: import("convex/values").VFloat64<number, "required">;
        created: import("convex/values").VFloat64<number, "required">;
        orgId: import("convex/values").VString<string | undefined, "optional">;
        userId: import("convex/values").VString<string | undefined, "optional">;
    }, "required", "userId" | "stripeSubscriptionId" | "status" | "stripeCustomerId" | "amountDue" | "amountPaid" | "stripeInvoiceId" | "created" | "orgId">, {
        by_stripe_invoice_id: ["stripeInvoiceId", "_creationTime"];
        by_stripe_customer_id: ["stripeCustomerId", "_creationTime"];
        by_stripe_subscription_id: ["stripeSubscriptionId", "_creationTime"];
        by_org_id: ["orgId", "_creationTime"];
        by_user_id: ["userId", "_creationTime"];
    }, {}, {}>;
}, true>;
export default _default;
//# sourceMappingURL=schema.d.ts.map