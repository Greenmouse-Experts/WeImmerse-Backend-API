"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const dotenv = __importStar(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const express_service_1 = __importDefault(require("./services/express.service"));
const sequelize_service_1 = __importDefault(require("./services/sequelize.service")); // Adjusted to match your service structure
const authRoute_1 = __importDefault(require("./routes/authRoute")); // Import your routes here
const subscription_job_1 = require("./jobs/subscription.job");
// import { configureSocket } from "./services/socket.service";
dotenv.config();
// Initialize the Express app
const app = (0, express_service_1.default)();
// Create the HTTP server
const server = http_1.default.createServer(app);
// Attach Socket.IO to the HTTP server
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*', // Change to specific origins in production
    },
});
exports.io = io;
app.use('/api', authRoute_1.default); // Mount the router to /api
// Initialize and sync Sequelize
sequelize_service_1.default
    .init()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    if (sequelize_service_1.default.connection) {
        yield sequelize_service_1.default.connection.authenticate(); // Ensure the connection is established
        console.log('Database connected successfully');
        // Setup cron jobs
        (0, subscription_job_1.setupSubscriptionJobs)();
    }
    else {
        console.error('Database connection is not initialized.');
    }
}))
    .catch((error) => console.error('Error connecting to the database:', error));
// Create and start the HTTP server
const port = process.env.SERVER_PORT || 3001; // Get the port from the environment variables
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
        var _a;
        console.log('HTTP server closed.');
        (_a = sequelize_service_1.default.connection) === null || _a === void 0 ? void 0 : _a.close().then(() => {
            console.log('Database connection closed.');
            process.exit(0);
        });
    });
});
//# sourceMappingURL=index.js.map