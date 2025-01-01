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
        const sig = req.headers['stripe-signature'];
        const body = await buffer(req);  // Get raw body for verification
        let event;

        try {
            // Verify webhook signature and construct the event
            event = stripe.webhooks.constructEvent(body, sig, Config.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            console.error('Webhook signature verification failed.', err);
            return res.status(400).send(`Webhook error: ${err.message}`);
        }

        // Handle the event based on type
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;

                // Find the payment using the session ID
                const payment = await Payment.findOne({ sessionId: session.id });
                if (payment) {
                    // Update the payment status to 'paid'
                    payment.status = 'paid';
                    await payment.save();
                }
                break;

            case 'checkout.session.async_payment_failed':
                const failedSession = event.data.object;

                // Find the payment using the session ID
                const failedPayment = await Payment.findOne({ sessionId: failedSession.id });
                if (failedPayment) {
                    // Update the payment status to 'unpaid'
                    failedPayment.status = 'unpaid';
                    await failedPayment.save();
                }
                break;

            // Handle other event types if necessary
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
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
