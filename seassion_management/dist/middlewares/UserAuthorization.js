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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const password_token_1 = require("../tokens/password.token");
const auth = (header) => {
    try {
        if (!header) {
            throw new Error("Authorization header is missing");
        }
        const tokenParts = header.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            throw new Error("Invalid authorization header format");
        }
        const token = tokenParts[1];
        if (!token) {
            throw new Error("Token is missing");
        }
        return jwt.verify(token, password_token_1.TOKEN_PASSWORD);
    }
    catch (error) {
        console.error("Authentication error:", error.message);
        throw new Error("Invalid token");
    }
};
exports.auth = auth;
//# sourceMappingURL=UserAuthorization.js.map