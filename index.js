const { ApolloServer } = require("apollo-server");
const { connect } = require("mongoose");

const typeDefs = require("./src/schema");
const createStore = require("./src/mongo");
const MongoAPI = require("./src/datasources/Mongo");
const resolvers = require("./src/resolvers");

const store = createStore();

const dataSources = () => ({
  mongoAPI: new MongoAPI({ store })
});

const server = new ApolloServer({ typeDefs, dataSources, resolvers });

connect("mongodb://localhost/demo-graphql").then(() => {
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
});
