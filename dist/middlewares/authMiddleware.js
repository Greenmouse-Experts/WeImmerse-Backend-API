"use strict";
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
const jwt_service_1 = __importDefault(require("../services/jwt.service"));
const user_1 = __importDefault(require("../models/user")); // Assuming this is your Sequelize model
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // If the server JWT handling is disabled, skip the middleware
        if (process.env.SERVER_JWT === "false") {
            return next();
        }
        // Extract the JWT token from the request headers
        const token = jwt_service_1.default.jwtGetToken(req);
        if (!token) {
            res.status(401).json({ message: "Token not provided" });
            return;
        }
        // Check if the token is blacklisted
        if (jwt_service_1.default.jwtIsTokenBlacklisted(token)) {
            res.status(403).json({ message: "Token is blacklisted. Please log in again." });
            return;
        }
        // Verify the token and decode the payload
        const decoded = jwt_service_1.default.jwtVerify(token); // Type assertion to `DecodedToken`
        req.userId = decoded.id; // Assuming `id` is the user ID in the token payload
        // Find the user by ID
        const user = yield user_1.default.findOne({
            where: { id: req.userId },
        });
        if (!user) {
            res.status(401).json({ message: "User not authorized" });
            return;
        }
        // Attach the user instance to the request object
        req.user = user;
        return next(); // Proceed to the next middleware or route handler
    }
    catch (error) {
        console.error("Authentication error:", error.message);
        // Handle specific JWT-related errors
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ message: "Token has expired. Please log in again." });
            return;
        }
        if (error.name === "JsonWebTokenError") {
            res.status(401).json({ message: "Invalid token. Please log in again." });
            return;
        }
        // Handle all other unexpected errors
        res.status(401).json({ message: "Unauthorized" });
    }
});
exports.default = authMiddleware;
