const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
} = require(`graphql`);
const User = require("../../models/User");

const TestimonialType = new GraphQLObjectType({
  name: `Testimonial`,
  fields: {
    username: { type: GraphQLString },
    location: { type: GraphQLString },
    created_at: { type: GraphQLString },
    testimonial: { type: GraphQLString },
  },
});

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
    // new fields
    hasWarranty: { type: GraphQLBoolean },
    warrantyType: { type: GraphQLString },
    warrantyDuration: { type: GraphQLString },
    shipsFrom: { type: GraphQLString },
  },
});

module.exports = ProductType;
