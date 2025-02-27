import { Request, Response } from 'express';
import { Op } from 'sequelize';
import KYCVerification, {
  KYCVerificationStatus,
} from '../models/kycverification';
import KYCDocuments, { KYCDocumentType } from '../models/kycdocument';
import User from '../models/user';
import Admin from '../models/admin';

interface AuthRequest extends Request {
  user?: any;
}

// Upload KYC Document
export const uploadKYCDocument = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = (req as AuthRequest).user?.id; // Assuming the user ID is passed in the URL params
    const { documentType, documentUrl } = req.body;

    if (!userId || !documentType || !documentUrl) {
      return res
        .status(400)
        .json({ status: false, message: 'All fields are required' });
    }

    const allowedTypes = Object.values(KYCDocumentType);
    if (!allowedTypes.includes(documentType)) {
      return res
        .status(400)
        .json({ status: false, message: 'Invalid document type' });
    }

    // Check if document type has already been uploaded
    const savedDocument = await KYCDocuments.findOne({
      where: { userId, documentType },
    });

    if (savedDocument) {
      return res.status(409).json({
        status: false,
        message: 'KYC Document type has already been uploaded.',
      });
    }

    const document = await KYCDocuments.create({
      userId,
      documentType,
      documentUrl,
    });
    return res.status(201).json({
      status: true,
      message: 'Document uploaded',
      document,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Server error',
      error,
    });
  }
};

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
export const reviewKYC = async (req: Request, res: Response): Promise<any> => {
  try {
    const adminId = (req as AuthRequest).user?.id; // Assuming the user ID is passed in the URL params

    const { kycId, status } = req.body;

    if (!kycId || !status) {
      return res
        .status(400)
        .json({ status: false, message: 'KYC ID and status are required' });
    }

    if (
      ![
        KYCVerificationStatus.APPROVED,
        KYCVerificationStatus.REJECTED,
      ].includes(status)
    ) {
      return res.status(400).json({ status: false, message: 'Invalid status' });
    }

    const kycDoc = await KYCDocuments.findByPk(kycId);
    if (!kycDoc) {
      return res
        .status(404)
        .json({ status: false, message: 'KYC document not found' });
    }

    kycDoc.vettingStatus = status;
    kycDoc.vettedBy = adminId;
    kycDoc.vettedAt = new Date();
    await kycDoc.save();

    // Send email notification to creator/instructor regarding kyc document review

    return res
      .status(200)
      .json({ status: true, message: `KYC ${status}`, kycDoc });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: 'Server error', error });
  }
};
