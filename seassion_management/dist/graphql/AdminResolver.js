"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMutation = exports.AdminQuery = exports.AdminDefType = void 0;
const nexus_1 = require("nexus");
const Admin_1 = require("../entities/Admin");
exports.AdminDefType = (0, nexus_1.objectType)({
    name: "Admin",
    definition(t) {
        t.nonNull.int("id"), t.nonNull.string("username");
    },
});
exports.AdminQuery = (0, nexus_1.extendType)({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("Admins", {
            type: "Admin",
            resolve(_parent, _args, context, _info) {
                const { dbConnection } = context;
                return dbConnection.query(`SELECT * FROM public."admin";`);
            },
        });
        t.field("findAdmin", {
            type: "Admin",
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
            },
            resolve: async (_parent, { id }, context) => {
                const { adminId } = context;
                if (!adminId) {
                    throw new Error("Can't find Admin without logging in first");
                }
                const admin = await Admin_1.Admin.findOne({
                    where: { id },
                });
                if (!admin) {
                    throw new Error(`Admin with ID ${id} not found`);
                }
                return admin;
            },
        });
    },
});
exports.AdminMutation = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("updateAdmin", {
            type: "Admin",
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
                username: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve: async (_parent, args, _context) => {
                const { id, username } = args;
                const admin = await Admin_1.Admin.findOne({ where: { id } });
                if (!admin) {
                    throw new Error("Admin not found");
                }
                admin.username = username;
                await admin.save();
                return admin;
            },
        });
        t.nonNull.field("deleteAdmin", {
            type: "String",
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
            },
            resolve: async (_parent, args, _context) => {
                const { id } = args;
                const admin = await Admin_1.Admin.findOne({ where: { id } });
                if (!admin) {
                    throw new Error("Admin not found");
                }
                await admin.remove();
                return `Admin with ID ${id} has been successfully deleted.`;
            },
        });
        t.nonNull.field("createAdmin", {
            type: "Admin",
            args: {
                username: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve: async (_parent, args, _context) => {
                const { username, password } = args;
                const admin = Admin_1.Admin.create({
                    username,
                    password,
                });
                await admin.save();
                return admin;
            },
        });
    },
});
//# sourceMappingURL=AdminResolver.js.map