"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMutation = exports.UserQuery = exports.UserDefType = void 0;
const nexus_1 = require("nexus");
const User_1 = require("../entities/User");
exports.UserDefType = (0, nexus_1.objectType)({
    name: "User",
    definition(t) {
        t.nonNull.int("id"),
            t.nonNull.string("name"),
            t.nonNull.string("email"),
            t.string("phone"),
            t.nonNull.string("city");
    },
});
exports.UserQuery = (0, nexus_1.extendType)({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("users", {
            type: "User",
            resolve(_parent, _args, context, _info) {
                const { dbConnection } = context;
                return dbConnection.query(`SELECT * FROM public."user";`);
            },
        });
        t.field("findUser", {
            type: "User",
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
            },
            resolve: async (_parent, { id }, context) => {
                const { userId } = context;
                if (!userId) {
                    throw new Error("Can't find user without logging in first");
                }
                const user = await User_1.User.findOne({
                    where: { id },
                });
                if (!user) {
                    throw new Error(`User with ID ${id} not found`);
                }
                return user;
            },
        });
    },
});
exports.UserMutation = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("updateUser", {
            type: "User",
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
                name: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                city: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                phone: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve: async (_parent, args, _context) => {
                const { id, name, email, city, phone } = args;
                const user = await User_1.User.findOne({ where: { id } });
                if (!user) {
                    throw new Error("User not found");
                }
                user.name = name;
                user.email = email;
                user.phone = phone;
                user.city = city;
                await user.save();
                return user;
            },
        });
        t.nonNull.field("deleteUser", {
            type: "String",
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
            },
            resolve: async (_parent, args, _context) => {
                const { id } = args;
                const user = await User_1.User.findOne({ where: { id } });
                if (!user) {
                    throw new Error("User not found");
                }
                await user.remove();
                return `User with ID ${id} has been successfully deleted.`;
            },
        });
        t.nonNull.field("createUser", {
            type: "User",
            args: {
                name: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                city: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                phone: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                permissions: (0, nexus_1.nonNull)((0, nexus_1.stringArg)({ default: "user" })),
            },
            resolve: async (_parent, args, _context) => {
                var _a;
                const { name, email, password, city, phone, permissions } = args;
                if (permissions !== "user" &&
                    ((_a = _context.user) === null || _a === void 0 ? void 0 : _a.permissions) !== "super_admin") {
                    throw new Error("Insufficient permissions");
                }
                const user = User_1.User.create({
                    name,
                    email,
                    password,
                    city,
                    phone,
                    permissions,
                });
                await user.save();
                return user;
            },
        });
    },
});
//# sourceMappingURL=UserResolver.js.map