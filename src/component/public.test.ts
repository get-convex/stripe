import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api, internal } from "./_generated/api.js";
import schema from "./schema.js";
import { modules } from "./setup.test.js";

test("customer creation and retrieval", async () => {
  const t = convexTest(schema, modules);

  // Create a customer
  const customerId = await t.mutation(api.public.createOrUpdateCustomer, {
    stripeCustomerId: "cus_test123",
    email: "test@example.com",
    name: "Test User",
    metadata: { userId: "user_123" },
  });

  expect(customerId).toBeDefined();

  // Retrieve the customer
  const customer = await t.query(api.public.getCustomer, {
    stripeCustomerId: "cus_test123",
  });

  expect(customer).toBeDefined();
  expect(customer?.email).toBe("test@example.com");
  expect(customer?.name).toBe("Test User");
  expect(customer?.metadata).toEqual({ userId: "user_123" });
});

test("customer update", async () => {
  const t = convexTest(schema, modules);

  // Create initial customer
  await t.mutation(api.public.createOrUpdateCustomer, {
    stripeCustomerId: "cus_test456",
    email: "old@example.com",
    name: "Old Name",
  });

  // Update customer
  await t.mutation(api.public.createOrUpdateCustomer, {
    stripeCustomerId: "cus_test456",
    email: "new@example.com",
    name: "New Name",
    metadata: { updated: true },
  });

  // Verify update
  const customer = await t.query(api.public.getCustomer, {
    stripeCustomerId: "cus_test456",
  });

  expect(customer?.email).toBe("new@example.com");
  expect(customer?.name).toBe("New Name");
  expect(customer?.metadata).toEqual({ updated: true });
});

test("subscription creation via webhook", async () => {
  const t = convexTest(schema, modules);

  // Create customer first
  await t.mutation(api.private.handleCustomerCreated, {
    stripeCustomerId: "cus_test789",
    email: "customer@example.com",
    name: "Customer Name",
  });

  // Create subscription via webhook
  await t.mutation(api.private.handleSubscriptionCreated, {
    stripeSubscriptionId: "sub_test123",
    stripeCustomerId: "cus_test789",
    status: "active",
    currentPeriodEnd: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    cancelAtPeriodEnd: false,
    quantity: 5,
    priceId: "price_test",
    metadata: { orgId: "org_123" },
  });

  // Retrieve subscription
  const subscription = await t.query(api.public.getSubscription, {
    stripeSubscriptionId: "sub_test123",
  });

  expect(subscription).toBeDefined();
  expect(subscription?.status).toBe("active");
  expect(subscription?.quantity).toBe(5);
  expect(subscription?.metadata).toEqual({ orgId: "org_123" });
});

test("list subscriptions for customer", async () => {
  const t = convexTest(schema, modules);

  // Create customer
  await t.mutation(api.private.handleCustomerCreated, {
    stripeCustomerId: "cus_multi",
    email: "multi@example.com",
  });

  // Create multiple subscriptions
  await t.mutation(api.private.handleSubscriptionCreated, {
    stripeSubscriptionId: "sub_1",
    stripeCustomerId: "cus_multi",
    status: "active",
    currentPeriodEnd: Date.now(),
    cancelAtPeriodEnd: false,
    priceId: "price_1",
  });

  await t.mutation(api.private.handleSubscriptionCreated, {
    stripeSubscriptionId: "sub_2",
    stripeCustomerId: "cus_multi",
    status: "active",
    currentPeriodEnd: Date.now(),
    cancelAtPeriodEnd: false,
    priceId: "price_2",
  });

  // List subscriptions
  const subscriptions = await t.query(api.public.listSubscriptions, {
    stripeCustomerId: "cus_multi",
  });

  expect(subscriptions).toHaveLength(2);
  expect(subscriptions.map((s: any) => s.stripeSubscriptionId)).toContain("sub_1");
  expect(subscriptions.map((s: any) => s.stripeSubscriptionId)).toContain("sub_2");
});

