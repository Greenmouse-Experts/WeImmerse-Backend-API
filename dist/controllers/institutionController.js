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
exports.downloadApplicantResume = exports.rejectApplicant = exports.repostJob = exports.viewApplicant = exports.getJobApplicants = exports.deleteJob = exports.closeJob = exports.getJob = exports.getJobs = exports.postJob = exports.addJob = exports.jobCategories = void 0;
const mail_service_1 = require("../services/mail.service");
const messages_1 = require("../utils/messages");
const logger_1 = __importDefault(require("../middlewares/logger"));
const sequelize_1 = require("sequelize");
const jobcategory_1 = __importDefault(require("../models/jobcategory"));
const job_1 = __importDefault(require("../models/job"));
const uuid_1 = require("uuid");
const applicant_1 = __importDefault(require("../models/applicant"));
const user_1 = __importDefault(require("../models/user"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const jobCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobCategory = yield jobcategory_1.default.findAll();
        res.status(200).json({
            data: jobCategory, // You can populate related data as needed
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message ||
                'fetching job category failed. Please try again later.',
        });
    }
});
exports.jobCategories = jobCategories;
const addJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { categoryId, title, description, company, logo, workplaceType, location, jobType, applyLink, } = req.body;
        // Extract user ID from authenticated request
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Validate category
        const category = yield jobcategory_1.default.findByPk(categoryId);
        if (!category) {
            res.status(404).json({
                message: 'Category not found in our database.',
            });
            return;
        }
        // Create the job
        const newJob = yield job_1.default.create({
            creatorId: userId,
            categoryId,
            title,
            description,
            slug: `${title.toLowerCase().replace(/ /g, '-')}-${(0, uuid_1.v4)()}`,
            company,
            logo, // Assuming a URL for the logo is provided
            workplaceType,
            location,
            jobType,
            applyLink,
            status: 'draft', // Default status
        });
        res.status(200).json({
            message: 'Job added successfully.',
            data: newJob, // Optional: format with a resource transformer if needed
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || 'An error occurred while adding the job.',
        });
    }
});
exports.addJob = addJob;
const postJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId, categoryId, title, company, logo, workplaceType, location, jobType, description, skills, applyLink, applicantCollectionEmailAddress, rejectionEmails, } = req.body;
        const job = yield job_1.default.findByPk(jobId);
        if (!job) {
            res.status(404).json({
                message: 'Job not found in our database.',
            });
            return;
        }
        if (categoryId) {
            const category = yield jobcategory_1.default.findByPk(categoryId);
            if (!category) {
                res.status(404).json({
                    message: 'Category not found in our database.',
                });
                return;
            }
        }
        // Use existing job values if new values are not provided
        yield job.update({
            categoryId: categoryId || job.categoryId,
            title: title || job.title,
            company: company || job.company,
            logo: logo || job.logo,
            workplaceType: workplaceType || job.workplaceType,
            location: location || job.location,
            jobType: jobType || job.jobType,
            description,
            skills,
            applyLink,
            applicantCollectionEmailAddress,
            rejectionEmails,
            status: 'active',
        });
        res.status(200).json({
            message: 'Job posted successfully.',
            data: job, // Include a JobResource equivalent if needed
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'An error occurred while posting the job.',
        });
    }
});
exports.postJob = postJob;
const getJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { status, title } = req.query; // Expecting 'Draft', 'Active', or 'Closed' for status, and a string for title
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Extract user ID from authenticated request
        const jobs = yield job_1.default.findAll({
            where: Object.assign(Object.assign({ creatorId: userId }, (status && { status: { [sequelize_1.Op.eq]: status } })), (title && { title: { [sequelize_1.Op.like]: `%${title}%` } })),
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({
            message: 'Jobs retrieved successfully.',
            data: jobs, // Include a JobResource equivalent if needed
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || 'An error occurred while retrieving jobs.',
        });
    }
});
exports.getJobs = getJobs;
/**
 * Get job details
 * @param req
 * @param res
 */
const getJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Extract user ID from authenticated request
        const job = yield job_1.default.findOne({
            where: {
                id,
                creatorId: userId,
            },
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({
            message: 'Job retrieved successfully.',
            data: job, // Include a JobResource equivalent if needed
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || 'An error occurred while retrieving jobs.',
        });
    }
});
exports.getJob = getJob;
// CLOSE Job
const closeJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = req.query.jobId;
        // Find the job
        const job = yield job_1.default.findByPk(jobId);
        if (!job) {
            res.status(404).json({
                message: 'Job not found in our database.',
            });
            return;
        }
        // Update the job status to 'Closed'
        job.status = 'closed';
        job.updatedAt = new Date();
        yield job.save();
        res.status(200).json({
            message: 'Job closed successfully.',
            data: job, // Replace with a JobResource equivalent if necessary
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || 'An error occurred while closing the job.',
        });
    }
});
exports.closeJob = closeJob;
// DELETE Job
const deleteJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = req.query.jobId;
        // Find the job
        const job = yield job_1.default.findByPk(jobId);
        if (!job) {
            res.status(404).json({
                message: 'Job not found in our database.',
            });
            return;
        }
        if (job.status !== 'draft') {
            res.status(400).json({
                message: 'Only draft jobs can be deleted.',
            });
            return;
        }
        // Delete the job
        yield job.destroy();
        res.status(200).json({
            message: 'Job deleted successfully.',
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || 'An error occurred while deleting the job.',
        });
    }
});
exports.deleteJob = deleteJob;
const getJobApplicants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const jobId = req.query.jobId;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const job = yield job_1.default.findOne({ where: { id: jobId, creatorId: userId } });
        if (!job) {
            res.status(403).json({
                message: "Job doesn't belong to you.",
            });
            return;
        }
        const applicants = yield applicant_1.default.findAll({
            where: { jobId },
            include: [
                {
                    model: user_1.default,
                    as: 'user',
                },
            ],
        });
        res.status(200).json({
            message: 'All applicants retrieved successfully.',
            data: applicants,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: error.message || 'Server error.' });
    }
});
exports.getJobApplicants = getJobApplicants;
const viewApplicant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applicantId = req.query.applicantId;
        const applicant = yield applicant_1.default.findByPk(applicantId, {
            include: [
                {
                    model: user_1.default, // Assuming 'User' is the associated model
                    as: 'user', // Alias for the relationship if defined in the model association
                    attributes: ['id', 'name', 'email', 'photo'], // Select only the fields you need
                },
                {
                    model: job_1.default,
                    as: 'job',
                },
            ],
        });
        if (!applicant) {
            res.status(404).json({
                message: 'Not found in our database.',
            });
            return;
        }
        const job = yield job_1.default.findByPk(applicant.jobId);
        if (!job) {
            res.status(404).json({
                message: 'Job not found.',
            });
            return;
        }
        if (!applicant.view) {
            applicant.view = true;
            yield applicant.save();
            const jobUser = yield user_1.default.findByPk(job.creatorId);
            const applicantUser = yield user_1.default.findByPk(applicant.userId);
            if (!jobUser || !applicantUser) {
                res.status(404).json({
                    message: 'Associated users not found.',
                });
                return;
            }
            const messageToApplicant = messages_1.emailTemplates.notifyApplicant(job, jobUser, applicantUser);
            // Send emails
            yield (0, mail_service_1.sendMail)(jobUser.email, `${process.env.APP_NAME} - Your application for ${job.title} was viewed by ${job.company}`, messageToApplicant);
        }
        res.status(200).json({
            message: 'Applicant retrieved successfully.',
            data: applicant,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});
