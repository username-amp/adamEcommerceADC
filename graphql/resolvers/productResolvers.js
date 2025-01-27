const { GraphQLString } = require("graphql");
const Product = require("../../models/Product");
const ResponseType = require(`../types/ResponseType`);

/* ----- Resolver for Display Product ----- */
const displayProduct = {
  type: ResponseType,
  args: {
    _id: { type: GraphQLString },
    category: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    try {
      let products;

      if (args._id) {
        // Fetch specific product by its _id
        products = await Product.findById(args._id);
        if (!products) {
          return {
            code: "404",
            status: "false",
            message: "Product not found",
          };
        }
        return {
          code: "200",
          status: "true",
          message: "Product fetched successfully",
          data: [products],
        };
      } else if (args.category) {
        // Fetch products by category
        products = await Product.find({ category: args.category });
        if (products.length === 0) {
          return {
            code: "204",
            status: "false",
            message: "No products found for this category",
          };
        }
      } else {
        // Fetch all products if no filters are provided
        products = await Product.find();
        if (products.length === 0) {
          return {
            code: "204",
            status: "false",
            message: "No products found",
          };
        }
      }

      return {
        code: "200",
        status: "true",
        message: "Products fetched successfully",
        data: products,
      };
    } catch (error) {
      return {
        code: "500",
        status: "false",
        message: `Internal server error: ${error.message}`,
      };
    }
  },
};

module.exports = { displayProduct };
