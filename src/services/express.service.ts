// src/services/express.service.ts
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import globalErrorHandler from '../middlewares/errorMiddleware';
import apiRouter from '../routes/authRoute';
import userRouter from '../routes/userRoute';
import adminRouter from '../routes/adminRoute';

dotenv.config();

const createExpressApp = () => {
    const app = express();

    app.use(cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    }));

    // Serve static files from the public directory
    app.use(express.static(path.join(__dirname, "../public")));

    // Built-in JSON and URL-encoded middleware
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));

    // Compression, cookie parsing, and body parsing middleware
    app.use(compression());
    app.use(cookieParser());
    app.use(bodyParser.json());

    // Use your routes
    app.use("/api", apiRouter);
    app.use("/api/user", userRouter);
    app.use("/api/admin", adminRouter);

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
