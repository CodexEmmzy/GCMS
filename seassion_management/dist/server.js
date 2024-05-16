"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const dataConnection_1 = require("./dataConnection");
const AdminAuthorization_1 = require("./middlewares/AdminAuthorization");
const schema_1 = require("./schema");
const app = async () => {
    const dbConnection = await dataConnection_1.AppDataSource.initialize();
    const server = new apollo_server_1.ApolloServer({
        schema: schema_1.schema,
        cors: true,
        context: ({ req }) => {
            var _a;
            const token = ((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization)
                ? (0, AdminAuthorization_1.auth)(req.headers.authorization)
                : null;
            return { dbConnection, adminId: token === null || token === void 0 ? void 0 : token.adminId };
        },
    });
    server.listen(8001).then(({ url }) => {
        console.log("listening on " + url);
    });
};
app();
//# sourceMappingURL=server.js.map