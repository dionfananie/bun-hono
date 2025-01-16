import { Hono } from "hono";
import { type RootResolver, graphqlServer } from "@hono/graphql-server";
import { buildSchema } from "graphql";

export const appGqlServer = new Hono();
const schema = buildSchema(`
  type Query {
    hello: String
  }
  `);

const rootResolver: RootResolver = (c) => {
  return {
    hello: () => "Hello Hono!",
  };
};

appGqlServer.use(
  "/graphql",
  graphqlServer({
    schema,
    rootResolver,
    graphiql: true, // if `true`, presents GraphiQL when the GraphQL endpoint is loaded in a browser.
  })
);
