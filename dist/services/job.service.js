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
// src/services/jobService.ts
const job_1 = __importDefault(require("../models/job"));
const user_1 = __importDefault(require("../models/user"));
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
}
exports.default = new JobService();
//# sourceMappingURL=job.service.js.map