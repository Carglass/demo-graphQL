const { ApolloServer } = require("apollo-server");
const { connect } = require("mongoose");

const typeDefs = require("./src/schema");
const createStore = require("./src/mongo");
const MongoAPI = require("./src/datasources/Mongo");

const store = createStore();

const dataSources = () => ({
  mongoAPI: new MongoAPI({ store })
});

const server = new ApolloServer({ typeDefs, dataSources });

connect("mongodb://localhost/demo-graphql").then(() => {
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
});
