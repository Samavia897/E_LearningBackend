// backend/controllers/subscriptionController.js (Professional Fixed Hybrid)

const Subscription = require('../models/Subscription');
const schema = require('../validators/subscriptionValidator');
const {
  createPaymentIntent: stripeCreatePaymentIntent,
  retrievePaymentIntent,
} = require('../services/stripeService');
const sendEmail = require('../utils/sendEmail');

//  Email templates
const paymentAdminTemplate = require('../emails/templates/paymentAdminTemplate');
const paymentTemplate = require('../emails/templates/paymentTemplate');

const convertToMinor = (price) => Math.round(Number(price) * 100);

//  Create payment intent (Stripe)
exports.createPaymentIntent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { price, title, name, email } = req.body;
    if (!price || isNaN(Number(price)))
      return res.status(400).json({ error: 'Invalid price' });

    const amount = convertToMinor(price);

    const intent = await stripeCreatePaymentIntent({
      amount,
      currency: process.env.STRIPE_CURRENCY || 'usd',
      metadata: { userId, title, name, email },
      automatic_payment_methods: { enabled: true },
      expand: ['charges'],
    });

    return res.json({
      paymentIntentId: intent.id,
      client_secret: intent.client_secret,
    });
  } catch (err) {
    console.error('Create payment intent error:', err);
    return res.status(500).json({ error: 'Could not create payment intent' });
  }
};

//  Create or Update subscription record (Hybrid Approach)
exports.createSubscription = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id)
      return res.status(401).json({ error: 'Unauthorized' });

    req.body.userId = user.id;

    const { error } = schema.validate(req.body);
    if (error)
      return res.status(400).json({ error: error.details[0].message });

    let {
      userId,
      testId,
      title,
      price,
      name,
      email,
      payment,
      extraInfo,
      paymentIntentId,
    } = req.body;

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ error: 'Invalid price' });
    }
    price = numericPrice;

    // Validation for local payments
    if (
      (payment === 'Easypaisa' || payment === 'JazzCash') &&
      !/^03\d{9}$/.test(extraInfo || '')
    ) {
      return res
        .status(400)
        .json({ error: 'Invalid mobile format (03XXXXXXXXX)' });
    }
    if (
      payment === 'Bank Transfer' &&
      (!extraInfo || extraInfo.trim().length < 4)
    ) {
      return res.status(400).json({ error: 'Transaction ID required' });
    }

    let status = 'pending';
    let transactionId;
    let cardLast4;
    let cardBrand;

    // Stripe Card Payments
    if (payment === 'Credit/Debit Card') {
      if (!paymentIntentId)
        return res
          .status(400)
          .json({ error: 'paymentIntentId required for card' });

      const intent = await retrievePaymentIntent(paymentIntentId);

      if (intent && intent.status === 'succeeded') {
        status = 'paid';
        transactionId = intent.id;

        // Card details
        const charge = intent.charges?.data?.[0];
        if (charge?.payment_method_details?.card) {
          cardLast4 = charge.payment_method_details.card.last4;
          cardBrand = charge.payment_method_details.card.brand;
        }
      } else if (intent && intent.status === 'requires_action') {
        status = 'pending';
        transactionId = intent.id;
      } else {
        status = 'failed';
        transactionId = intent?.id || undefined;
      }
    }
    // Local payments
    else {
      status = 'pending';
      transactionId = extraInfo;
      paymentIntentId = undefined;
    }

    // 🔹 Hybrid logic: find existing record OR create new
    let subscription = await Subscription.findOne({ userId, testId });

    if (subscription) {
      // update existing
      subscription.title = title;
      subscription.price = price;
      subscription.name = name;
      subscription.email = email;
      subscription.paymentMethod = payment;
      subscription.extraInfo = extraInfo;
      subscription.paymentIntentId = paymentIntentId;
      subscription.status = status;
      subscription.transactionId = transactionId;
      subscription.cardLast4 = cardLast4;
      subscription.cardBrand = cardBrand;
    } else {
      // create new
      subscription = new Subscription({
        userId,
        testId,
        title,
        price,
        name,
        email,
        paymentMethod: payment,
        extraInfo,
        paymentIntentId,
        status,
        transactionId,
        cardLast4,
        cardBrand,
      });
    }

    await subscription.save();

    // Send emails
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        ...paymentAdminTemplate({
          name,
          email,
          title,
          price,
          paymentMethod: payment,
          transactionId,
          status,
        }),
      });

      await sendEmail({
        to: email,
        ...paymentTemplate({
          name,
          title,
          price,
          transactionId,
          status,
        }),
      });
    } catch (mailErr) {
      console.error('Email error (non-blocking):', mailErr);
    }

    res.status(201).json({
      success: true,
      subscriptionId: subscription._id,
      status,
      cardBrand,
      cardLast4,
    });
  } catch (err) {
    console.error('Subscription creation error:', err);
    res.status(500).json({ error: 'Could not create subscription' });
  }
};

//  Check subscription status
exports.checkSubscriptionStatus = async (req, res) => {
  try {
    const { testId } = req.params;
    const user = req.user;
    if (!user || !user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = user.id;

    if (!userId || !testId) {
      return res
        .status(400)
        .json({ error: 'User ID and Test ID are required.' });
    }

    const paidSubscription = await Subscription.findOne({
      userId,
      testId,
      status: 'paid',
    });

    return res.json({ isSubscribed: !!paidSubscription });
  } catch (err) {
    console.error('Check subscription error:', err);
    res
      .status(500)
      .json({ error: 'Server error while checking subscription' });
  }
};

//  Admin updates subscription status
exports.updateSubscriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['paid', 'failed', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    subscription.status = status;
    await subscription.save();

    res.json({
      success: true,
      message: `Subscription ${status} successfully.`,
    });
  } catch (err) {
    console.error('Update subscription status error:', err);
    res.status(500).json({ error: 'Could not update subscription status' });
  }
};


//  Admin fetches all subscriptions (NEW FUNCTION)
exports.getAllSubscriptions = async (req, res) => {
  try {
    // ⭐️ Admin route hai, toh hum 'isAdmin' middleware se check kar chuke honge.
    // Sab subscriptions fetch karein aur latest pehle show honi chahiye.
    const subscriptions = await Subscription.find()
      .sort({ createdAt: -1 })
      .lean(); // .lean() use karein for better performance

    return res.json(subscriptions);
  } catch (err) {
    console.error('Fetch all subscriptions error:', err);
    // 401/403 errors middleware handle karega.
    res.status(500).json({ error: 'Could not fetch subscriptions list' });
  }
};
