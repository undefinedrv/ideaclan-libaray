const  { ApolloServer } = require("apollo-server-express");

require("dotenv").config({ path: "./.env" });
const { app } = require("./app");
const { ConnectToDB } = require("./src/config/db");
const typeDefs = require("./src/graphql/typeDefs")
const resolvers = require("./src/graphql/resolvers");
const { authentication } = require("./src/middleware/authentication.middleware");

const PORT = process.env.PORT || 9090;


const server = new ApolloServer({
  typeDefs,
  resolvers,

  context: async ({ req, res }) => {

    if(req.headers?.authorization?.split(" ")[1]){
      const user = await authentication(req, res);
      return { req, res, user};
    }

    return { req, res };
  },
  playground: true,
  introspection: true,
})

ConnectToDB()
  .then(async () => {
    await server.start();
    server.applyMiddleware({ app });
    app.listen(PORT, () => {
      console.log(`Server is live on port no. ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Mongo DB Connection Failed", error);
  });
