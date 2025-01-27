const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");
const ProductType = require(`./ProductType`)

const ResponseType = new GraphQLObjectType({
  name: "ResponseType",
  fields: {
    code: { type: GraphQLString },
    status: { type: GraphQLString },
    message: { type: GraphQLString },
    data: { type: new GraphQLList(ProductType) },
  },
});

module.exports = ResponseType;
