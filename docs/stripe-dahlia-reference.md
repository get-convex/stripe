# Stripe API Release: Dahlia

> **Dahlia** is the fourth release in Stripe's [flora-named API versioning model](http://stripe.com/blog/introducing-stripes-new-api-release-process). Prior releases: [Acacia](https://docs.stripe.com/changelog/acacia.md), [Basil](https://docs.stripe.com/changelog/basil.md), and [Clover](https://docs.stripe.com/changelog/clover.md). Each time Stripe introduces a breaking-change version, the release moves to the next flower name.

**Base version:** `2026-03-25.dahlia`

As the first version in the Dahlia release, `2026-03-25.dahlia` introduces both breaking changes and new features. Subsequent Dahlia versions include only additive (non-breaking) changes.

**Upgrade guide:** [Upgrade your API version](https://docs.stripe.com/upgrades.md)

**Full changelog:** [Learn what's changing in Dahlia](https://docs.stripe.com/changelog/dahlia.md)

---

## Table of Contents

- [April 22, 2026 — GA Channel (`2026-04-22.dahlia`)](#april-22-2026--ga-channel-2026-04-22dahlia)
- [April 22, 2026 — Preview Channel (`2026-04-22.preview`)](#april-22-2026--preview-channel-2026-04-22preview)
- [March 25, 2026 — GA Channel (`2026-03-25.dahlia`)](#march-25-2026--ga-channel-2026-03-25dahlia)
- [March 25, 2026 — Preview Channel (`2026-03-25.preview`)](#march-25-2026--preview-channel-2026-03-25preview)

---

## April 22, 2026 — GA Channel (`2026-04-22.dahlia`)

### Summary

- **New payment method support**: Added [support for Sunbit](https://docs.stripe.com/changelog/dahlia/2026-04-22/sunbit-buy-now-pay-later-support.md), a buy now, pay later (BNPL) payment method. Also added [support for Pix recurring payments](https://docs.stripe.com/changelog/dahlia/2026-04-22/pix-recurring-payments-support.md), allowing subscriptions that use Pix as the payment method for recurring billing for customers in Brazil.
- **Managed Payments**: Stripe's merchant of record solution, [Managed Payments](https://docs.stripe.com/payments/managed-payments.md), is now available in [Checkout Sessions](https://docs.stripe.com/api/checkout/sessions.md?api-version=2026-04-22.dahlia) and [Payment Links](https://docs.stripe.com/api/payment-link.md?api-version=2026-04-22.dahlia). When enabled, Stripe handles indirect tax compliance (in more than 80 countries), fraud prevention, dispute management, and transaction-level customer support for digital sellers.
- **New tax ID types**: You can now [collect and store tax identification information](https://docs.stripe.com/changelog/dahlia/2026-04-22/new-tax-id-types-support.md) for customers in the Faroe Islands, Gibraltar, Italy, and Paraguay.
- **Treasury inbound transfer tracking**: [New balance transaction types](https://docs.stripe.com/changelog/dahlia/2026-04-22/inbound-transfers-balance-transaction-types.md) help track fund movements related to Treasury inbound transfers and their reversals.
- **Issuing card-presence spending controls**: A new [card-presence spending control](https://docs.stripe.com/changelog/dahlia/2026-04-22/issuing-card-presence-spending-control.md) for [Issuing](https://docs.stripe.com/issuing.md) allows or blocks authorizations based on whether the card was physically present during the transaction.
- **Improved fraud prevention with Radar**: You can now [maintain lists](https://docs.stripe.com/changelog/dahlia/2026-04-22/radar-value-lists-account-item-type.md) of trusted or blocked accounts for risk assessment. These account-based value lists integrate with [Radar rules](https://docs.stripe.com/radar/rules.md) to help make informed decisions about payment processing based on account-level risk factors.

### Payments

| Title | Affected Products | Breaking? | Category |
| ----- | ----------------- | --------- | -------- |
| [Adds support for Sunbit, a buy now, pay later payment method](https://docs.stripe.com/changelog/dahlia/2026-04-22/sunbit-buy-now-pay-later-support.md) | Payments | Non-breaking | api |
| [Adds support for Pix recurring payments](https://docs.stripe.com/changelog/dahlia/2026-04-22/pix-recurring-payments-support.md) | Payments | Non-breaking | api |
| [Adds the moto property to Setup Attempt payment method details for cards](https://docs.stripe.com/changelog/dahlia/2026-04-22/setup-attempt-payment-method-details-for-cards-moto.md) | Payments | Non-breaking | api |
| [Adds QR code support for Klarna payments with Terminal readers](https://docs.stripe.com/changelog/dahlia/2026-04-22/klarna-payments-with-terminal-readers-qr-code-support.md) | All products | Non-breaking | api |
| [Adds an amount confirmation parameter to the Payment Intent API](https://docs.stripe.com/changelog/dahlia/2026-04-22/amount-confirmation-parameter-to-paymentintent.md) | Payments | Non-breaking | api |
| [Adds support for Managed Payments, Stripe's merchant of record solution](https://docs.stripe.com/changelog/dahlia/2026-04-22/managed-payments.md) | Checkout, Paymentlinks, Payments | Non-breaking | api |

### Tax

| Title | Affected Products | Breaking? | Category |
| ----- | ----------------- | --------- | -------- |
| [Adds the ability to collect and store tax identification information for customers in the Faroe Islands, Gibraltar, Italy, and Paraguay](https://docs.stripe.com/changelog/dahlia/2026-04-22/new-tax-id-types-support.md) | Tax, Invoicing | Non-breaking | api |
| [Adds expandable tax rate property to tax rate details](https://docs.stripe.com/changelog/dahlia/2026-04-22/adds-expandable-tax-rate-property-to-tax-rate-details.md) | Invoicing | Non-breaking | api |

### Additional Updates

| Title | Affected Products | Breaking? | Category |
| ----- | ----------------- | --------- | -------- |
| [Adds account as a new item type to Radar value lists](https://docs.stripe.com/changelog/dahlia/2026-04-22/radar-value-lists-account-item-type.md) | Radar | Non-breaking | api |
| [Removes mandatory payments KYC onboarding for app distribution for Stripe Apps](https://docs.stripe.com/changelog/dahlia/2026-04-22/app-distribution-capability.md) | All products | Non-breaking | api |
| [Adds fulfillment error to issuing card cancellation and replacement reasons](https://docs.stripe.com/changelog/dahlia/2026-04-22/fulfillment-error-to-issuing-card-cancellation-and-replacement.md) | Issuing | Non-breaking | api |
| [Adds balance report and payout reconciliation report embedded components to the Account Session API](https://docs.stripe.com/changelog/dahlia/2026-04-22/balance-and-payout-reconciliation-report-embedded-components.md) | Connect | Non-breaking | api |
| [Adds support for Azure Event Grid as an event destination](https://docs.stripe.com/changelog/dahlia/2026-04-22/azure-event-grid-event-destination.md) | All products | Non-breaking | api |
| [Adds new balance transaction types for inbound transfers and reversals](https://docs.stripe.com/changelog/dahlia/2026-04-22/inbound-transfers-balance-transaction-types.md) | Treasury | Non-breaking | api |
| [Adds support for Phantom Cash and USDT to stablecoin payments](https://docs.stripe.com/changelog/dahlia/2026-04-22/stablecoin-payments-phantom-cash-and-usdt.md) | Crypto | Non-breaking | api |
| [Adds the Product Catalog Import API v2](https://docs.stripe.com/changelog/dahlia/2026-04-22/introduces-product-catalog-import-api-v2.md) | All products | Non-breaking | api |
| [Adds a card-presence spending control for Issuing](https://docs.stripe.com/changelog/dahlia/2026-04-22/issuing-card-presence-spending-control.md) | Issuing | Non-breaking | api |

---

## April 22, 2026 — Preview Channel (`2026-04-22.preview`)

### Summary

- **Automatic surcharge with Checkout Sessions**: You can now automatically [calculate and collect surcharge fees](https://docs.stripe.com/changelog/dahlia/2026-04-22/checkout-sessions-automatic-surcharge.md) when using Checkout Sessions.
- **Programmatic access to account activity logs**: The new [Activity Logs](https://docs.stripe.com/api/v2/iam/activity-logs.md?api-version=2026-04-22.preview) API provides programmatic access to your account's security history, including API key management, user invitations, and role changes.
- **New Global Payout destinations**: [Global Payouts](https://docs.stripe.com/global-payouts.md) now supports [recipient bank accounts in Japan and China](https://docs.stripe.com/changelog/dahlia/2026-04-22/cross-border-payouts-new-countries.md) for cross-border payouts.
- **Expanded Accounts v2 availability**: The [Accounts v2](https://docs.stripe.com/api/v2/core/accounts.md?api-version=2026-04-22.preview) API is now [available to all Stripe users](https://docs.stripe.com/changelog/dahlia/2026-04-22/accounts-v2-expanded-availability.md), not only Connect platforms.
- **New agentic commerce capabilities**: Added the [Orchestrated Commerce Agreements API](https://docs.stripe.com/changelog/dahlia/2026-04-22/orchestrated-commerce-agreements-api.md) to manage relationships with other businesses for agentic commerce integrations. Also added the [Shared Payment Issued Token](https://docs.stripe.com/changelog/dahlia/2026-04-22/shared-payment-issued-token.md) (allows agents to grant sellers scoped access to a customer's payment credentials) and the [Shared Payment Granted Token](https://docs.stripe.com/changelog/dahlia/2026-04-22/shared-payment-granted-token.md) (allows sellers to accept delegated payments from agents).
- **Programmatic invocation of Stripe Workflows**: You can now programmatically [invoke and monitor Stripe Workflows](https://docs.stripe.com/changelog/dahlia/2026-04-22/adds-workflows-api-with-programmatic-invocation.md) through the API, triggering workflows in response to application events and user actions.

### Agentic Commerce

| Title | Affected Products | Breaking? | Category |
| ----- | ----------------- | --------- | -------- |
| [Adds the Shared Payment Granted Token for managing payment methods shared by agents](https://docs.stripe.com/changelog/dahlia/2026-04-22/shared-payment-granted-token.md) | All products | Non-breaking | api |
| [Adds the SharedPaymentIssuedToken resource to allow agents to give sellers scoped access to a customer's credentials](https://docs.stripe.com/changelog/dahlia/2026-04-22/shared-payment-issued-token.md) | Payments | Non-breaking | api |
| [Adds the Orchestrated Commerce Agreements API to manage relationships for agentic commerce integrations](https://docs.stripe.com/changelog/dahlia/2026-04-22/orchestrated-commerce-agreements-api.md) | All products | Non-breaking | api |

### Billing

| Title | Affected Products | Breaking? | Category |
| ----- | ----------------- | --------- | -------- |
| [Adds validation for billing meter event values with more than 15 digits](https://docs.stripe.com/changelog/dahlia/2026-04-22/billing-meter-event-values-validation.md) | Billing | **Breaking** | api |
| [Adds Blik as a supported payment method for recurring payments in Stripe Billing](https://docs.stripe.com/changelog/dahlia/2026-04-22/stripe-billing-blik-recurring-payments.md) | Billing, Checkout | Non-breaking | api |

### Payouts

| Title | Affected Products | Breaking? | Category |
| ----- | ----------------- | --------- | -------- |
| [Adds support for Japan and China as Global Payouts cross-border payout destinations](https://docs.stripe.com/changelog/dahlia/2026-04-22/cross-border-payouts-new-countries.md) | Payouts | **Breaking** | api |
| [Adds credential reuse for Global Payouts with Accounts v2](https://docs.stripe.com/changelog/dahlia/2026-04-22/credential-reuse-with-accounts-v2.md) | Payouts, Payments, Billing, Connect | Non-breaking | api |

### Additional Updates

| Title | Affected Products | Breaking? | Category |
| ----- | ----------------- | --------- | -------- |
| [Updates transaction categories to use flow-specific reversal types and adds Stripe fee tax category](https://docs.stripe.com/changelog/dahlia/2026-04-22/transaction-categories-flow-specific-reversal-types.md) | Treasury | **Breaking** | api |
| [Makes the radar session property optional in the Payment Evaluations API](https://docs.stripe.com/changelog/dahlia/2026-04-22/payment-evaluations-optional-radar-session.md) | Radar | **Breaking** | api |
| [Adds support for automatic surcharge calculations on Checkout Sessions](https://docs.stripe.com/changelog/dahlia/2026-04-22/checkout-sessions-automatic-surcharge.md) | Checkout | Non-breaking | api |
| [Adds the Stripe fee tax transaction category](https://docs.stripe.com/changelog/dahlia/2026-04-22/stripe-fee-tax-transaction-category.md) | Treasury | Non-breaking | api |
| [Adds programmatic invocation of Stripe Workflows](https://docs.stripe.com/changelog/dahlia/2026-04-22/adds-workflows-api-with-programmatic-invocation.md) | All products | Non-breaking | api |
| [Adds the Stripe profiles API to represent public business identities on Stripe](https://docs.stripe.com/changelog/dahlia/2026-04-22/stripe-profiles-apis.md) | All products | Non-breaking | api |
| [Adds DELETE method support to the Batch API](https://docs.stripe.com/changelog/dahlia/2026-04-22/batch-api-delete-method.md) | All products | Non-breaking | api |
| [Adds validation errors property to the Redaction Job object](https://docs.stripe.com/changelog/dahlia/2026-04-22/redaction-job-validation-errors-property.md) | All products | Non-breaking | api |
| [Adds programmatic access to account activity logs](https://docs.stripe.com/changelog/dahlia/2026-04-22/programmatic-access-to-activity-logs.md) | All products | Non-breaking | api |
| [Makes Accounts v2 available to all Stripe users for managing customers](https://docs.stripe.com/changelog/dahlia/2026-04-22/accounts-v2-expanded-availability.md) | Billing, Connect, Payments | Non-breaking | api |
| [Adds new tax registration types and product tax details for Stripe Tax for tickets](https://docs.stripe.com/changelog/dahlia/2026-04-22/stripe-tax-for-tickets-new-tax-registration-types.md) | Tax | Non-breaking | api |
| [Adds the Reporting Query Runs API v2](https://docs.stripe.com/changelog/dahlia/2026-04-22/reporting-query-runs-api-v2.md) | Sigma | Non-breaking | api |

---

## March 25, 2026 — GA Channel (`2026-03-25.dahlia`)

### Summary

- **Elements and Stripe.js changes**: Several updates to Stripe Elements and Stripe.js, including the [removal of deprecated methods](https://docs.stripe.com/changelog/dahlia/2026-03-25/remove-legacy-stripejs-methods.md) from Stripe.js in favor of equivalent methods with clearer naming and improved functionality, as well as the [renaming of the Checkout initialization method](https://docs.stripe.com/changelog/dahlia/2026-03-25/rename-init-checkout-to-init-checkout-elements.md).
- **New payment method support**: Added [support for UPI](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-support-for-the-upi-payment-method.md), a real-time payment method in India for accepting one-time and recurring payments.
- **Issuing improvements and changes**: You can now [configure a virtual Issuing card](https://docs.stripe.com/changelog/dahlia/2026-03-25/issuing-card-lifecycle-controls.md) to automatically be cancelled after making a specified number of payments.
- **Checkout Sessions enhancements and changes**: You can now [group and track your Checkout Sessions](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-integration-identifier-parameter-to-checkout-sessions.md) using integration identifiers. Updated the Checkout Session [UI mode enum values](https://docs.stripe.com/changelog/dahlia/2026-03-25/updates-available-checkout-session-ui-modes.md). You can now [configure the billing interval](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-pending-invoice-item-interval-parameter-to-checkout-sessions.md) for pending invoice items when creating subscription-based payments in Checkout Sessions.
- **Decimal quantity support for invoices**: Added [support for decimal quantities](https://docs.stripe.com/changelog/dahlia/2026-03-25/invoice-items-decimal-quantity.md) with up to 12 decimal places of precision when creating or updating Invoice Items and Invoice Line Items.

### Checkout Enhancements

| Title | Affected Products | Breaking? | Category |
| ----- | ----------------- | --------- | -------- |
| [Updates Checkout Session UI mode enum values](https://docs.stripe.com/changelog/dahlia/2026-03-25/updates-available-checkout-session-ui-modes.md) | Checkout, Paymentlinks | **Breaking** | api |
| [Adds pending invoice item interval parameter to create Checkout Sessions](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-pending-invoice-item-interval-parameter-to-checkout-sessions.md) | Checkout | Non-breaking | api |
| [Adds integration identifier parameter to Checkout Sessions](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-integration-identifier-parameter-to-checkout-sessions.md) | Checkout | Non-breaking | api |

### Connect Enhancements

| Title | Affected Products | Breaking? | Category |
| ----- | ----------------- | --------- | -------- |
| [Adds risk requirements to the Capabilities API](https://docs.stripe.com/changelog/dahlia/2026-03-25/capabilities-api-risk-requirements.md) | Connect | **Breaking** | api |
| [Removes the requirement for certain connected accounts to collect external account information in the Account Sessions API](https://docs.stripe.com/changelog/dahlia/2026-03-25/relaxed_external_account_collection_account_session.md) | Connect | Non-breaking | api |

### Elements and Stripe.js Enhancements

| Title | Affected Products | Breaking? | Category |
| ----- | ----------------- | --------- | -------- |
| [Changes the Address Element state field to default to Latin-formatted characters](https://docs.stripe.com/changelog/dahlia/2026-03-25/address-element-getvalue-and-change-event-formatting.md) | Elements | **Breaking** | stripejs |
| [Updates the elements.update() method to return a Promise](https://docs.stripe.com/changelog/dahlia/2026-03-25/elements-update-returns-promise.md) | Elements | **Breaking** | stripejs |
| [Removes support for boolean values in options.layout.radios](https://docs.stripe.com/changelog/dahlia/2026-03-25/disallow-booleans-for-radios.md) | Elements | **Breaking** | stripejs |
| [Removes deprecated Payment Intents, Setup Intents, and Sources methods from Stripe.js](https://docs.stripe.com/changelog/dahlia/2026-03-25/remove-legacy-stripejs-methods.md) | Payments | **Breaking** | stripejs |
| [Renames Checkout initialization method](https://docs.stripe.com/changelog/dahlia/2026-03-25/rename-init-checkout-to-init-checkout-elements.md) | Checkout, Elements | **Breaking** | stripejs |
| [Renames Embedded Checkout initialization method](https://docs.stripe.com/changelog/dahlia/2026-03-25/rename-init-embedded-checkout-to-create-embedded-checkout-page.md) | Checkout | **Breaking** | stripejs |

### Issuing Enhancements

| Title | Affected Products | Breaking? | Category |
| ----- | ----------------- | --------- | -------- |
| [Updates the Issuing Token card reference ID for Visa to be optional](https://docs.stripe.com/changelog/dahlia/2026-03-25/visa-card-reference-id-optional.md) | Issuing | **Breaking** | api |
| [Adds support for limiting the number of allowed payments for Issuing cards](https://docs.stripe.com/changelog/dahlia/2026-03-25/issuing-card-lifecycle-controls.md) | Issuing | Non-breaking | api |

### Payments Enhancements

| Title | Affected Products | Breaking? | Category |
| ----- | ----------------- | --------- | -------- |
| [Updates card property requirements and adds 3D Secure authentication properties to Payment Records](https://docs.stripe.com/changelog/dahlia/2026-03-25/payment-records-card-property-requirements-and-3d-secure-properties.md) | Payments | Non-breaking | api |
| [Adds support for the UPI payment method](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-support-for-the-upi-payment-method.md) | Payments | Non-breaking | api |
| [Adds payment method-level support for configuring future usage of crypto payment methods in Checkout Sessions](https://docs.stripe.com/changelog/dahlia/2026-03-25/expands-crypto-payment-method-options-for-checkout-sessions.md) | Payments, Crypto | Non-breaking | api |

### Radar Enhancements

| Title | Affected Products | Breaking? | Category |
| ----- | ----------------- | --------- | -------- |
| [Adds crypto fingerprint support to Radar value list items](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-crypto-fingerprint-support-to-radar-value-list-items.md) | Radar, Crypto | Non-breaking | api |

### Additional Updates

| Title | Affected Products | Breaking? | Category |
| ----- | ----------------- | --------- | -------- |
| [Adds retention policy cancellation reason to Subscriptions](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-new-cancellation-reason-subscription-test-retention-policy.md) | Billing | **Breaking** | api |
| [Updates the events_from parameter on event destinations to accept string values](https://docs.stripe.com/changelog/dahlia/2026-03-25/updates-eventsfrom-parameter-on-event-destinations.md) | All products | **Breaking** | api |
| [Adds decimal quantity support for Invoice Items and Invoice Line Items](https://docs.stripe.com/changelog/dahlia/2026-03-25/invoice-items-decimal-quantity.md) | Invoicing | Non-breaking | api |
| [Adds marine carbon removal as a new Climate Orders pathway](https://docs.stripe.com/changelog/dahlia/2026-03-25/marine-carbon-removal-pathway.md) | Climate | Non-breaking | api |
| [Adds metadata property to credit note line items](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-metadata-field-to-credit-note-line-items.md) | Invoicing | Non-breaking | api |
| [Adds Tempo network support for crypto payments](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-tempo-network-enum-for-crypto-payments.md) | Payments, Crypto | Non-breaking | api |
| [Adds presentment details for Adaptive Pricing Subscriptions](https://docs.stripe.com/changelog/dahlia/2026-03-25/add-presentment-details-for-subscriptions.md) | Billing | Non-breaking | api |

---

## March 25, 2026 — Preview Channel (`2026-03-25.preview`)

### Summary

- **Multicurrency support for payouts**: v2 Payout Methods now [support foreign currencies](https://docs.stripe.com/changelog/dahlia/2026-03-25/multicurrency-v2-payout-methods.md) for payouts.
- **Batch API operations**: You can now [run API operations in batches](https://docs.stripe.com/changelog/dahlia/2026-03-25/batch-jobs-v2-api.md), making it easier to process bulk operations like creating multiple customers, migrating subscriptions, or updating large datasets.
- **Azure Event Grid support**: You can now [send Stripe events directly to Azure](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-support-for-azure-event-grid-as-an-event-destination.md) using Azure Event Grid as a new type of destination.
- **Ticket sales support in Stripe Tax**: You can now [calculate tax](https://docs.stripe.com/changelog/dahlia/2026-03-25/stripe-tax-ticket-sales-event-location.md) based on the event's location instead of the customer's location, support event-related US tax registration types, and access event-related tax breakdown values.
- **Trial offers for subscription items**: The new Trial Offers API allows you to [create and manage trial offers](https://docs.stripe.com/changelog/dahlia/2026-03-25/trial-offers-on-subscription-items.md) for subscription items.

### Payments Enhancements

| Title | Affected Products | Breaking? | Category |
| ----- | ----------------- | --------- | -------- |
| [Removes the source type property from Stripe balance payment methods](https://docs.stripe.com/changelog/dahlia/2026-03-25/stripe-balance-payment-method-source-type.md) | Payments, Connect | **Breaking** | api |
| [Adds surcharge configuration options for card-not-present payments](https://docs.stripe.com/changelog/dahlia/2026-03-25/card-not-present-payments-surcharge-configuration-options.md) | Payments | Non-breaking | api |
| [Adds Risk Reserved Balance to the Balances API](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-risk-reserved-balance-to-the-balances-api.md) | Payments, Payouts | Non-breaking | api |

### Payouts Enhancements

| Title | Affected Products | Breaking? | Category |
| ----- | ----------------- | --------- | -------- |
| [Adds multicurrency support for v2 payout methods](https://docs.stripe.com/changelog/dahlia/2026-03-25/multicurrency-v2-payout-methods.md) | Payouts | **Breaking** | api |
| [Restricts Accounts v2 identity properties for some Global Payouts use cases](https://docs.stripe.com/changelog/dahlia/2026-03-25/accounts-identity-fields-global-payouts.md) | Payouts | **Breaking** | api |
| [Adds the restricted property to the Payout Method object](https://docs.stripe.com/changelog/dahlia/2026-03-25/payout-method-restricted-property.md) | Payouts | Non-breaking | api |
| [Expands Global Payouts cross-border payout destinations to three additional countries](https://docs.stripe.com/changelog/dahlia/2026-03-25/cross-border-payouts-new-countries.md) | Payouts | Non-breaking | api |

### Additional Updates

| Title | Affected Products | Breaking? | Category |
| ----- | ----------------- | --------- | -------- |
| [Adds hosted relink flow for Financial Connections](https://docs.stripe.com/changelog/dahlia/2026-03-25/financial-connections-hosted-relink-api.md) | Financialconnections | Non-breaking | api |
| [Adds support for running API operations in batches](https://docs.stripe.com/changelog/dahlia/2026-03-25/batch-jobs-v2-api.md) | All products | Non-breaking | api |
| [Adds pending invoice item interval parameter to update Checkout Sessions](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-pending-invoice-item-interval-parameter-to-checkout-sessions-update.md) | Checkout | Non-breaking | api |
| [Adds support for Azure Event Grid as an event destination](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-support-for-azure-event-grid-as-an-event-destination.md) | All products | Non-breaking | api |
| [Adds time zone support to the Accounts v2 API](https://docs.stripe.com/changelog/dahlia/2026-03-25/accounts-v2-time-zone-support.md) | Connect | Non-breaking | api |
| [Adds Stripe Tax support for ticket sales](https://docs.stripe.com/changelog/dahlia/2026-03-25/stripe-tax-ticket-sales-event-location.md) | Tax | Non-breaking | api |
| [Adds a description and counterparty to transactions](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-description-and-counterparty-to-transactions.md) | Treasury | Non-breaking | api |
| [Adds support for Managed Payments on payment links](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-support-for-managed-payments-on-payment-links.md) | Paymentlinks | Non-breaking | api |
| [Adds configurable trial offers for subscription items](https://docs.stripe.com/changelog/dahlia/2026-03-25/trial-offers-on-subscription-items.md) | Billing | Non-breaking | api |

---

## Breaking Changes Summary

A consolidated list of all breaking changes across every Dahlia version, for quick reference.

### `2026-04-22.preview`

| Change | Products |
| ------ | -------- |
| [Billing meter event values with more than 15 digits now validated](https://docs.stripe.com/changelog/dahlia/2026-04-22/billing-meter-event-values-validation.md) | Billing |
| [Japan and China added as Global Payouts cross-border destinations](https://docs.stripe.com/changelog/dahlia/2026-04-22/cross-border-payouts-new-countries.md) | Payouts |
| [Transaction categories updated to flow-specific reversal types](https://docs.stripe.com/changelog/dahlia/2026-04-22/transaction-categories-flow-specific-reversal-types.md) | Treasury |
| [Radar session property now optional in Payment Evaluations API](https://docs.stripe.com/changelog/dahlia/2026-04-22/payment-evaluations-optional-radar-session.md) | Radar |

### `2026-03-25.dahlia`

| Change | Products |
| ------ | -------- |
| [Checkout Session UI mode enum values updated](https://docs.stripe.com/changelog/dahlia/2026-03-25/updates-available-checkout-session-ui-modes.md) | Checkout, Paymentlinks |
| [Risk requirements added to the Capabilities API](https://docs.stripe.com/changelog/dahlia/2026-03-25/capabilities-api-risk-requirements.md) | Connect |
| [Address Element state field defaults to Latin-formatted characters](https://docs.stripe.com/changelog/dahlia/2026-03-25/address-element-getvalue-and-change-event-formatting.md) | Elements |
| [elements.update() method now returns a Promise](https://docs.stripe.com/changelog/dahlia/2026-03-25/elements-update-returns-promise.md) | Elements |
| [Boolean values removed from options.layout.radios](https://docs.stripe.com/changelog/dahlia/2026-03-25/disallow-booleans-for-radios.md) | Elements |
| [Deprecated Payment Intents, Setup Intents, and Sources methods removed from Stripe.js](https://docs.stripe.com/changelog/dahlia/2026-03-25/remove-legacy-stripejs-methods.md) | Payments |
| [Checkout initialization method renamed](https://docs.stripe.com/changelog/dahlia/2026-03-25/rename-init-checkout-to-init-checkout-elements.md) | Checkout, Elements |
| [Embedded Checkout initialization method renamed](https://docs.stripe.com/changelog/dahlia/2026-03-25/rename-init-embedded-checkout-to-create-embedded-checkout-page.md) | Checkout |
| [Issuing Token card reference ID for Visa now optional](https://docs.stripe.com/changelog/dahlia/2026-03-25/visa-card-reference-id-optional.md) | Issuing |
| [Retention policy cancellation reason added to Subscriptions](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-new-cancellation-reason-subscription-test-retention-policy.md) | Billing |
| [events_from parameter on event destinations now accepts string values](https://docs.stripe.com/changelog/dahlia/2026-03-25/updates-eventsfrom-parameter-on-event-destinations.md) | All products |

### `2026-03-25.preview`

| Change | Products |
| ------ | -------- |
| [Source type property removed from Stripe balance payment methods](https://docs.stripe.com/changelog/dahlia/2026-03-25/stripe-balance-payment-method-source-type.md) | Payments, Connect |
| [Multicurrency support added for v2 payout methods](https://docs.stripe.com/changelog/dahlia/2026-03-25/multicurrency-v2-payout-methods.md) | Payouts |
| [Accounts v2 identity properties restricted for some Global Payouts use cases](https://docs.stripe.com/changelog/dahlia/2026-03-25/accounts-identity-fields-global-payouts.md) | Payouts |

---

## API Version Strings

| Version | Channel | Date |
| ------- | ------- | ---- |
| `2026-04-22.preview` | Public preview | April 22, 2026 |
| `2026-04-22.dahlia` | GA | April 22, 2026 |
| `2026-03-25.preview` | Public preview | March 25, 2026 |
| `2026-03-25.dahlia` | GA (base Dahlia version) | March 25, 2026 |

---

## Related Links

- [Stripe API Changelog — Dahlia](https://docs.stripe.com/changelog/dahlia.md)
- [Stripe API Upgrade Guide](https://docs.stripe.com/upgrades.md)
- [Public Preview Channel](https://docs.stripe.com/changelog.md?channel=preview)
- [Introducing Stripe's API Release Process](http://stripe.com/blog/introducing-stripes-new-api-release-process)
- **Previous releases:** [Acacia](https://docs.stripe.com/changelog/acacia.md) · [Basil](https://docs.stripe.com/changelog/basil.md) · [Clover](https://docs.stripe.com/changelog/clover.md)
