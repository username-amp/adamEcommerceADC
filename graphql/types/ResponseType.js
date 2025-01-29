const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");
const ProductType = require(`./ProductType`);

const ResponseType = new GraphQLObjectType({
  name: "Response",
  fields: {
    code: { type: GraphQLString },
    status: { type: GraphQLString },
    message: { type: GraphQLString },
    data: { type: new GraphQLList(ProductType) }, // Ensure this is always an array
  },
});

module.exports = ResponseType;
