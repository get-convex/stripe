import { describe, expect, test } from "vitest";
import { StripeSubscriptions, registerRoutes } from "./index.js";
import { components } from "./setup.test.js";

describe("StripeSubscriptions client", () => {
  test("should create Stripe client with component", async () => {
    const client = new StripeSubscriptions(components.stripe);
    expect(client).toBeDefined();
    expect(client.component).toBeDefined();
  });

  test("should accept STRIPE_SECRET_KEY option", async () => {
    const client = new StripeSubscriptions(components.stripe, {
      STRIPE_SECRET_KEY: "sk_test_123",
    });
    expect(client).toBeDefined();
    // The apiKey getter should return the provided key
    expect(client.apiKey).toBe("sk_test_123");
  });

  test("should accept new checkout session options", async () => {
    const client = new StripeSubscriptions(components.stripe, {
      STRIPE_SECRET_KEY: "sk_test_123",
    });
    expect(client).toBeDefined();
  });

  test("should throw error when accessing apiKey without key set", async () => {
    // Clear the environment variable temporarily
    const originalKey = process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_SECRET_KEY;

    const client = new StripeSubscriptions(components.stripe);

    expect(() => client.apiKey).toThrow(
      "STRIPE_SECRET_KEY environment variable is not set"
    );

    // Restore the environment variable
    if (originalKey) {
      process.env.STRIPE_SECRET_KEY = originalKey;
    }
  });
  test("should throw when using allowPromotionCodes and discounts together", async () => {
    const client = new StripeSubscriptions(components.stripe, {
      STRIPE_SECRET_KEY: "sk_test_123",
    });
    await expect(
      client.createCheckoutSession({} as any, {
        priceId: "price_123",
        mode: "payment",
        successUrl: "https://example.com/success",
        cancelUrl: "https://example.com/cancel",
        allowPromotionCodes: true,
        discounts: [{ coupon: "coupon_123" }],
      }),
    ).rejects.toThrow(
      "Cannot use both allowPromotionCodes and discounts",
    );
  });
});

describe("registerRoutes", () => {
  test("registerRoutes function should be exported", () => {
    expect(typeof registerRoutes).toBe("function");
  });
});
