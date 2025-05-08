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
const search_service_1 = __importDefault(require("../services/search.service"));
const job_service_1 = __importDefault(require("../services/job.service"));
class SearchController {
    searchItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { q: searchKey } = req.query;
            if (!searchKey ||
                typeof searchKey !== 'string' ||
                searchKey.trim() === '') {
                return res.status(200).json({
                    success: true,
                    data: {
                        courses: [],
                        digitalAssets: [],
                        physicalAssets: [],
                    },
                });
            }
            const result = yield search_service_1.default.searchRecentItems(searchKey);
            if (!result.success) {
                return res.status(500).json(result);
            }
            res.status(200).json(result);
        });
    }
    searchAllItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { q: searchKey } = req.query;
            if (!searchKey ||
                typeof searchKey !== 'string' ||
                searchKey.trim() === '') {
                return res.status(200).json({
                    success: true,
                    data: [],
                });
            }
            const result = yield search_service_1.default.searchAllRecentItems(searchKey);
            if (!result.success) {
                return res.status(500).json(result);
            }
            res.status(200).json(result);
        });
    }
    searchJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { q: searchKey = '', location, jobType, workplaceType, categoryId, page = 1, limit = 10, } = req.query;
            const result = yield job_service_1.default.searchJobs(searchKey, {
                location: location,
                jobType: jobType,
                workplaceType: workplaceType,
                categoryId: categoryId,
                page: Number(page),
                limit: Number(limit),
            });
            if (!result.success) {
                return res.status(500).json(result);
            }
            res.status(200).json(result);
        });
    }
}
exports.default = new SearchController();
//# sourceMappingURL=searchController.js.map