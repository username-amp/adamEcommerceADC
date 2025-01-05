const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require(`graphql`)
const { signup, signin } = require(`./resolvers/userResolvers`)

// Empty Query type (required for a valid GraphQL schema)
const RootQuery = new GraphQLObjectType({
    name: `RootQueryType`,
    fields: {
        hello: {
            type: GraphQLString,
            resolve: () => `Welcome to the api`
        },
    },
})

// Root Mutation (signup and signin)
const Mutation = new GraphQLObjectType({
    name: `Mutation`,
    fields: {
        signup,
        signin,
    }
})


// Combite into a sigle schema
const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
})

module.exports = schema