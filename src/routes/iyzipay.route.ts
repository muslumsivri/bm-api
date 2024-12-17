import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middlewares';
import { 
        createProduct,updateProduct,retrieveProduct,retrieveListProduct, // Product
        createPricingPlan,updatePricingPlan,retrievePricingPlan,retrieveListPricingPlan, // Pricing Plan
        createCustomer, updateCustomer,retriveCustomer,retrieveListCustomer, // Customer
        initializeSubscription,activateSubscription,cancelSubscription,retrieveSubscription,callback // Subscription

} from '../controllers/iyzipay.controller';

const router = express.Router();

// Product Routes
router.post('/subscription/products',isAuthenticated,createProduct);
router.post('/subscription/products/:productReferenceCode',isAuthenticated,updateProduct);
router.get('/subscription/products/:productReferenceCode',isAuthenticated,retrieveProduct);
router.get('/subscription/products',isAuthenticated,retrieveListProduct);

// Pricing Plan Routes
router.post('/subscription/products/:productReferenceCode/pricing-plans',isAuthenticated,createPricingPlan);
router.post('/subscription/pricing-plans/:pricingPlanReferenceCode',isAuthenticated,updatePricingPlan);
router.get('/subscription/pricing-plans/:pricingPlanReferenceCode',isAuthenticated,retrievePricingPlan);
router.get('/subscription/products/:productReferenceCode/pricing-plans',isAuthenticated,retrieveListPricingPlan);

// Customer
router.post('/subscription/customers',isAuthenticated,createCustomer);
router.post('/subscription/customers/:customerReferenceCode',isAuthenticated,updateCustomer);
router.get('/subscription/customers/:customerReferenceCode',isAuthenticated,retriveCustomer);
router.get('/subscription/customers',isAuthenticated,retrieveListCustomer);

// Subscription
router.post('/subscription/initialize',isAuthenticated,initializeSubscription);
router.post('/subscription/:subscriptionReferenceCode/activate',isAuthenticated,activateSubscription);
router.post('/subscription/:subscriptionReferenceCode/cancel',isAuthenticated,cancelSubscription);
router.get('/subscription/subscriptions/:subscriptionReferenceCode',isAuthenticated,retrieveSubscription);
router.post('/subscription/callback',isAuthenticated,callback); // !!!


export default router;
