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
    const { userId, documentType, documentUrl } = req.body;

    if (!userId || !documentType || !documentUrl) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const allowedTypes = Object.values(KYCDocumentType);
    if (!allowedTypes.includes(documentType)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    const document = await KYCDocuments.create({
      userId,
      documentType,
      documentUrl,
    });
    return res.status(201).json({ message: 'Document uploaded', document });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Initiate KYC Verification Request
export const initiateKYCVerification = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId, verificationProvider, verificationReference } = req.body;

    if (!userId || !verificationProvider || !verificationReference) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingRequest = await KYCVerification.findOne({
      where: { userId, status: 'pending' },
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: 'A pending KYC request already exists' });
    }

    const kycRequest = await KYCVerification.create({
      userId,
      verificationProvider,
      verificationReference,
      status: KYCVerificationStatus.PENDING,
    });

    return res
      .status(201)
      .json({ message: 'KYC verification initiated', kycRequest });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Admin Review KYC
export const reviewKYC = async (req: Request, res: Response): Promise<any> => {
  try {
    const { verificationId } = req.params;
    const { adminId, status } = req.body;

    if (!adminId || !status) {
      return res
        .status(400)
        .json({ message: 'Admin ID and status are required' });
    }

    if (
      ![
        KYCVerificationStatus.APPROVED,
        KYCVerificationStatus.REJECTED,
      ].includes(status)
    ) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const verification = await KYCVerification.findByPk(verificationId);
    if (!verification) {
      return res.status(404).json({ message: 'KYC request not found' });
    }

    verification.status = status;
    verification.adminReviewedBy = adminId;
    verification.adminReviewedAt = new Date();
    await verification.save();

    return res.status(200).json({ message: `KYC ${status}`, verification });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
