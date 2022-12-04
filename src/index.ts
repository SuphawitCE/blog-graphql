import { ApolloServer } from "apollo-server";
import { typeDefs } from "./models/schema";
import { Query } from "./resolvers";

const apolloServerPayload = {
  typeDefs,
  resolvers: { Query },
};

const server = new ApolloServer(apolloServerPayload);

// Run application
server.listen().then(({ url }) => {
  console.log(`Server running on ${url}`);
});