test("update subscription metadata for custom lookups", async () => {
  const t = convexTest(schema, modules);

  // Create subscription
  await t.mutation(api.private.handleSubscriptionCreated, {
    stripeSubscriptionId: "sub_metadata",
    stripeCustomerId: "cus_test",
    status: "active",
    currentPeriodEnd: Date.now(),
    cancelAtPeriodEnd: false,
    priceId: "price_test",
  });

  // Update metadata
  await t.mutation(api.public.updateSubscriptionMetadata, {
    stripeSubscriptionId: "sub_metadata",
    metadata: {
      orgId: "org_456",
      userId: "user_789",
      plan: "pro",
    },
  });

  // Verify metadata
  const subscription = await t.query(api.public.getSubscription, {
    stripeSubscriptionId: "sub_metadata",
  });

  expect(subscription?.metadata).toEqual({
    orgId: "org_456",
    userId: "user_789",
    plan: "pro",
  });
});

test("subscription status update via webhook", async () => {
  const t = convexTest(schema, modules);

  // Create initial subscription
  await t.mutation(api.private.handleSubscriptionCreated, {
    stripeSubscriptionId: "sub_status",
    stripeCustomerId: "cus_test",
    status: "active",
    currentPeriodEnd: Date.now(),
    cancelAtPeriodEnd: false,
    priceId: "price_test",
  });

  // Update status to past_due
  await t.mutation(api.private.handleSubscriptionUpdated, {
    stripeSubscriptionId: "sub_status",
    status: "past_due",
    currentPeriodEnd: Date.now(),
    cancelAtPeriodEnd: false,
  });

  // Verify status update
  const subscription = await t.query(api.public.getSubscription, {
    stripeSubscriptionId: "sub_status",
  });

  expect(subscription?.status).toBe("past_due");
});

test("seat quantity update", async () => {
  const t = convexTest(schema, modules);

  // Create subscription with initial quantity
  await t.mutation(api.private.handleSubscriptionCreated, {
    stripeSubscriptionId: "sub_seats",
    stripeCustomerId: "cus_test",
    status: "active",
    currentPeriodEnd: Date.now(),
    cancelAtPeriodEnd: false,
    quantity: 5,
    priceId: "price_test",
  });

  // Update quantity
  await t.mutation(api.private.handleSubscriptionUpdated, {
    stripeSubscriptionId: "sub_seats",
    status: "active",
    currentPeriodEnd: Date.now(),
    cancelAtPeriodEnd: false,
    quantity: 10,
  });

  // Verify quantity update
  const subscription = await t.query(api.public.getSubscription, {
    stripeSubscriptionId: "sub_seats",
  });

  expect(subscription?.quantity).toBe(10);
});

// ============================================================================
// PAYMENT TESTS
// ============================================================================

test("payment creation via payment_intent.succeeded webhook", async () => {
  const t = convexTest(schema, modules);

  // Simulate payment_intent.succeeded webhook
  await t.mutation(api.private.handlePaymentIntentSucceeded, {
    stripePaymentIntentId: "pi_test123",
    stripeCustomerId: "cus_payment_test",
    amount: 1999, // $19.99
    currency: "usd",
    status: "succeeded",
    created: Date.now(),
    metadata: { orderId: "order_123" },
  });

  // Retrieve the payment
  const payment = await t.query(api.public.getPayment, {
    stripePaymentIntentId: "pi_test123",
  });

  expect(payment).toBeDefined();
  expect(payment?.amount).toBe(1999);
  expect(payment?.currency).toBe("usd");
  expect(payment?.status).toBe("succeeded");
  expect(payment?.stripeCustomerId).toBe("cus_payment_test");
  expect(payment?.metadata).toEqual({ orderId: "order_123" });
});

test("payment without customer (guest checkout)", async () => {
  const t = convexTest(schema, modules);

  // Create payment without customer ID (guest checkout)
  await t.mutation(api.private.handlePaymentIntentSucceeded, {
    stripePaymentIntentId: "pi_guest123",
    amount: 2500,
    currency: "usd",
    status: "succeeded",
    created: Date.now(),
    metadata: {},
  });

  const payment = await t.query(api.public.getPayment, {
    stripePaymentIntentId: "pi_guest123",
  });

  expect(payment).toBeDefined();
  expect(payment?.stripeCustomerId).toBeUndefined();
});

