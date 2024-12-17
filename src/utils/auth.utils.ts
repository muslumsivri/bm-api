import express, { Request, Response,NextFunction } from "express";

import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res:Response, userId:string):string => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
		expiresIn: "7d",
	});

	res.cookie("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});

	return token;
};