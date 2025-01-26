const { GraphQLObjectType, GraphQLString } = require("graphql");

const ResponseType = new GraphQLObjectType({
  name: "ResponseType",
  fields: {
    code: { type: GraphQLString },
    status: { type: GraphQLString },
    message: { type: GraphQLString },
  },
});

module.exports = ResponseType;
