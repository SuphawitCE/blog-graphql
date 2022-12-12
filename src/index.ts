import { ApolloServer } from "apollo-server";
import { typeDefs } from "./models/schema";
import { Query, Mutation, Profile, Post, User } from "./resolvers";
import { PrismaClient, Prisma } from "@prisma/client";
import { getUserFromToken } from "./utils/getUserFromToken";

export const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  userInfo: {
    userId: number;
  } | null;
}

const apolloServerPayload = {
  typeDefs,
  resolvers: { Query, Mutation, Profile, Post, User },
  context: async ({ req }: any): Promise<Context> => {
    const userinfo = await getUserFromToken(req.headers.authorization);
    return { prisma, userinfo };
  },
};

const server = new ApolloServer(apolloServerPayload);

// Run application
server.listen().then(({ url }) => {
  console.log(`Server running on ${url}`);
});
