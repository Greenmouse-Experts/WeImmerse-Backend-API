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
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewKYC = exports.initiateKYCVerification = exports.uploadKYCDocument = void 0;
const kycverification_1 = __importStar(require("../models/kycverification"));
const kycdocument_1 = __importStar(require("../models/kycdocument"));
// Upload KYC Document
const uploadKYCDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming the user ID is passed in the URL params
        const { documentType, documentUrl } = req.body;
        if (!userId || !documentType || !documentUrl) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const allowedTypes = Object.values(kycdocument_1.KYCDocumentType);
        if (!allowedTypes.includes(documentType)) {
            return res.status(400).json({ message: 'Invalid document type' });
        }
        const document = yield kycdocument_1.default.create({
            userId,
            documentType,
            documentUrl,
        });
        return res.status(201).json({ message: 'Document uploaded', document });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
exports.uploadKYCDocument = uploadKYCDocument;
// Initiate KYC Verification Request
const initiateKYCVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming the user ID is passed in the URL params
        const { verificationProvider, verificationReference } = req.body;
        if (!userId || !verificationProvider || !verificationReference) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingRequest = yield kycverification_1.default.findOne({
            where: { userId, status: 'pending' },
        });
        if (existingRequest) {
            return res
                .status(400)
                .json({ message: 'A pending KYC request already exists' });
        }
        const kycRequest = yield kycverification_1.default.create({
            userId,
            verificationProvider,
            verificationReference,
            status: kycverification_1.KYCVerificationStatus.PENDING,
        });
        return res
            .status(201)
            .json({ message: 'KYC verification initiated', kycRequest });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
exports.initiateKYCVerification = initiateKYCVerification;
// Admin Review KYC
const reviewKYC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming the user ID is passed in the URL params
        const { verificationId } = req.params;
        const { status } = req.body;
        if (!adminId || !status) {
            return res
                .status(400)
                .json({ message: 'Admin ID and status are required' });
        }
        if (![
            kycverification_1.KYCVerificationStatus.APPROVED,
            kycverification_1.KYCVerificationStatus.REJECTED,
        ].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const verification = yield kycverification_1.default.findByPk(verificationId);
        if (!verification) {
            return res.status(404).json({ message: 'KYC request not found' });
        }
        verification.status = status;
        verification.adminReviewedBy = adminId;
        verification.adminReviewedAt = new Date();
        yield verification.save();
        return res.status(200).json({ message: `KYC ${status}`, verification });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
exports.reviewKYC = reviewKYC;
//# sourceMappingURL=kycController.js.map