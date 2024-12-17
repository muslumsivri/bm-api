import mongoose from "mongoose";

// Subscription schema
const iyzipaySubscriptionSchema = new mongoose.Schema( // createdAt and updatedAt are added automatically
    {
        userId: {
            type: String,
            unique: true,
        },
        referenceCode:{
            type: String,
            unique: true,
        },
        customerReferenceCode:{
            type: String,
        },
        pricingPlanReferenceCode:{
            type: String,
        },
        plan:{
            type:	String,
            enum:	["starter","scale","enterprise"],
            default: "starter",
        },
        period: {
            type: String,
            enum:["monthly","yearly"],
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
        },
        subscriptionStatus: {
            type: String,
            default: "ACTIVE",
            enum: ["ACTIVE", "EXPIRED", "CANCELLED","UNPAID","PENDING","UPGRADED"]
        },

    },
    { timestamps: true }
);

export const iyzipaySubscription = mongoose.model("iyzipaySubscription", iyzipaySubscriptionSchema);