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

const server = new ApolloServer({
  typeDefs,
  dataSources,
  resolvers,
  // GIFLENS-https://media1.giphy.com/media/zI19V0pvL7VbzQymhm/200.gif
  introspection: true,
  playground: true
});

connect(process.env.MONGODB_URI || "mongodb://localhost/demo-graphql").then(
  () => {
    server
      .listen(process.env.PORT || 4000, process.env.HOST || null)
      .then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
      });
  }
);