test("payment with orgId and userId extraction from metadata", async () => {
  const t = convexTest(schema, modules);

  // Create payment with orgId and userId in metadata
  await t.mutation(api.private.handlePaymentIntentSucceeded, {
    stripePaymentIntentId: "pi_org123",
    stripeCustomerId: "cus_org_test",
    amount: 5000,
    currency: "usd",
    status: "succeeded",
    created: Date.now(),
    metadata: {
      orgId: "org_demo_123",
      userId: "user_demo_456",
      customField: "custom_value",
    },
  });

  const payment = await t.query(api.public.getPayment, {
    stripePaymentIntentId: "pi_org123",
  });

  expect(payment?.orgId).toBe("org_demo_123");
  expect(payment?.userId).toBe("user_demo_456");
  expect(payment?.metadata).toEqual({
    orgId: "org_demo_123",
    userId: "user_demo_456",
    customField: "custom_value",
  });
});

test("list payments by customer ID", async () => {
  const t = convexTest(schema, modules);

  // Create multiple payments for the same customer
  await t.mutation(api.private.handlePaymentIntentSucceeded, {
    stripePaymentIntentId: "pi_cust1",
    stripeCustomerId: "cus_multi_test",
    amount: 1000,
    currency: "usd",
    status: "succeeded",
    created: Date.now(),
    metadata: {},
  });

  await t.mutation(api.private.handlePaymentIntentSucceeded, {
    stripePaymentIntentId: "pi_cust2",
    stripeCustomerId: "cus_multi_test",
    amount: 2000,
    currency: "usd",
    status: "succeeded",
    created: Date.now(),
    metadata: {},
  });

  await t.mutation(api.private.handlePaymentIntentSucceeded, {
    stripePaymentIntentId: "pi_other",
    stripeCustomerId: "cus_other",
    amount: 3000,
    currency: "usd",
    status: "succeeded",
    created: Date.now(),
    metadata: {},
  });

  // List payments for the specific customer
  const payments = await t.query(api.public.listPayments, {
    stripeCustomerId: "cus_multi_test",
  });

  expect(payments).toHaveLength(2);
  expect(payments?.map((p: any) => p.stripePaymentIntentId)).toContain("pi_cust1");
  expect(payments?.map((p: any) => p.stripePaymentIntentId)).toContain("pi_cust2");
});

test("list payments by user ID", async () => {
  const t = convexTest(schema, modules);

  // Create payments with different user IDs
  await t.mutation(api.private.handlePaymentIntentSucceeded, {
    stripePaymentIntentId: "pi_user1",
    stripeCustomerId: "cus_test",
    amount: 1500,
    currency: "usd",
    status: "succeeded",
    created: Date.now(),
    metadata: { userId: "user_alice" },
  });

  await t.mutation(api.private.handlePaymentIntentSucceeded, {
    stripePaymentIntentId: "pi_user2",
    stripeCustomerId: "cus_test",
    amount: 2500,
    currency: "usd",
    status: "succeeded",
    created: Date.now(),
    metadata: { userId: "user_alice" },
  });

  await t.mutation(api.private.handlePaymentIntentSucceeded, {
    stripePaymentIntentId: "pi_user3",
    stripeCustomerId: "cus_test2",
    amount: 3500,
    currency: "usd",
    status: "succeeded",
    created: Date.now(),
    metadata: { userId: "user_bob" },
  });

  // List payments for user_alice
  const alicePayments = await t.query(api.public.listPaymentsByUserId, {
    userId: "user_alice",
  });

  expect(alicePayments).toHaveLength(2);
  expect(alicePayments?.every((p: any) => p.userId === "user_alice")).toBe(true);
});

