import { Request, Response,NextFunction } from "express";
import Iyzipay from "iyzipay";

import { iyzipay } from "../lib/iyzipay.lib";
import { User } from "../models/user.model";
import { iyzipaySubscription } from "../models/iyzipaySubscription.model";


// Product Routes
export const createProduct = async (req:Request, res:Response) :Promise<any>=> {

    const {name, description} = req.body

    const createRequest = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: '1234562789',
        name: name,
        description: description,
         
    };

    iyzipay.subscriptionProduct.create(createRequest, function (err, result) {

        if (err || (result.status === "failure")) {
            return res.status(500).json({ success: false, message: "Error for create subscription product.",data:result });
        }


        return res.json({ success: true, message: "Subscription product created successfully", data: result });
    });

}

export const updateProduct = async (req:Request, res:Response) :Promise<any>=> {

    const {productReferenceCode} = req.params
    const {name, description} = req.body
    
    const updateRequest = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: '123456789',
        productReferenceCode: productReferenceCode,
        name: name,
        description: description
    };

    iyzipay.subscriptionProduct.update(updateRequest, function (err, result) {

        if (err || (result.status === "failure")) {
            return res.status(500).json({ success: false, message: "Error for update subscription product.",data:result });
        }


        return res.json({ success: true, message: "Subscription product updated successfully", data: result });
    });


}

export const retrieveProduct = async (req: Request, res: Response): Promise<any> => {

    const {productReferenceCode} = req.params

    const retriveRequest = {
        productReferenceCode: productReferenceCode
    };

    iyzipay.subscriptionProduct.retrieve(retriveRequest, function (err, result) {

        if (err || (result.status === "failure")) {
            return res.status(500).json({ success: false, message: "Error for retrieve subscription product.",data:result });
        }


        return res.json({ success: true, message: "Subscription product retrieved successfully", data: result });

    });
    
}

export const retrieveListProduct = async (req: Request, res: Response): Promise<any> => {

    const {page,count} = req.body

    const retrieveRequest = {
        locale: Iyzipay.LOCALE.EN,
        conversationId: '123456789',
        page: page,
        count: count
    };

    iyzipay.subscriptionProduct.retrieveList(retrieveRequest, function (err, result) {

        if (err || (result.status === "failure")) {
            return res.status(500).json({ success: false, message: "Error for retrieve subscription product list.",data:result });
        }

        return res.json({ success: true, message: "Subscription product list retrieved successfully", data: result });
    });

}


// Pricing Plan Routes
export const createPricingPlan = async (req: Request, res: Response): Promise<any> => {

    const {productReferenceCode} = req.params
    const {name,price,currencyCode,paymentInterval,paymentIntervalCount,trialPeriodDays} = req.body

    let iyzipayCurrencyCode;

    switch (currencyCode) {
        case "TRY":
            iyzipayCurrencyCode = Iyzipay.CURRENCY.TRY;
            break;
            
        case "USD":
            iyzipayCurrencyCode = Iyzipay.CURRENCY.USD;
            break;
            
        case "EUR":
            iyzipayCurrencyCode = Iyzipay.CURRENCY.EUR;
            break;

        default:
            return res.status(400).json({ success: false, message: "Invalid currency code." });

    }


    let iyzipayPaymentInterval;

    switch (paymentInterval) {
        case "DAILY":
            iyzipayPaymentInterval = Iyzipay.SUBSCRIPTION_PRICING_PLAN_INTERVAL.DAILY;
            break;
            
        case "WEEKLY":
            iyzipayPaymentInterval = Iyzipay.SUBSCRIPTION_PRICING_PLAN_INTERVAL.WEEKLY;
            break;
            
        case "MONTHLY":
            iyzipayPaymentInterval = Iyzipay.SUBSCRIPTION_PRICING_PLAN_INTERVAL.MONTHLY;
            break;
            
        case "YEARLY":
            iyzipayPaymentInterval = Iyzipay.SUBSCRIPTION_PRICING_PLAN_INTERVAL.YEARLY;
            break;
            
        default:
            return res.status(400).json({ success: false, message: "Invalid payment interval." });

    }
    
    const createRequest = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: '123456789',
        productReferenceCode: productReferenceCode,
        name: name,
        price: price,
        currencyCode: iyzipayCurrencyCode,
        paymentInterval: iyzipayPaymentInterval,
        paymentIntervalCount: paymentIntervalCount,
        trialPeriodDays: trialPeriodDays,
        planPaymentType: Iyzipay.PLAN_PAYMENT_TYPE.RECURRING
    };

    iyzipay.subscriptionPricingPlan.create(createRequest, function (err, result) {

        if (err || (result.status === "failure")) {
            return res.status(500).json({ success: false, message: "Error for create subscription pricing plan.",data:result });
        }

        return res.json({ success: true, message: "Subscription pricing plan created successfully", data: result });
    });

}

