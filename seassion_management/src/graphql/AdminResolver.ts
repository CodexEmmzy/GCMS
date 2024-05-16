import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import { Admin } from "../entities/Admin";
import { Context } from "../types/Context";

export const AdminDefType = objectType({
  name: "Admin",
  definition(t) {
    t.nonNull.int("id"), t.nonNull.string("username");
  },
});

export const AdminQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("Admins", {
      type: "Admin",
      resolve(_parent, _args, context: Context, _info): Promise<Admin[]> {
        const { dbConnection } = context;
        return dbConnection.query(`SELECT * FROM public."admin";`);
      },
    });

    t.field("findAdmin", {
      type: "Admin",
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (
        _parent,
        { id },
        context: Context
      ): Promise<Admin | null> => {
        const { adminId } = context;

        if (!adminId) {
          throw new Error("Can't find Admin without logging in first");
        }

        const admin = await Admin.findOne({
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

export const AdminMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateAdmin", {
      type: "Admin",
      args: {
        id: nonNull(intArg()),
        username: nonNull(stringArg()),
      },
      resolve: async (_parent, args, _context: Context): Promise<Admin> => {
        const { id, username } = args;

        const admin = await Admin.findOne({ where: { id } });

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
        id: nonNull(intArg()),
      },
      resolve: async (_parent, args, _context: Context): Promise<String> => {
        const { id } = args;

        const admin = await Admin.findOne({ where: { id } });

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
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, args, _context: Context): Promise<Admin> => {
        const {  username, password } = args;

        const admin = Admin.create({
          username,
          password,
        });

        await admin.save();

        return admin;
      },
    });
  },
});
