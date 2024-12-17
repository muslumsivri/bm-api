import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";

export const isAuthenticated = (req:Request, res:Response, next:NextFunction):any => {
	const token = req.cookies.token;
	if (!token) return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

		if (!decoded) return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });

		req.headers.userId = (decoded as JwtPayload).userId;
		return next();
	} catch (error) {
		console.log("Error in isAuthenticated ", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};

export const isAdmin = async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    
	try {

        // find user bu id
        const user = await User.findById(req.headers.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

        //if user's role is "admin"
        if (user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Unauthorized - user is not an admin" });
        }
        //next middleware
		return next();

	} catch (error) {
		console.log("Error in isAdmin ", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};


export const isModerator = async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    
	try {

        // find user bu id
        const user = await User.findById(req.headers.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

        //if user's role is "moderator or admin"
        if ((user.role !== "moderator") && (user.role !== "admin")) {
            return res.status(403).json({ success: false, message: "Unauthorized - user is not an moderator" });
        }
        //next middleware
		return next();

	} catch (error) {
		console.log("Error in isModerator ", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};