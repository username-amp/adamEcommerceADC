const { GraphQLString, GraphQLNonNull, GraphQLObjectType } = require(`graphql`);
const bcrypt = require(`bcryptjs`);
const User = require(`../../models/User`);
const hashPassword = require(`../../utils/hashPassword`);
const generateToken = require(`../../utils/generateToken`);

// Define a custom type for responses
const AuthResponseType = new GraphQLObjectType({
  name: `AuthResponseType`,
  fields: {
    message: { type: GraphQLString },
    token: { type: GraphQLString },
  },
});

// Resolver for Signup
const signup = {
  type: AuthResponseType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    role: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: new GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
  },

  async resolve(parent, args) {
    try {
      // Check if email already exists
      console.log("Signup args received:", args);
      const existingUser = await User.findOne({ email: args.email });
      if (existingUser) {
        throw new Error(`Email already registered`);
      }

      // Hash Password
      const hashedPassword = await hashPassword(args.password);
      console.log("Password hashed successfully");

      // Create new User
      const newUser = new User({
        name: args.name,
        email: args.email,
        password: hashedPassword,
        role: args.role,
        address: args.address,
        phoneNumber: args.phoneNumber,
      });

      const savedUser = await newUser.save();
      console.log("User saved successfully:", savedUser);

      // Generate JWT token
      const token = generateToken(newUser);
      console.log("JWT generated successfully:", token);
      return {
        message: `User registered successfully`,
        token,
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

// Resolver for Signin
const signin = {
  type: AuthResponseType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },

  async resolve(parent, args) {
    try {
      // Check if user exists
      const user = await User.findOne({ email: args.email });
      if (!user) {
        throw new Error(`User not found`);
      }

      // Validate password
      const isMatch = await bcrypt.compare(args.password, user.password);
      if (!isMatch) {
        throw new Error(`Invalid password`);
      }

      // Generate JWT Token
      const token = generateToken(user);
      return {
        message: `User logged in successfully`,
        token,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = { signup, signin };
