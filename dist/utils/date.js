"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateEndDate = calculateEndDate;
exports.daysUntilExpiry = daysUntilExpiry;
function calculateEndDate(startDate, durationDays) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);
    return endDate;
}
function daysUntilExpiry(endDate) {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
//# sourceMappingURL=date.js.map