export const updatePricingPlan = async (req: Request, res: Response): Promise<any> => {

    const {pricingPlanReferenceCode} = req.params
    const {name,trialPeriodDays} = req.body

    const updateRequest = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: '123456789',
        pricingPlanReferenceCode: pricingPlanReferenceCode,
        name: name,
        trialPeriodDays: trialPeriodDays
    };

    iyzipay.subscriptionPricingPlan.update(updateRequest, function (err, result) {

        if (err || (result.status === "failure")) {
            return res.status(500).json({ success: false, message: "Error for update subscription pricing plan.",data:result });
        }

        return res.json({ success: true, message: "Subscription pricing plan updated successfully", data: result });
    });

}

export const retrievePricingPlan = async (req: Request, res: Response): Promise<any> => {

    const {pricingPlanReferenceCode} = req.params;

    const retrieveRequest = {
        pricingPlanReferenceCode: pricingPlanReferenceCode,
    };

    iyzipay.subscriptionPricingPlan.retrieve(retrieveRequest, function (err, result) {

        if (err || (result.status === "failure")) {
            return res.status(500).json({ success: false, message: "Error for retrieve subscription pricing plan.",data:result });
        }

        return res.json({ success: true, message: "Subscription pricing plan retrieved successfully", data: result });
    });

}

export const retrieveListPricingPlan = async (req: Request, res: Response): Promise<any> => {

    const {productReferenceCode} = req.params
    const {page,count} = req.body

    const retrieveRequest = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: '123456789',
        productReferenceCode: productReferenceCode,
        page: page,
        count: count
    };

    iyzipay.subscriptionPricingPlan.retrieveList(retrieveRequest, function (err, result) {

        if (err || (result.status === "failure")) {
            return res.status(500).json({ success: false, message: "Error for retrieve subscription pricing plan list.",data:result });
        }


        return res.json({ success: true, message: "Subscription pricing plan list retrieved successfully", data: result });
    });
}

// Customer
export const createCustomer = async (req: Request, res: Response): Promise<any> => {

    const {name, surname, email, gsmNumber} = req.body;

    const user = await User.findOne({ email: email});

    if (!user){

        return res.status(404).json({success: false, message:"User not found for the create customer!"})
    } 

    let address = {
        contactName: user.name,
        city: "Istanbul",
        district: "Kadiköy",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No: 1",
        zipCode: "34742"
    };

    const createRequest = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: '123456789',
        name: name,
        surname: surname,
        identityNumber: '11111111111',
        email: email,
        gsmNumber: gsmNumber,
        billingAddress: address,
        shippingAddress: address
    };

    if(user.customerReferenceCode){
        return res.status(404).json({ success: false, message: "User already exists for create customer"});
    }

    iyzipay.subscriptionCustomer.create(createRequest, function (err, result:any) {
        
        if (err || (result.status === "failure")) {
            return res.status(500).json({ success: false, message: "Error for create subscription customer.",data:result });
        }

        user.customerReferenceCode = result.data.referenceCode;
        user.save();

        return res.json({ success: true, message: "Subscription customer created successfully", data: result });
    });
}

export const updateCustomer = async (req: Request, res: Response): Promise<any> => {

    const {customerReferenceCode} = req.params;
    const {name, surname, email, gsmNumber} = req.body;

    const user = await User.findOne({ email: email});

    if (!user){

        return res.status(404).json({success: false, message:"User not found for the update customer!"})
    } 

    let address = {
        contactName: user.name,
        city: "Istanbul",
        district: "Kadiköy",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No: 1",
        zipCode: "34742"
    };


    const updateRequest = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: '123456789',
        customerReferenceCode: customerReferenceCode,
        name: name,
        surname: surname,
        identityNumber: '11111111111',
        email: email, // email can not be updated
        gsmNumber: gsmNumber,
        billingAddress: address,
        shippingAddress: address
    };

    iyzipay.subscriptionCustomer.update(updateRequest, function (err, result) {


        if (err || (result.status === "failure")) {
            return res.status(500).json({ success: false, message: "Error for update subscription customer.",data:result });
        }
        
        return res.json({ success: true, message: "Subscription customer updated successfully", data: result });
    });
}

