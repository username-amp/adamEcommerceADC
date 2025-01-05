const { GraphQLString, GraphQLNonNull, GraphQLObjectType } = require(`graphql`);
const bcrypt = require(`bcryptjs`);
const User = require(`../../models/User`);
const hashPassword = require(`../../utils/hashPassword`);
const generateToken = require(`../../utils/generateToken`);
const generateCode = require(`../../utils/generateCode`);
const sendEmail = require(`../../utils/sendEmail`);

// Define a custom type for responses
const AuthResponseType = new GraphQLObjectType({
  name: `AuthResponseType`,
  fields: {
    message: { type: GraphQLString },
    token: { type: GraphQLString },
  },
});

// define a custom type for general responses
const ResponseType = new GraphQLObjectType({
  name: `ResponseType`,
  fields: {
    code: { type: GraphQLString },
    status: { type: GraphQLString },
    message: { type: GraphQLString },
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
      const existingUser = await User.findOne({ email: args.email });
      if (existingUser) {
        throw new Error(`Email already registered`);
      }

      // Hash Password
      const hashedPassword = await hashPassword(args.password);

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

      // Generate JWT token
      const token = generateToken(newUser);
      return {
        message: `User registered successfully`,
        token,
      };
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

// Resolver for verify code
const verifyCode = {
  type: ResponseType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
  },

  async resolve(parent, args) {
    try {
      const user = await User.findOne({ email: args.email });
      if (!user) {
        return {
          code: `401`,
          status: `false`,
          message: `User not found`,
        };
      }

      if (user.isVerified) {
        return {
          code: `400`,
          status: `false`,
          message: `User Already Verified`,
        };
      }

      const code = generateCode(6);
      user.verificationCode = code;
      await user.save();

      await sendEmail({
        emailTo: user.email,
        subject: `Email Verification Code`,
        code: code,
        content: `verify your account`,
      });

      return {
        code: `200`,
        status: `true`,
        message: `verification code sent successfully`,
      };
    } catch (error) {
      console.error(`Error in verifyCode resolver`, error.message);
      throw new Error(`Internal server code`);
    }
  },
};

module.exports = { signup, signin, verifyCode };
