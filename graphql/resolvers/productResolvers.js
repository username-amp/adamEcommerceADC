const { GraphQLString, GraphQLNonNull, GraphQLObjectType } = require("graphql");
const Product = require("../../models/Product");
const ProductType = require(`../types/ProductType`);
const ResponseType = require(`../types/ResponseType`);

/* ----- Resolver for Display Product ----- */
const displayProduct = {
  type: ResponseType,
  resolve: async () => {
    try {
      const products = await Product.find();

      if (products.length === 0) {
        return {
          code: 204,
          status: false,
          message: "No Product found",
        };
      }

      return {
        code: 200,
        status: true,
        message: JSON.stringify(products),
      };
    } catch (error) {
      return {
        code: 500,
        status: false,
        message: ("Internal server error", error.message),
      };
    }
  },
};

module.exports = { displayProduct };
