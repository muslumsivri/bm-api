import mongoose from "mongoose";

// Subscription schema
const subscriptionSchema = new mongoose.Schema( // createdAt and updatedAt are added automatically
	{
		userId: {
			type: String,
			unique: true,
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
		isCanceled: {
			type: Boolean,
			default: false,
		},

	},
	{ timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);