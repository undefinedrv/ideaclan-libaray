const  { ApolloServer } = require("apollo-server-express");

require("dotenv").config({ path: "./.env" });
const { app } = require("./app");
const { ConnectToDB } = require("./config/db");
const typeDefs = require("./graphql/typeDefs")
const resolvers = require("./graphql/resolvers");
const { authentication } = require("./middleware/authentication.middleware");

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