export const retriveCustomer = async (req: Request, res: Response): Promise<any> => {

    const {customerReferenceCode} = req.params;
    
    const user = await User.findOne({ customerReferenceCode:customerReferenceCode}).select("-password");

    if (!user){

        return res.status(404).json({success: false, message:"User not found for the retrieve customer!"})
    } 
    

    const retrieveRequest = {
        customerReferenceCode: customerReferenceCode
    };

    iyzipay.subscriptionCustomer.retrieve(retrieveRequest, function (err, result:any) {

        if (err || (result.status === "failure")) {
            return res.status(500).json({ success: false, message: "Error for retrieve subscription customer.",data:result });
        }

        return res.json({ success: true, message: "Subscription customer retrieved successfully", data: result,user:user });
    });
}

export const retrieveListCustomer = async (req: Request, res: Response): Promise<any> => {

    const {page, count} = req.body;
    
    const retrieveRequest = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: '123456789',
        page: page,
        count: count
    };

    iyzipay.subscriptionCustomer.retrieveList(retrieveRequest, function (err, result) {

        if (err || (result.status === "failure")) {
            return res.status(500).json({ success: false, message: "Error for retrieve subscription customer list.",data:result });
        }
        
        return res.json({ success: true, message: "Subscription customer list retrieved successfully", data: result });
    });

}


// Subscription
export const initializeSubscription = async (req: Request, res: Response): Promise<any> => {

    const {plan,period,cardHolderName,cardNumber,expireYear,expireMonth,cvc,gsmNumber} = req.body;

    const user = await User.findOne({ _id:req.headers.userId}).select("-password");

    const name = user?.name.split(" ")[0] ;
    const surname = user?.name.split(" ")[1] || " " ;
  

    if (!user){

        return res.status(404).json({success: false, message:"User not found for the initialize subscription!"})
    }

    if(user.plan === plan){ // if user tries to subscribe the same plan

        return res.status(500).json({success: false, message:"User already has the same plan for initialize subscription!"})
    }


    let address = {
        contactName: user.name,
        city: "Istanbul",
        district: "Kadiköy",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No: 1",
        zipCode: "34742"
    };

    let paymentCard = {
        cardHolderName: cardHolderName,
        cardNumber: cardNumber,
        expireYear: expireYear,
        expireMonth: expireMonth,
        cvc: cvc,
        registerConsumerCard: true,
        cardAlias:"My card alias",
    };


    const request = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: '123456789',
        callbackUrl: 'https://bm-api-seven.vercel.app/api/iyzipay/subscription/callback',
        pricingPlanReferenceCode: plan === "scale" ? "fbbe6d23-7646-490b-82f3-32be98c2bd05" : "" , // ONLY SCALE FOR NOW !!!!!!!!!!!!!!!
        subscriptionInitialStatus: Iyzipay.SUBSCRIPTION_INITIAL_STATUS.ACTIVE,
        paymentCard: paymentCard,
        customer: {
            name: name as string,
            surname: surname as string,
            identityNumber: "11111111111",
            email: user.email,
            gsmNumber: gsmNumber,
            billingAddress: address,
            shippingAddress: address
        }
    };
    
    iyzipay.subscription.initialize(request, function (err, result:any) {

        if (err || (result.status === "failure")) {
            return res.status(500).json({ success: false, message: "Error for initialize subscription.",data:result });
        }
        
        const retrieveRequest = {
            pricingPlanReferenceCode: result.data.pricingPlanReferenceCode,
        };

        let endDate = new Date();

        if (period === "yearly") {
            endDate.setFullYear(endDate.getFullYear() + 1); // 1 year from now
        } else if (period === "monthly" ) {
            endDate.setMonth(endDate.getMonth() + 1); // 1 month from now
        } else {
            return res.status(500).json({ success: false, message: "Error for end date setup in initialize subscription",data:result });
        }

        const subscription = new iyzipaySubscription({
            userId:user._id,
            referenceCode:result.data.referenceCode,
            customerReferenceCode:result.data.customerReferenceCode,
            pricingPlanReferenceCode:result.data.pricingPlanReferenceCode,
            plan:plan,
            period: period,
            startDate: Date.now(),
            endDate:endDate,
            subscriptionStatus: result.data.subscriptionStatus
        });

        subscription.save();

        user.customerReferenceCode = result.data.customerReferenceCode;
        user.plan = plan;
        user.gsmNumber = gsmNumber;

        user.save();


        return res.json({ success: true, message: "Subscription initialized successfully", data: result });
    });
}

