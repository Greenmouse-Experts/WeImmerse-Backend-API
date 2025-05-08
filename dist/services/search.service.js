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
const sequelize_1 = require("sequelize");
const course_1 = __importDefault(require("../models/course"));
const digitalasset_1 = __importDefault(require("../models/digitalasset"));
const user_1 = __importDefault(require("../models/user"));
const physicalasset_1 = __importDefault(require("../models/physicalasset"));
class SearchService {
    searchRecentItems(searchKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const searchOptions = {
                    where: {
                        [sequelize_1.Op.or]: [
                            { description: { [sequelize_1.Op.like]: `%${searchKey}%` } },
                            { assetDetails: { [sequelize_1.Op.like]: `%${searchKey}%` } },
                        ],
                    },
                    limit: 10,
                    order: [['createdAt', 'DESC']],
                };
                const [courses, digitalAssets, physicalAssets] = yield Promise.all([
                    course_1.default.findAll(Object.assign(Object.assign({}, searchOptions), { where: Object.assign({ 
                            // ...searchOptions.where,
                            status: 'live', published: true }, (searchKey && { title: { [sequelize_1.Op.like]: `%${searchKey}%` } })), include: [
                            {
                                model: user_1.default,
                                as: 'creator',
                                attributes: ['id', 'name', 'email', 'photo'], // Only include necessary user fields
                            },
                        ] })),
                    digitalasset_1.default.findAll(Object.assign(Object.assign({}, searchOptions), { where: Object.assign(Object.assign({ 
                            // ...searchOptions.where,
                            status: 'published', isPublished: true }, (searchKey && { assetName: { [sequelize_1.Op.like]: `%${searchKey}%` } })), (searchKey && {
                            specificationTags: { [sequelize_1.Op.contains]: [searchKey] },
                        })), include: [
                            {
                                model: user_1.default,
                                as: 'user',
                                attributes: ['id', 'name', 'email', 'photo'], // Only include necessary user fields
                            },
                        ] })),
                    physicalasset_1.default.findAll(Object.assign(Object.assign({}, searchOptions), { where: Object.assign(Object.assign({ 
                            // ...searchOptions.where,
                            status: 'published', isPublished: true }, (searchKey && { assetName: { [sequelize_1.Op.like]: `%${searchKey}%` } })), (searchKey && {
                            specificationTags: { [sequelize_1.Op.contains]: [searchKey] },
                        })), include: [
                            {
                                model: user_1.default,
                                as: 'user',
                                attributes: ['id', 'name', 'email', 'photo'], // Only include necessary user fields
                            },
                        ] })),
                ]);
                return {
                    success: true,
                    data: {
                        courses,
                        digitalAssets,
                        physicalAssets,
                    },
                };
            }
            catch (error) {
                console.error('Search error:', error);
                return {
                    success: false,
                    message: 'An error occurred during search',
                };
            }
        });
    }
    searchAllRecentItems(searchKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.searchRecentItems(searchKey);
                if (!result.success)
                    return result;
                // Combine and sort all results by createdAt date
                const allItems = [
                    ...result.data.courses.map((c) => (Object.assign(Object.assign({}, c.get()), { type: 'course' }))),
                    ...result.data.digitalAssets.map((da) => (Object.assign(Object.assign({}, da.get()), { type: 'digitalAsset' }))),
                    ...result.data.physicalAssets.map((pa) => (Object.assign(Object.assign({}, pa.get()), { type: 'physicalAsset' }))),
                ]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 10);
                return {
                    success: true,
                    data: allItems,
                };
            }
            catch (error) {
                console.error('Combined search error:', error);
                return {
                    success: false,
                    message: 'An error occurred during combined search',
                };
            }
        });
    }
}
exports.default = new SearchService();
//# sourceMappingURL=search.service.js.map