const { GraphQLString, GraphQLObjectType } = require(`graphql`);

const ProductType = new GraphQLObjectType({
  name: `Product`,
  fields: {
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    category: { type: GraphQLString },
    price: { type: GraphQLString },
    solds: { type: GraphQLString },
    images: { type: GraphQLString },
    stock: { type: GraphQLString },
    rating: { type: GraphQLString },
    tags: { type: GraphQLString },
  },
});

module.exports = ProductType;
