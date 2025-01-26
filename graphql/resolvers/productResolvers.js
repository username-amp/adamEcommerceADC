const { GraphQLString, GraphQLNonNull, GraphQLObjectType } = require("graphql");
const Product = require("../../models/Product");

// Product Type that represents the product model
const ProductType = new GraphQLObjectType({
  name: "Product",
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

