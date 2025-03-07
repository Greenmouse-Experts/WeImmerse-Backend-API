import { Request, Response } from 'express';
import { Op } from 'sequelize';
import KYCVerification, {
  KYCVerificationStatus,
} from '../models/kycverification';
import KYCDocuments, { KYCDocumentType } from '../models/kycdocument';
import User from '../models/user';
import Admin from '../models/admin';
import { emailTemplates } from '../utils/messages';
import { sendMail } from '../services/mail.service';
import logger from '../middlewares/logger';

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

    const { kycId, status, reason } = req.body;

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

    let kycDoc = (await KYCDocuments.findOne({
      where: { id: kycId },
      include: [{ model: User, as: 'user' }],
    })) as KYCDocuments & { user: User };

    if (!kycDoc) {
      return res
        .status(404)
        .json({ status: false, message: 'KYC document not found' });
    }

    kycDoc.vettingStatus = status;
    kycDoc.vettedBy = adminId;
    kycDoc.vettedAt = new Date();
    kycDoc.reason = reason || kycDoc.reason;
    await kycDoc.save();

    if (status === KYCVerificationStatus.REJECTED) {
      // Deactivate account due to the kyc document that was rejected
      await User.update(
        { verified: false, reason },
        { where: { id: kycDoc.user.id } }
      );
    }

    kycDoc = JSON.parse(JSON.stringify(kycDoc));

    // Send email notification to creator/instructor regarding kyc document review
    // Prepare and send the verification email
    const message = emailTemplates.kycStatusEmail(kycDoc.user, kycDoc); // Ensure verifyEmailMessage generates the correct email message
    try {
      await sendMail(
        kycDoc.user.email,
        `${process.env.APP_NAME} - 📢 Update on Your KYC Document Status`,
        message
      );
    } catch (emailError) {
      logger.error('Error sending email:', emailError); // Log error for internal use
    }

    return res.status(200).json({
      status: true,
      message: `KYC ${status}`,
      kycDoc: {
        ...kycDoc,
        user: { ...kycDoc.user, verified: false, reason },
      },
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ status: false, message: 'Server error', error });
  }
};
