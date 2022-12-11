import { authResolvers } from "./auth";
import { postResolvers } from "./post";
authResolvers;

export const Mutation = {
  ...postResolvers,
  ...authResolvers,
};
