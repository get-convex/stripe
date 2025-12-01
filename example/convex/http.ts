import { httpRouter } from "convex/server";
import { components } from "./_generated/api";
import { registerRoutes } from "@convex-dev/stripe";

const http = httpRouter();

// Register Stripe webhooks with custom event handlers
// Webhook URL: https://<deployment>.convex.site/stripe/webhook
registerRoutes(http, components.stripe, {
  webhookPath: "/stripe/webhook",
  events: {
    "customer.subscription.updated": async (ctx, event) => {
      // Example custom handler: Log subscription updates
      const subscription = event.data.object;
      console.log("🔔 Custom handler: Subscription updated!", {
        id: subscription.id,
        status: subscription.status,
      });

      // You can run additional logic here after the default database sync
      // For example, send a notification, update other tables, etc.
    },
    "payment_intent.succeeded": async (ctx, event) => {
      // Example custom handler: Log successful one-time payments
      const paymentIntent = event.data.object;
      console.log("💰 Custom handler: Payment succeeded!", {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
      });
    },
  },
  onEvent: async (ctx, event) => {
    // Log all events for monitoring/debugging
    console.log(`📊 Event received: ${event.type}`, {
      id: event.id,
      created: new Date(event.created * 1000).toISOString(),
    });

    // Example: Send to analytics service
    // await ctx.runMutation(internal.analytics.trackEvent, {
    //   eventType: event.type,
    //   eventId: event.id,
    // });

    // Example: Update audit log
    // await ctx.runMutation(internal.audit.logWebhookEvent, {
    //   eventType: event.type,
    //   eventData: event.data,
    // });
  },
});

export default http;
