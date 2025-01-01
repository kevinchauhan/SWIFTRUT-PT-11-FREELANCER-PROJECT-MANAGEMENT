import Stripe from 'stripe';
import { Config } from '../config/index.js';

const stripe = new Stripe(Config.STRIPE_SECRET_KEY);

class StripeService {
    async createPaymentSession(paymentData) {
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: paymentData.productName,
                            },
                            unit_amount: paymentData.amount * 100,
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${Config.FRONTEND_URL}/payment-list`,
                cancel_url: `${Config.FRONTEND_URL}/project`,
            });
            return session;
        } catch (error) {
            console.error('Error creating Stripe session:', error);
            throw new Error('Error creating Stripe session');
        }
    }

}

export default new StripeService();
