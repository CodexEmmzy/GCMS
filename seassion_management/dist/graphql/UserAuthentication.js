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
const bcrypt = require('bcrypt');
const jwt = __importStar(require("jsonwebtoken"));
const User_1 = require("../entities/User");
const dotenv_1 = __importDefault(require("dotenv"));
const password_token_1 = require("../tokens/password.token");
const constants_1 = require("../utils/constants");
dotenv_1.default.config();
exports.AuthType = (0, nexus_1.objectType)({
    name: "AuthType",
    definition(t) {
        t.nonNull.field("user", {
            type: "User",
        }),
            t.nonNull.string("token");
    },
});
exports.AuthMutataion = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("login", {
            type: "AuthType",
            args: {
                name: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            async resolve(_parent, args, _context, _info) {
                const { name, password } = args;
                const user = await User_1.User.findOne({ where: { name } });
                if (!user) {
                    throw new Error("user not found");
                }
                const isPasswordValid = await bcrypt.compare(user.password, password);
                if (!isPasswordValid) {
                    throw new Error("Invaild Credentails");
                }
                const token = jwt.sign({ userId: user.id }, password_token_1.TOKEN_PASSWORD);
                return {
                    user,
                    token,
                };
            },
        });
        t.nonNull.field("register", {
            type: "AuthType",
            args: {
                name: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                city: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            async resolve(_parent, args, context, _info) {
                const { name, email, password, city } = args;
                const hashedPassword = await bcrypt.hash(password, constants_1.saltRound);
                let user;
                let token;
                try {
                    const result = await context.dbConnection
                        .createQueryBuilder()
                        .insert()
                        .into(User_1.User)
                        .values({
                        name,
                        email,
                        password: hashedPassword,
                        city: city,
                    })
                        .returning("*")
                        .execute();
                    user = result.raw[0];
                    token = jwt.sign({
                        userId: user.id,
                    }, password_token_1.TOKEN_PASSWORD);
                }
                catch (err) {
                    console.log(err);
                }
                return {
                    user,
                    token,
                };
            },
        });
    },
});
//# sourceMappingURL=UserAuthentication.js.map