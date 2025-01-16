import { mergeTypeDefs } from "@graphql-tools/merge";
import { userGqlSchema } from "./user-schema";

export const typeDefs = mergeTypeDefs([userGqlSchema]);
