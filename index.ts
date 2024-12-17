import express, { Request, Response, Application} from "express";
import dotenv from "dotenv";

import cors from "cors";
import cookieParser from 'cookie-parser';

import { connectDB } from './src/db/connectDB';

import authRoutes from './src/routes/auth.route';
import dashboardRoutes from './src/routes/dashboard.route';
import stripeRoutes from './src/routes/stripe.route';
import iyzipayRoutes from './src/routes/iyzipay.route';

dotenv.config();

var delayInMilliseconds = 3000; //3 seconds

const app:Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Resource sharing
app.use(cookieParser());                                              //allows us to parse incoming cookies
app.use((req, res, next) => {
  if (req.originalUrl === "/api/stripe/webhooks") {
      next();
  } else {
      express.json()(req, res, next); // allows us to parse incoming requests with JSON payloads other than stripe routes
  }
});                                             
                                            


app.get('/', (req:Request, res:Response) => {
    res.send("Health Check");
});

// Routes
app.use("/api/auth",authRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/stripe",stripeRoutes);
app.use("/api/iyzipay",iyzipayRoutes);


try {
    setTimeout(async function () {
      
    app.listen(PORT, () => {
        connectDB();
        console.log(`Server is running on port:${PORT}`);
    });
      
    }, delayInMilliseconds);
  } catch (error) {
    console.error("Error connecting to Server:", error);
  }


  app.set('view engine', 'ejs')


