// backend/services/stripeService.js
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function createPaymentIntent({ amount, currency = process.env.STRIPE_CURRENCY || 'usd', metadata = {} }) {
  const intent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true },
    metadata
  });
  return intent;
}

async function retrievePaymentIntent(id) {
  return stripe.paymentIntents.retrieve(id);
}

module.exports = { createPaymentIntent, retrievePaymentIntent };
