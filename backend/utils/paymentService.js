const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createStripeSession = async (price, currency) => {
  const params = {
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: currency,
          product_data: {
            name: 'Stall Booking',
          },
          unit_amount: price*100,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.BASE_URL}/payment-success`,
    cancel_url: `${process.env.BASE_URL}/payment-cancel`,
  };

  const session = await stripe.checkout.sessions.create(params);
  return session;
};
const getSessionById = async (sessionId) => {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return session;
    };
module.exports = { createStripeSession, getSessionById };