exports.viewApplicant = viewApplicant;
const repostJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { jobId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Extract user ID from authenticated request
        const job = yield job_1.default.findByPk(jobId);
        if (!job) {
            res.status(404).json({
                message: 'Job not found in our database.',
            });
            return;
        }
        if (!job.title) {
            throw new Error('Job title cannot be null.');
        }
        const repost = yield job_1.default.create({
            creatorId: userId,
            categoryId: job.categoryId,
            title: job.title,
            slug: `${job.title.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(Math.random() * 10000)}`,
            company: job.company,
            logo: job.logo,
            workplaceType: job.workplaceType,
            location: job.location,
            jobType: job.jobType,
            description: job.description,
            skills: job.skills,
            applyLink: job.applyLink,
            applicantCollectionEmailAddress: job.applicantCollectionEmailAddress,
            rejectionEmails: job.rejectionEmails,
            status: 'active',
        });
        res.status(200).json({
            message: 'Job reposted successfully.',
            data: repost,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});
exports.repostJob = repostJob;
const rejectApplicant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { applicantId } = req.body;
        // Find the applicant
        const applicant = yield applicant_1.default.findByPk(applicantId);
        if (!applicant) {
            res.status(404).json({
                message: 'Applicant not found in our database.',
            });
            return;
        }
        // Check if the applicant is already rejected
        if (applicant.status !== 'rejected') {
            // Update the applicant's status
            yield applicant.update({ status: 'rejected' });
            // Find the associated job
            const job = yield job_1.default.findByPk(applicant.jobId);
            if (!job) {
                res.status(404).json({
                    message: 'Job not found in our database.',
                });
                return;
            }
            // Check if rejection emails are enabled for the job
            if (job.rejectionEmails) {
                const user = yield user_1.default.findByPk(applicant.userId);
                const jobPoster = yield user_1.default.findByPk(job.creatorId);
                if (!jobPoster || !user) {
                    res.status(404).json({
                        message: 'Associated users not found.',
                    });
                    return;
                }
                const messageToApplicant = messages_1.emailTemplates.applicantRejection(job, jobPoster, user, applicant);
                // Send emails
                yield (0, mail_service_1.sendMail)(user.email, `${process.env.APP_NAME} - Your application to ${job.title} [${job.jobType}] at ${job.company}`, messageToApplicant);
            }
            res.status(200).json({
                message: 'Rejection successful.',
                data: applicant, // Return the updated applicant data
            });
            return;
        }
        // If already rejected
        res.status(400).json({
            message: 'Applicant is already rejected.',
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.data || 'Server error.',
        });
    }
});
exports.rejectApplicant = rejectApplicant;
const downloadApplicantResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { applicantId } = req.body;
        const applicant = yield applicant_1.default.findByPk(applicantId);
        if (!applicant || !applicant.resume) {
            res.status(404).json({
                message: 'File damaged or not found.',
            });
            return;
        }
        console.log('Resume URL:', applicant.resume);
        const response = yield fetch(applicant.resume);
        if (!response.ok) {
            console.error('Resume Fetch Failed', {
                applicantId,
                resumeUrl: applicant.resume,
                status: response.status,
                statusText: response.statusText,
            });
            if (response.status === 404) {
                res.status(404).json({
                    message: 'Resume file not found. Please update the record.',
                });
            }
            else {
                res.status(500).json({ message: 'Failed to download the resume.' });
            }
            return;
        }
        const fileName = path_1.default.basename(applicant.resume);
        const localPath = path_1.default.join(__dirname, '../storage/resumes', fileName);
        const resumeContent = Buffer.from(yield response.arrayBuffer());
        fs_1.default.writeFileSync(localPath, resumeContent);
        res.download(localPath, fileName, (err) => {
            if (err) {
                logger_1.default.error(err);
            }
            fs_1.default.unlinkSync(localPath); // Delete file after download
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});
exports.downloadApplicantResume = downloadApplicantResume;
//# sourceMappingURL=institutionController.js.map