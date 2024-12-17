import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middlewares';
import { cancel, customer, pricing, subscribe, success, webhook } from '../controllers/stripe.controller';


const router = express.Router();   

router.get('/pricing',pricing);
router.get('/subscribe',isAuthenticated,subscribe);
router.get('/success',isAuthenticated,success);
router.get('/cancel',isAuthenticated,cancel);
router.get('/customer',isAuthenticated, customer);


router.post('/webhooks', express.raw({type: 'application/json'}),webhook); // Webhook


export default router;

