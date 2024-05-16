import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Context } from "../types/Context";
const bcrypt = require("bcrypt");
import * as jwt from "jsonwebtoken";
import { Admin } from "../entities/Admin";
import dotenv from "dotenv";
import { TOKEN_PASSWORD } from "../tokens/password.token";
import { saltRound } from "../utils/constant";

dotenv.config();

export const AuthType = objectType({
  name: "AuthType",
  definition(t) {
    t.nonNull.field("admin", {
      type: "Admin",
    }),
      t.nonNull.string("token");
  },
});

export const AuthMutataion = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("register", {
      type: "AuthType",
      args: {
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, args, context: Context, _info) {
        const { username, password } = args;

        const existingAdmin = await Admin.findOne({ where: { username } });
        if (existingAdmin) {
          throw new Error("username is already in use");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRound);

        // Insert the new admin record into the database
        let admin;
        let token;
        try {
          const result = await context.dbConnection
            .createQueryBuilder()
            .insert()
            .into(Admin)
            .values({
              username,
              password: hashedPassword,
            })
            .returning("*")
            .execute();

          admin = result.raw[0];
          token = jwt.sign(
            {
              adminId: admin.id,
            },
            TOKEN_PASSWORD as jwt.Secret
          );
        } catch (err) {
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
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, args, _context: Context, _info) {
        const { username, password } = args;

        const admin = await Admin.findOne({ where: { username } });

        if (!admin) {
          throw new Error("Admin not found");
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
          throw new Error("Invaild Credentails");
        }

        const token = jwt.sign(
          { adminId: admin.id },
          TOKEN_PASSWORD as jwt.Secret
        );

        return {
          admin,
          token,
        };
      },
    });
  },
});

        // Check if an admin with the same username already exists