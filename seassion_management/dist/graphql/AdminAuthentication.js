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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMutataion = exports.AuthType = void 0;
const nexus_1 = require("nexus");
const bcrypt = require("bcrypt");
const jwt = __importStar(require("jsonwebtoken"));
const Admin_1 = require("../entities/Admin");
const dotenv_1 = __importDefault(require("dotenv"));
const password_token_1 = require("../tokens/password.token");
const constant_1 = require("../utils/constant");
dotenv_1.default.config();
exports.AuthType = (0, nexus_1.objectType)({
    name: "AuthType",
    definition(t) {
        t.nonNull.field("admin", {
            type: "Admin",
        }),
            t.nonNull.string("token");
    },
});
exports.AuthMutataion = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("register", {
            type: "AuthType",
            args: {
                username: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            async resolve(_parent, args, context, _info) {
                const { username, password } = args;
                const existingAdmin = await Admin_1.Admin.findOne({ where: { username } });
                if (existingAdmin) {
                    throw new Error("username is already in use");
                }
                const hashedPassword = await bcrypt.hash(password, constant_1.saltRound);
                let admin;
                let token;
                try {
                    const result = await context.dbConnection
                        .createQueryBuilder()
                        .insert()
                        .into(Admin_1.Admin)
                        .values({
                        username,
                        password: hashedPassword,
                    })
                        .returning("*")
                        .execute();
                    admin = result.raw[0];
                    token = jwt.sign({
                        adminId: admin.id,
                    }, password_token_1.TOKEN_PASSWORD);
                }
                catch (err) {
                    console.log(err);
                }
                return {
                    admin,
                    token,
                };
            },
        });
        t.nonNull.field("login", {
            type: "AuthType",
            args: {
                username: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            async resolve(_parent, args, _context, _info) {
                const { username, password } = args;
                const admin = await Admin_1.Admin.findOne({ where: { username } });
                if (!admin) {
                    throw new Error("Admin not found");
                }
                const isPasswordValid = await bcrypt.compare(password, admin.password);
                if (!isPasswordValid) {
                    throw new Error("Invaild Credentails");
                }
                const token = jwt.sign({ adminId: admin.id }, password_token_1.TOKEN_PASSWORD);
                return {
                    admin,
                    token,
                };
            },
        });
    },
});
//# sourceMappingURL=AdminAuthentication.js.map