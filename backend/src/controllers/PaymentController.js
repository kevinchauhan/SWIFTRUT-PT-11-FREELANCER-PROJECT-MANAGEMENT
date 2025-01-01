import { Config } from '../config/index.js';
import { Payment } from '../models/Payment.js';
import { Project } from '../models/Project.js';
import StripeService from '../services/StripeService.js';
import { buffer } from 'micro';

class PaymentController {
    async createPayment(req, res) {
        try {
            const { projectId } = req.body;

            // Fetch the project from the database using the projectId
            const project = await Project.findById(projectId);

            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            const { amount, name: productName } = project;
            // Create Stripe payment session
            const session = await StripeService.createPaymentSession({ amount, productName });
            console.log('session')

            // Save payment information to the database (optional, depending on your use case)
            const payment = await Payment.create({
                projectId,
                amount,
                productName,
                sessionId: session.id, // Save the Stripe session ID in the database
            });
            // Send the session ID back to the client for redirection
            res.status(201).json({
                message: 'Payment created successfully',
                payment,
                sessionId: session.id,
                paymentUrl: session.url,  // Send the payment link to the client
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async webhookHandler(req, res) {
        console.log('Webhook received');

        const sig = req.headers['stripe-signature'];
        if (!sig) {
            console.error('No Stripe signature found in request headers');
            return res.status(400).send('Webhook error: No Stripe signature found');
        }

        try {
            const body = await buffer(req);
            console.log('Received body:', body.toString());  // Debugging raw request body

            // Verify webhook signature and construct the event
            event = stripe.webhooks.constructEvent(body, sig, Config.STRIPE_WEBHOOK_SECRET);
            console.log('Stripe event constructed successfully'); construction
        } catch (err) {
            console.error('Error in webhook signature verification or event construction:', err);
            return res.status(400).send(`Webhook error: ${err.message}`);
        }

        // Handle the event based on type
        switch (event.type) {
            case 'checkout.session.completed':
                console.log('Handling checkout.session.completed');

                const session = event.data.object;
                console.log('Session data:', session);  // Debugging the session data

                try {
                    // Find the payment using the session ID
                    const payment = await Payment.findOne({ sessionId: session.id });
                    if (payment) {
                        console.log('Payment found:', payment);  // Debugging the payment
                        // Update the payment status to 'paid'
                        payment.status = 'paid';
                        await payment.save();
                        console.log('Payment status updated to paid');
                    } else {
                        console.error('Payment not found for session ID:', session.id);
                    }
                } catch (err) {
                    console.error('Error finding or updating payment:', err);
                }
                break;

            case 'checkout.session.async_payment_failed':
                console.log('Handling checkout.session.async_payment_failed'); type

                const failedSession = event.data.object;
                console.log('Failed session data:', failedSession);  // Debugging the failed session

                try {
                    // Find the payment using the session ID
                    const failedPayment = await Payment.findOne({ sessionId: failedSession.id });
                    if (failedPayment) {
                        console.log('Failed payment found:', failedPayment);  // Debugging the failed payment
                        // Update the payment status to 'unpaid'
                        failedPayment.status = 'unpaid';
                        await failedPayment.save();
                        console.log('Payment status updated to unpaid');
                    } else {
                        console.error('Failed payment not found for session ID:', failedSession.id);
                    }
                } catch (err) {
                    console.error('Error finding or updating failed payment:', err);
                }
                break;

            // Handle other event types if necessary
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        console.log('Returning success response');
        res.status(200).json({ received: true });
    }


    async getPayments(req, res) {
        try {
            const payments = await Payment.find().populate('projectId', 'name amount');
            res.status(200).json({ payments });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updatePaymentStatus(req, res) {
        try {
            const { id } = req.params;
            const payment = await Payment.findByIdAndUpdate(id, { status: 'paid' }, { new: true });
            res.status(200).json({ message: 'Payment marked as paid', payment });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async simulatePayment(req, res) {
        try {
            res.status(200).json({ message: 'Payment simulated successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default PaymentController;
