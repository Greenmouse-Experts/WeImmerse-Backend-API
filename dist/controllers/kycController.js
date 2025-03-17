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
exports.getKYCDocuments = exports.reviewKYC = exports.uploadKYCDocument = void 0;
const kycverification_1 = require("../models/kycverification");
const kycdocument_1 = __importStar(require("../models/kycdocument"));
const user_1 = __importDefault(require("../models/user"));
const messages_1 = require("../utils/messages");
const mail_service_1 = require("../services/mail.service");
const logger_1 = __importDefault(require("../middlewares/logger"));
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
        const { kycId, status, reason } = req.body;
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
        let kycDoc = (yield kycdocument_1.default.findOne({
            where: { id: kycId },
            include: [{ model: user_1.default, as: 'user' }],
        }));
        if (!kycDoc) {
            return res
                .status(404)
                .json({ status: false, message: 'KYC document not found' });
        }
        kycDoc.vettingStatus = status;
        kycDoc.vettedBy = adminId;
        kycDoc.vettedAt = new Date();
        kycDoc.reason = reason || kycDoc.reason;
        yield kycDoc.save();
        if (status === kycverification_1.KYCVerificationStatus.REJECTED) {
            // Deactivate account due to the kyc document that was rejected
            yield user_1.default.update({ verified: false, reason }, { where: { id: kycDoc.user.id } });
        }
        kycDoc = JSON.parse(JSON.stringify(kycDoc));
        // Send email notification to creator/instructor regarding kyc document review
        // Prepare and send the verification email
        const message = messages_1.emailTemplates.kycStatusEmail(kycDoc.user, kycDoc); // Ensure verifyEmailMessage generates the correct email message
        try {
            yield (0, mail_service_1.sendMail)(kycDoc.user.email, `${process.env.APP_NAME} - 📢 Update on Your KYC Document Status`, message);
        }
        catch (emailError) {
            logger_1.default.error('Error sending email:', emailError); // Log error for internal use
        }
        return res.status(200).json({
            status: true,
            message: `KYC ${status}`,
            kycDoc: Object.assign(Object.assign({}, kycDoc), { user: Object.assign(Object.assign({}, kycDoc.user), { verified: false, reason }) }),
        });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: false, message: 'Server error', error });
    }
});
exports.reviewKYC = reviewKYC;
const getKYCDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming the user ID is passed in the URL params
        const { userId } = req.params;
        if (!userId) {
            return res
                .status(400)
                .json({ status: false, message: 'User ID is required' });
        }
        let kycDoc = yield kycdocument_1.default.findAll({
            where: { userId },
        });
        if (!kycDoc) {
            return res
                .status(404)
                .json({ status: false, message: 'KYC document not found' });
        }
        return res.status(200).json({
            status: true,
            message: `KYC Documents retrieved.`,
            data: kycDoc,
        });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: false, message: 'Server error', error });
    }
});
exports.getKYCDocuments = getKYCDocuments;
//# sourceMappingURL=kycController.js.map