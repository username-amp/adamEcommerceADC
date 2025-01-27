const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
} = require(`graphql`);

const ProductType = new GraphQLObjectType({
  name: `Product`,
  fields: {
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    category: { type: GraphQLString },
    price: { type: GraphQLFloat },
    solds: { type: GraphQLInt },
    images: { type: new GraphQLList(GraphQLString) },
    stock: { type: GraphQLInt },
    ratings: { type: GraphQLFloat },
    tags: { type: new GraphQLList(GraphQLString) },
  },
});

module.exports = ProductType;
