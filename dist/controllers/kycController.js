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
exports.reviewKYC = exports.uploadKYCDocument = void 0;
const kycverification_1 = require("../models/kycverification");
const kycdocument_1 = __importStar(require("../models/kycdocument"));
// Upload KYC Document
const uploadKYCDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming the user ID is passed in the URL params
        const { documentType, documentUrl } = req.body;
        if (!userId || !documentType || !documentUrl) {
            return res
                .status(400)
                .json({ status: false, message: 'All fields are required' });
        }
        const allowedTypes = Object.values(kycdocument_1.KYCDocumentType);
        if (!allowedTypes.includes(documentType)) {
            return res
                .status(400)
                .json({ status: false, message: 'Invalid document type' });
        }
        // Check if document type has already been uploaded
        const savedDocument = yield kycdocument_1.default.findOne({
            where: { userId, documentType },
        });
        if (savedDocument) {
            return res.status(409).json({
                status: false,
                message: 'KYC Document type has already been uploaded.',
            });
        }
        const document = yield kycdocument_1.default.create({
            userId,
            documentType,
            documentUrl,
        });
        return res.status(201).json({
            status: true,
            message: 'Document uploaded',
            document,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Server error',
            error,
        });
    }
});
exports.uploadKYCDocument = uploadKYCDocument;
// Initiate KYC Verification Request
// export const initiateKYCVerification = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const userId = (req as AuthRequest).user?.id; // Assuming the user ID is passed in the URL params
//     const { verificationProvider, verificationReference } = req.body;
//     if (!userId || !verificationProvider || !verificationReference) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }
//     const existingRequest = await KYCVerification.findOne({
//       where: { userId, status: 'pending' },
//     });
//     if (existingRequest) {
//       return res
//         .status(400)
//         .json({ message: 'A pending KYC request already exists' });
//     }
//     const kycRequest = await KYCVerification.create({
//       userId,
//       verificationProvider,
//       verificationReference,
//       status: KYCVerificationStatus.PENDING,
//     });
//     return res
//       .status(201)
//       .json({ message: 'KYC verification initiated', kycRequest });
//   } catch (error) {
//     return res.status(500).json({ message: 'Server error', error });
//   }
// };
// Admin Review KYC
const reviewKYC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming the user ID is passed in the URL params
        const { kycId, status } = req.body;
        if (!kycId || !status) {
            return res
                .status(400)
                .json({ status: false, message: 'KYC ID and status are required' });
        }
        if (![
            kycverification_1.KYCVerificationStatus.APPROVED,
            kycverification_1.KYCVerificationStatus.REJECTED,
        ].includes(status)) {
            return res.status(400).json({ status: false, message: 'Invalid status' });
        }
        const kycDoc = yield kycdocument_1.default.findByPk(kycId);
        if (!kycDoc) {
            return res
                .status(404)
                .json({ status: false, message: 'KYC document not found' });
        }
        kycDoc.vettingStatus = status;
        kycDoc.vettedBy = adminId;
        kycDoc.vettedAt = new Date();
        yield kycDoc.save();
        // Send email notification to creator/instructor regarding kyc document review
        return res
            .status(200)
            .json({ status: true, message: `KYC ${status}`, kycDoc });
    }
    catch (error) {
        return res
            .status(500)
            .json({ status: false, message: 'Server error', error });
    }
});
exports.reviewKYC = reviewKYC;
//# sourceMappingURL=kycController.js.map