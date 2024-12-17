import express from 'express';
import { adminDashboard,moderatorDashboard,userDashboard } from '../controllers/dashboard.controller';
import { isAuthenticated,isAdmin,isModerator } from '../middlewares/auth.middlewares';

const router = express.Router();

router.get('/admin-dashboard',isAuthenticated,isAdmin,adminDashboard);
router.get('/moderator-dashboard',isAuthenticated,isModerator,moderatorDashboard);
router.get('/user-dashboard',isAuthenticated,userDashboard);


export default router;