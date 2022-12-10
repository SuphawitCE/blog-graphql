import { ApolloServer } from "apollo-server";
import { typeDefs } from "./models/schema";
import { Query } from "./resolvers";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
}

const apolloServerPayload = {
  typeDefs,
  resolvers: { Query },
  context: {
    prisma,
  },
};

const server = new ApolloServer(apolloServerPayload);

// Run application
server.listen().then(({ url }) => {
  console.log(`Server running on ${url}`);
});
