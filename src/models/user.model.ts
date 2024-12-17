import mongoose from "mongoose";

// User schema
const userSchema = new mongoose.Schema( // createdAt and updatedAt are added automatically
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		role: {
			type: String,
            enum: ["user","moderator" ,"admin"],
            default: "user",
		},
		plan:{
			type:	String,
			enum:	["starter","scale","enterprise"],
			default: "starter",
		},
		customerId:{
			type: String,

		},
		customerReferenceCode:{
			type: String

		},
		gsmNumber:{
			type: String,
		},
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
