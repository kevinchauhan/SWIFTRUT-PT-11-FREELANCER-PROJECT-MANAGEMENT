import express from 'express';
import PaymentController from '../controllers/PaymentController.js';

const router = express.Router();

const paymentController = new PaymentController();

router.post('/', (req, res) => paymentController.createPayment(req, res));
router.get('/', (req, res) => paymentController.getPayments(req, res));
router.put('/:id', (req, res) => paymentController.updatePaymentStatus(req, res));
router.post('/simulate', (req, res) => paymentController.simulatePayment(req, res));
router.post('/webhook', (req, res) => paymentController.webhookHandler(req, res));

export default router;
