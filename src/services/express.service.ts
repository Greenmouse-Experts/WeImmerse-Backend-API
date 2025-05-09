// src/services/express.service.ts
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import globalErrorHandler from '../middlewares/errorMiddleware';
import apiRouter from '../routes/authRoute';
import adminRouter from '../routes/adminRoute';
import generalRouter from '../routes/generalRoute';
import userRouter from '../routes/userRoute';
import studentRouter from '../routes/studentRoute';
import creatorRouter from '../routes/creatorRoute';
import institutionRouter from '../routes/institutionRoute';
import kycRouter from '../routes/kycRoute';
import withdrawalRouter from '../routes/withdrawalRoute';
import categoryRouter from '../routes/categoryRoute';
import subscriptionRouter from '../routes/subscriptionRoute';
import couponRouter from '../routes/couponRoute';
import purchaseRouter from '../routes/purchaseRoute';
import statRouter from '../routes/statsRoutes';
import analysisRouter from '../routes/analysisRoute';

dotenv.config();

const createExpressApp = () => {
  const app = express();

  app.use(
    cors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    })
  );

  // Serve static files from the public directory
  app.use(express.static(path.join(__dirname, '../public')));

  // Built-in JSON and URL-encoded middleware
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Compression, cookie parsing, and body parsing middleware
  app.use(compression());
  app.use(cookieParser());
  app.use(bodyParser.json());

  app.get('/', (req: Request, res: Response): any => {
    return res.send('Hello world.');
  });
  // Use your routes
  app.use('/v1/api/', apiRouter);
  app.use('/v1/api/general', generalRouter);
  app.use('/v1/api/user', userRouter);
  app.use('/v1/api/institution', institutionRouter);
  app.use('/v1/api/student', studentRouter);
  app.use('/v1/api/creator', creatorRouter);
  app.use('/v1/api/admin', adminRouter);
  app.use('/v1/api/kyc', kycRouter);
  app.use('/v1/api/withdrawal', withdrawalRouter);
  app.use('/v1/api/category', categoryRouter);
  app.use('/v1/api/subscription', subscriptionRouter);
  app.use('/v1/api/coupon', couponRouter);
  app.use('/v1/api/purchase', purchaseRouter);
  app.use('/v1/api/stat', statRouter);
  app.use('/v1/api/analysis', analysisRouter);

  // 404 handler (this should come after routes)
  app.use((req, res) => {
    console.log(`404 error for path: ${req.path}`);
    res.status(404).json({ message: 'Not Found' });
  });

  // Global error handler
  app.use(globalErrorHandler);

  return app;
};

export default createExpressApp;
