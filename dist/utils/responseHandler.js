"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, statusCode, data, message, errors) => {
    const response = {
        success: statusCode >= 200 && statusCode < 300,
    };
    if (data)
        response.data = data;
    if (message)
        response.message = message;
    if (errors)
        response.errors = errors;
    res.status(statusCode).json(response);
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=responseHandler.js.map