const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require(`graphql`);
const {
  signup,
  signin,
  verifyCode,
  confirmCode,
  resetPasswordRequest,
  resetPassword,
  getUsernameByEmail,
  googleSignin,
  facebookSignin,
} = require(`./resolvers/userResolvers`);

// Empty Query type (required for a valid GraphQL schema)
const RootQuery = new GraphQLObjectType({
  name: `RootQueryType`,
  fields: {
    getUsernameByEmail,
  },
});

// Root Mutation (signup, signin, verifyCode, confirmCode, resetPasswordRequest, resetPassword, googleSignin, facebookSignin)
const Mutation = new GraphQLObjectType({
  name: `Mutation`,
  fields: {
    signup,
    signin,
    verifyCode,
    confirmCode,
    resetPasswordRequest,
    resetPassword,
    googleSignin,
    facebookSignin,
  },
});

// Combite into a sigle schema
const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

module.exports = schema;
