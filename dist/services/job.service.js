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
// src/services/jobService.ts
const sequelize_1 = require("sequelize");
const job_1 = __importStar(require("../models/job"));
const user_1 = __importDefault(require("../models/user"));
const jobcategory_1 = __importDefault(require("../models/jobcategory"));
class JobService {
    getAllJobs() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield job_1.default.findAll();
                return jobs;
            }
            catch (error) {
                throw new Error('Failed to retrieve jobs');
            }
        });
    }
    vetJobPost(jobId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job = (yield job_1.default.findOne({
                    where: { id: jobId },
                    include: [{ model: user_1.default, as: 'user' }],
                }));
                if (!job) {
                    throw new Error('Job not found');
                }
                job.status = status;
                yield job.save();
                return job;
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to vet job post');
            }
        });
    }
    searchJobs(searchKey_1) {
        return __awaiter(this, arguments, void 0, function* (searchKey, filters = {}) {
            try {
                const { location = '', jobType = '', workplaceType = '', categoryId = '', status = job_1.JobStatus.ACTIVE, limit = 10, page = 1, } = filters;
                const offset = (page - 1) * limit;
                const whereClause = Object.assign(Object.assign({}, (searchKey && {
                    [sequelize_1.Op.or]: [
                        { title: { [sequelize_1.Op.like]: `%${searchKey}%` } },
                        { company: { [sequelize_1.Op.like]: `%${searchKey}%` } },
                        { description: { [sequelize_1.Op.like]: `%${searchKey}%` } },
                        { skills: { [sequelize_1.Op.like]: `%${searchKey}%` } },
                    ],
                })), { status, isPublished: true });
                // Add optional filters
                if (location)
                    whereClause.location = { [sequelize_1.Op.like]: `%${location}%` };
                if (jobType)
                    whereClause.jobType = jobType;
                if (workplaceType)
                    whereClause.workplaceType = workplaceType;
                if (categoryId)
                    whereClause.categoryId = categoryId;
                const { count, rows: jobs } = yield job_1.default.findAndCountAll({
                    where: whereClause,
                    limit,
                    offset,
                    order: [['createdAt', 'DESC']],
                    include: [
                        {
                            model: user_1.default,
                            as: 'user',
                            attributes: ['id', 'name', 'email'],
                        },
                        {
                            model: jobcategory_1.default,
                            as: 'category',
                            attributes: ['id', 'name'],
                        },
                    ],
                });
                return {
                    success: true,
                    data: {
                        jobs,
                        pagination: {
                            total: count,
                            page,
                            pages: Math.ceil(count / limit),
                            limit,
                        },
                    },
                };
            }
            catch (error) {
                console.error('Job search error:', error);
                return {
                    success: false,
                    message: 'An error occurred while searching for jobs',
                };
            }
        });
    }
}
exports.default = new JobService();
//# sourceMappingURL=job.service.js.map