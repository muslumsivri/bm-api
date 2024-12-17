import { Request, Response,NextFunction } from "express";
import Stripe from "stripe";

import { stripe } from "../lib/stripe.lib";
import { User } from "../models/user.model";
import { Subscription } from "../models/subscription.model";


export const pricing = async (req:Request, res:Response) :Promise<any>=> {

    res.render('index.ejs');
}

export const subscribe = async (req:Request, res:Response):Promise<any>=> {

    const plan = req.query.plan

    if (!plan) {
        return res.send('Subscription plan not found')
    }

    let priceId

    switch ((plan as string).toLowerCase()) {
        case 'scale': 
            priceId = process.env.STRIPE_SCALE_PLAN_MONTHLY_PRICE_ID
            break

        case 'enterprise':
            priceId = process.env.STRIPE_ENTERPRISE_PLAN_MONTHLY_PRICE_ID
            break

        default:
            return res.status(400).json({ success: false, message: 'Subscription plan not found' })
    }

    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
            {
                price: priceId,
                quantity: 1
            }
        ],
        success_url: `${process.env.BASE_URL}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}?`,
        cancel_url: `${process.env.BASE_URL}/api/stripe/cancel`
    })

    res.status(200).redirect( (session as Stripe.Checkout.Session).url! );
    
}

export const success = async (req:Request, res:Response):Promise<any>=> {

        //const session = await stripe.checkout.sessions.retrieve(req.query.session_id, { expand: ['subscription', 'subscription.plan.product'] })

        res.status(200).json({ success: true, message: 'Subscribed successfully' });
}

export const cancel = async (req:Request, res:Response):Promise<any>=> {

    //const session = await stripe.checkout.sessions.retrieve(req.query.session_id, { expand: ['subscription', 'subscription.plan.product'] })

    res.status(200).redirect(`${process.env.BASE_URL}/api/stripe/pricing`);
}


export const customer = async (req:Request, res:Response):Promise<any>=> {

    const user = await User.findById(req.headers["userId"]);

    const portalSession = await stripe.billingPortal.sessions.create({
        customer:  user?.customerId!,
        return_url: `${process.env.BASE_URL}/api/stripe/pricing`
    })

    return res.status(200).redirect(portalSession.url);

}


export const webhook = async (req:Request, res:Response): Promise<any>=> {

    const sig = req.headers['stripe-signature'] as string;
    let event;
  
    try {
        event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET_KEY!);
    } catch (error :any) {
        return res.status(400).json({ success: false, message: error.message });
    }
    
    // Handle the event
    try {
        
        switch (event.type) {

        //Event when the subscription started
        case 'checkout.session.completed':
            
            console.log('Subscription started!')

            const session = await stripe.checkout.sessions.retrieve(
                (event.data.object as Stripe.Checkout.Session).id,
                {
                    expand: ["line_items"],
                }
            );

            const customerId = session.customer as string;
			const customerDetails = session.customer_details;

            if (customerDetails?.email) {

                const user = await User.findOne({ email:customerDetails.email });
                
                if (!user){

                    return res.status(404).json({success: false, message:"User not found for the checkout.session.completed event!"})
                } 

                if (!user.customerId) {
                    user.customerId = customerId
                    await user.save();
                }

                const lineItems = session.line_items?.data || [];

                for (const item of lineItems) {
                    const priceId = item.price?.id;
                    const isSubscription = item.price?.type === "recurring";

                    if (isSubscription) {
                        let endDate = new Date();
                        if (priceId === process.env.STRIPE_ENTERPRISE_PLAN_YEARLY_PRICE_ID!) {
                            endDate.setFullYear(endDate.getFullYear() + 1); // 1 year from now
                        } else if (  (priceId === process.env.STRIPE_SCALE_PLAN_MONTHLY_PRICE_ID!) || (priceId === process.env.STRIPE_ENTERPRISE_PLAN_MONTHLY_PRICE_ID!) ) {
                            endDate.setMonth(endDate.getMonth() + 1); // 1 month from now
                        } else {
                            throw new Error("Invalid priceId"); // !!!!!!!!!!!!
                        }
                        // it is gonna create the subscription if it does not exist already, but if it exists it will update it

                        await Subscription.updateOne(
                            {userId: user.id! },
                            {
                                plan: priceId === process.env.STRIPE_SCALE_PLAN_MONTHLY_PRICE_ID! ? "scale" : "enterprise",
                                period: priceId === process.env.STRIPE_ENTERPRISE_PLAN_YEARLY_PRICE_ID! ? "yearly" : "monthly",
                                startDate: new Date(),
                                endDate: endDate,
                            },
                            { upsert: true });

                            
                        user.plan = (priceId === process.env.STRIPE_SCALE_PLAN_MONTHLY_PRICE_ID! ? "scale" : "enterprise");
                        user.save();

                    } else {
                        // one_time_purchase
                    }
                }
            }
            break;

        // Event when the payment is successfull (every subscription interval)  
        case 'invoice.paid':
            console.log('Invoice paid')
            //console.log(event.data)
            break;

        // Event when the payment failed due to card problems or insufficient funds (every subscription interval)  
        case 'invoice.payment_failed':  
            console.log('Invoice payment failed!')
            //console.log(event.data)
            break;

        // Event when subscription is updated  
        case 'customer.subscription.updated':

            console.log('Subscription updated!')
            //console.log(event.data)

            if(event.data.object.cancellation_details?.reason === 'cancellation_requested'){
                
                const user = await User.findOne({ customerId:event.data.object.customer});
                
                if (user) {
                    user.plan = "starter";
                    user.save();
                    const userSubscription = await Subscription.findOne({ userId: user.id! })
                    
                    if (userSubscription) {
                        userSubscription.isCanceled = true;
                        userSubscription.save();
                    }
                    

                } else {
                    
                    return res.status(404).json({success: false, message:"User or subscription not found for the subscription updated event!"})

                }
            } 
            
            else if(event.data.previous_attributes?.cancellation_details?.reason === 'cancellation_requested'){ // renew subscription
                

                const user = await User.findOne({ customerId:event.data.object.customer});
                
                if (user) {

                    const userSubscription = await Subscription.findOne({ userId: user.id! })
                    
                    if (userSubscription) {

                        user.plan = userSubscription.plan;
                        userSubscription.isCanceled = false;

                        user.save();
                        userSubscription.save();
                    }
                    

                } else {
                    
                    return res.status(404).json({success: false, message:"User or subscription not found for the subscription updated event!"})

                }
            
            }

            break;
        
        case 'customer.subscription.deleted':

            console.log('Subscription deleted!')
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
        }

    } catch (error:any) {
        return res.status(400).json({ success: false, message: error.message });
    }    

    res.status(200).json({success: true, message: 'Webhook received!'});


}