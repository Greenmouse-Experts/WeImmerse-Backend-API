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
exports.submitOrUpdateKYC = void 0;
const logger_1 = __importDefault(require("../middlewares/logger")); // Adjust the path to your logger.js
const kyc_1 = __importDefault(require("../models/kyc"));
const submitOrUpdateKYC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const vendorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Authenticated user ID from middleware
    console.log(vendorId);
    const kycData = req.body;
    try {
        // Check if a KYC record already exists for this user
        const existingKYC = yield kyc_1.default.findOne({ where: { vendorId } });
        if (existingKYC) {
            // Update the existing KYC record
            yield existingKYC.update(kycData);
            res
                .status(200)
                .json({ message: "KYC updated successfully", data: existingKYC });
            return;
        }
        else {
            // Create a new KYC record
            const newKYC = yield kyc_1.default.create(Object.assign({ vendorId }, kycData));
            res
                .status(200)
                .json({ message: "KYC created successfully", data: newKYC });
            return;
        }
    }
    catch (error) {
        logger_1.default.error(error);
        res
            .status(500)
            .json({ message: "An error occurred while processing KYC" });
    }
});
exports.submitOrUpdateKYC = submitOrUpdateKYC;
//# sourceMappingURL=vendorController.js.map