import { Request, Response,NextFunction } from "express";

export const adminDashboard =  (req:Request, res:Response) :any=> {

	return res.status(200).json({ success: true, message: "ADMIN dashboard" });

}

export const moderatorDashboard =  (req:Request, res:Response) :any=> {

	return res.status(200).json({ success: true, message: "MODERATOR dashboard"});
	
}

export const userDashboard =  (req:Request, res:Response) :any=> {

	return res.status(200).json({ success: true, message: "USER dashboard"});

}

