"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/services/express.service.ts
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const errorMiddleware_1 = __importDefault(require("../middlewares/errorMiddleware"));
const authRoute_1 = __importDefault(require("../routes/authRoute"));
const adminRoute_1 = __importDefault(require("../routes/adminRoute"));
const generalRoute_1 = __importDefault(require("../routes/generalRoute"));
const userRoute_1 = __importDefault(require("../routes/userRoute"));
const studentRoute_1 = __importDefault(require("../routes/studentRoute"));
const creatorRoute_1 = __importDefault(require("../routes/creatorRoute"));
const institutionRoute_1 = __importDefault(require("../routes/institutionRoute"));
const kycRoute_1 = __importDefault(require("../routes/kycRoute"));
const withdrawalRoute_1 = __importDefault(require("../routes/withdrawalRoute"));
const categoryRoute_1 = __importDefault(require("../routes/categoryRoute"));
dotenv_1.default.config();
const createExpressApp = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    }));
    // Serve static files from the public directory
    app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
    // Built-in JSON and URL-encoded middleware
    app.use(express_1.default.json({ limit: '50mb' }));
    app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
    // Compression, cookie parsing, and body parsing middleware
    app.use((0, compression_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.use(body_parser_1.default.json());
    app.get('/', (req, res) => {
        return res.send('Hello world.');
    });
    // Use your routes
    app.use('/v1/api/', authRoute_1.default);
    app.use('/v1/api/general', generalRoute_1.default);
    app.use('/v1/api/user', userRoute_1.default);
    app.use('/v1/api/institution', institutionRoute_1.default);
    app.use('/v1/api/student', studentRoute_1.default);
    app.use('/v1/api/creator', creatorRoute_1.default);
    app.use('/v1/api/admin', adminRoute_1.default);
    app.use('/v1/api/kyc', kycRoute_1.default);
    app.use('/v1/api/withdrawal', withdrawalRoute_1.default);
    app.use('/v1/api/category', categoryRoute_1.default);
    // 404 handler (this should come after routes)
    app.use((req, res) => {
        console.log(`404 error for path: ${req.path}`);
        res.status(404).json({ message: 'Not Found' });
    });
    // Global error handler
    app.use(errorMiddleware_1.default);
    return app;
};
exports.default = createExpressApp;
//# sourceMappingURL=express.service.js.map