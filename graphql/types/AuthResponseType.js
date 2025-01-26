const { GraphQLObjectType, GraphQLString } = require("graphql");

const AuthResponseType = new GraphQLObjectType({
  name: "AuthResponseType",
  fields: {
    message: { type: GraphQLString },
    token: { type: GraphQLString },
  },
});

module.exports = AuthResponseType;
