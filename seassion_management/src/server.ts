import { ApolloServer } from "apollo-server";
import { AppDataSource } from "./dataConnection";
import { Context } from "./types/Context";
import { auth } from "./middlewares/AdminAuthorization";
import {
  // federatedSchema,
  schema,
} from "./schema";

const app = async () => {
  const dbConnection = await AppDataSource.initialize();

  const server = new ApolloServer({
    schema,
    cors: true,
    context: ({ req }: any): Context => {
      const token = req?.headers?.authorization
        ? auth(req.headers.authorization)
        : null;

      return { dbConnection, adminId: token?.adminId };
    },
  });

  server.listen(8001).then(({ url }: any) => {
    console.log("listening on " + url);
  });

  // server.graphqlPath = "/graph";
};

app();
