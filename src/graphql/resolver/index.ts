import { UserResolver } from "./user-resolver";
import { mergeResolvers } from "@graphql-tools/merge";

export const resolvers = mergeResolvers([UserResolver]);