test("list payments by org ID", async () => {
  const t = convexTest(schema, modules);

  // Create payments with different org IDs
  await t.mutation(api.private.handlePaymentIntentSucceeded, {
    stripePaymentIntentId: "pi_org1",
    stripeCustomerId: "cus_test",
    amount: 1500,
    currency: "usd",
    status: "succeeded",
    created: Date.now(),
    metadata: { orgId: "org_acme" },
  });

  await t.mutation(api.private.handlePaymentIntentSucceeded, {
    stripePaymentIntentId: "pi_org2",
    stripeCustomerId: "cus_test",
    amount: 2500,
    currency: "usd",
    status: "succeeded",
    created: Date.now(),
    metadata: { orgId: "org_acme" },
  });

  await t.mutation(api.private.handlePaymentIntentSucceeded, {
    stripePaymentIntentId: "pi_org3",
    stripeCustomerId: "cus_test2",
    amount: 3500,
    currency: "usd",
    status: "succeeded",
    created: Date.now(),
    metadata: { orgId: "org_other" },
  });

  // List payments for org_acme
  const acmePayments = await t.query(api.public.listPaymentsByOrgId, {
    orgId: "org_acme",
  });

  expect(acmePayments).toHaveLength(2);
  expect(acmePayments?.every((p: any) => p.orgId === "org_acme")).toBe(true);
});

test("automatic customer linking - webhook timing fix", async () => {
  const t = convexTest(schema, modules);

  // Step 1: payment_intent.succeeded fires first (without customer)
  await t.mutation(api.private.handlePaymentIntentSucceeded, {
    stripePaymentIntentId: "pi_timing_test",
    amount: 4999,
    currency: "usd",
    status: "succeeded",
    created: Date.now(),
    metadata: { orderId: "order_timing" },
  });

  // Verify payment exists without customer
  let payment = await t.query(api.public.getPayment, {
    stripePaymentIntentId: "pi_timing_test",
  });

  expect(payment).toBeDefined();
  expect(payment?.stripeCustomerId).toBeUndefined();

  // Step 2: checkout.session.completed fires later with customer ID
  await t.mutation(api.private.updatePaymentCustomer, {
    stripePaymentIntentId: "pi_timing_test",
    stripeCustomerId: "cus_timing_test",
  });

  // Verify payment now has customer ID
  payment = await t.query(api.public.getPayment, {
    stripePaymentIntentId: "pi_timing_test",
  });

  expect(payment?.stripeCustomerId).toBe("cus_timing_test");
  expect(payment?.amount).toBe(4999); // Other fields unchanged
});

test("updatePaymentCustomer does not overwrite existing customer", async () => {
  const t = convexTest(schema, modules);

  // Create payment with customer ID
  await t.mutation(api.private.handlePaymentIntentSucceeded, {
    stripePaymentIntentId: "pi_no_overwrite",
    stripeCustomerId: "cus_original",
    amount: 3000,
    currency: "usd",
    status: "succeeded",
    created: Date.now(),
    metadata: {},
  });

  // Try to update with different customer ID (should not change)
  await t.mutation(api.private.updatePaymentCustomer, {
    stripePaymentIntentId: "pi_no_overwrite",
    stripeCustomerId: "cus_different",
  });

  // Verify original customer ID is preserved
  const payment = await t.query(api.public.getPayment, {
    stripePaymentIntentId: "pi_no_overwrite",
  });

  expect(payment?.stripeCustomerId).toBe("cus_original");
});

test("handlePaymentIntentSucceeded updates existing payment with customer", async () => {
  const t = convexTest(schema, modules);

  // Create payment without customer
  await t.mutation(api.private.handlePaymentIntentSucceeded, {
    stripePaymentIntentId: "pi_update_test",
    amount: 5500,
    currency: "eur",
    status: "succeeded",
    created: Date.now(),
    metadata: {},
  });

  // Same webhook fires again with customer (idempotency)
  await t.mutation(api.private.handlePaymentIntentSucceeded, {
    stripePaymentIntentId: "pi_update_test",
    stripeCustomerId: "cus_idempotent",
    amount: 5500,
    currency: "eur",
    status: "succeeded",
    created: Date.now(),
    metadata: {},
  });

  const payment = await t.query(api.public.getPayment, {
    stripePaymentIntentId: "pi_update_test",
  });

  expect(payment?.stripeCustomerId).toBe("cus_idempotent");
});

