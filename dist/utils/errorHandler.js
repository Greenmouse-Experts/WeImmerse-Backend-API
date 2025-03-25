"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = handleError;
const errors_1 = require("../errors");
function handleError(res, error) {
    if (error instanceof errors_1.NotFoundError) {
        return res.status(404).json({ message: error.message });
    }
    if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
}
//# sourceMappingURL=errorHandler.js.map