export const activateSubscription = async (req: Request, res: Response): Promise<any> => {

    const {subscriptionReferenceCode} = req.params;


    const subscription = await iyzipaySubscription.findOne({ referenceCode:subscriptionReferenceCode});

    if(!subscription){

        return res.status(404).json({success: false, message:"Subscription not found for the activate subscription!"});
    }

    const activateRequest = {
        subscriptionReferenceCode: subscriptionReferenceCode
    };

    iyzipay.subscription.activate(activateRequest, function (err, result) {

        if (err || (result.status === "failure")) {
            return res.status(500).json({ success: false, message: "Error for activate subscription.",data:result });
        }
        
        subscription.subscriptionStatus = "ACTIVE";
        subscription.save();



        return res.json({ success: true, message: "Subscription activated successfully", data: result });
    });

}

export const cancelSubscription = async (req: Request, res: Response): Promise<any> => {

    const {subscriptionReferenceCode} = req.params;

    const subscription = await iyzipaySubscription.findOne({ referenceCode:subscriptionReferenceCode});
    const user = await User.findOne({ customerReferenceCode:subscription?.customerReferenceCode}).select("-password");

    

    if((!subscription) || (!user)){

        return res.status(404).json({success: false, message:"Subscription or user not found for the activate subscription!"});
    }

    await iyzipaySubscription.deleteOne({ referenceCode:subscriptionReferenceCode}); //delete the subscription

    const cancelRequest = {
        subscriptionReferenceCode: subscriptionReferenceCode
    };


    iyzipay.subscription.cancel(cancelRequest, function (err, result) {

        if (err || (result.status === "failure")) {
            return res.status(500).json({ success: false, message: "Error for cancel subscription.",data:result });
        }
        
        

        user.plan = "starter"; // default plan after cancellation.
        user.save();

        return res.json({ success: true, message: "Subscription canceled successfully", data: result });
    });
}

export const upgradeSubscription = async (req: Request, res: Response): Promise<any> => {

    const {subscriptionReferenceCode} = req.params;
    const {newPricingPlan,period} = req.body;

    const subscription = await iyzipaySubscription.findOne({ referenceCode:subscriptionReferenceCode});
    const user = await User.findOne({ _id:subscription?.userId}).select("-password");

    if((!subscription) || (!user)){

        return res.status(404).json({success: false, message:"Subscription or user not found for the upgrade subscription!"});
    }

    if(newPricingPlan === user?.plan  ){

        return res.status(500).json({ success: false, message:"User already has the same plan for upgrade subscription!"});
    }

    let newPricingPlanReferenceCode;

    switch (newPricingPlan.toLowerCase()) {
        case "scale":
            newPricingPlanReferenceCode = "0377e55e-4739-489b-a6a9-130d869b6b9c";    
            break;
        
        // Should add other plan's reference code
        default:
            break;
    }

    const upgradeRequest = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: '123456789',
        subscriptionReferenceCode: subscriptionReferenceCode,
        newPricingPlanReferenceCode: newPricingPlanReferenceCode as string,
        upgradePeriod: Iyzipay.SUBSCRIPTION_UPGRADE_PERIOD.NOW,
        useTrial: false,
        resetRecurrence:false // it will have same endDate as previous pricing plan
    };

    iyzipay.subscription.upgrade(upgradeRequest, function (err, result) {

        if (err || (result.status === "failure")) {
            return res.status(500).json({ success: false, message: "Error for upgrade subscription.",data:result });
        }
        
        user.plan = newPricingPlan;
        user.save();

        subscription.plan = newPricingPlan;
        subscription.pricingPlanReferenceCode = newPricingPlanReferenceCode!;
        subscription.period = period;
        subscription.save();

        return res.json({ success: true, message: "Subscription upgraded successfully", data: result });
    });
}

export const retrieveSubscription = async (req: Request, res: Response): Promise<any> => {

    const {subscriptionReferenceCode} = req.params;

    var retrieveRequest = {
        subscriptionReferenceCode: subscriptionReferenceCode
    };

    iyzipay.subscription.retrieve(retrieveRequest, function (err, result) {

        if (err || (result.status === "failure")) {
            return res.status(500).json({ success: false, message: "Error for retrieve subscription.",data:result });
        }
        
        return res.json({ success: true, message: "Subscription retrieved successfully", data: result });
    });
}


export const callback = async (req: Request, res: Response): Promise<any> => {

    console.log("callbacks");
    res.send("callback");
}
