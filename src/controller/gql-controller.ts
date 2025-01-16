import { Hono } from "hono";
import { graphqlServer } from "@hono/graphql-server";
import { typeDefs } from "../graphql/schema";
import { resolvers } from "../graphql/resolver";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { authMiddleware } from "../middleware/auth-middleware";

export const appGqlServer = new Hono();
appGqlServer.use(authMiddleware);
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

appGqlServer.use(
  "/graphql",
  graphqlServer({
    schema,
    graphiql: true, // if `true`, presents GraphiQL when the GraphQL endpoint is loaded in a browser.
  })
);
