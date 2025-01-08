const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require(`graphql`);
const {
  signup,
  signin,
  verifyCode,
  confirmCode,
  resetPasswordRequest,
  resetPassword,
} = require(`./resolvers/userResolvers`);

// Empty Query type (required for a valid GraphQL schema)
const RootQuery = new GraphQLObjectType({
  name: `RootQueryType`,
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => `Welcome to the api`,
    },
  },
});

// Root Mutation (signup, signin, verifyCode, confirmCode, resetPasswordRequest, resetPassword)
const Mutation = new GraphQLObjectType({
  name: `Mutation`,
  fields: {
    signup,
    signin,
    verifyCode,
    confirmCode,
    resetPasswordRequest,
    resetPassword,
  },
});

// Combite into a sigle schema
const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

module.exports = schema;
