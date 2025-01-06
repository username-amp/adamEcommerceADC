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

/* ----- Resolver for SignUp ----- */
const signup = {
  type: AuthResponseType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    role: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
  },

  async resolve(parent, args) {
    try {
      // Check if email already exists
      const existingUser = await User.findOne({ email: args.email });
      if (existingUser) {
        return {
          code: 400,
          status: false,
          message: `Email already exists`,
        };
      }

      // Check if username already exists
      const existingUserByUsername = await User.findOne({
        username: args.username,
      });
      if (existingUserByUsername) {
        return {
          code: 400,
          status: false,
          message: `Username already exists`,
        };
      }

      // Hash Password
      const hashedPassword = await hashPassword(args.password);

      // Create new User
      const newUser = new User({
        name: args.name,
        username: args.username,
        email: args.email,
        password: hashedPassword,
        role: args.role,
        address: args.address || null,
        phoneNumber: args.phoneNumber || null,
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

/* Resolver for SignIn */
const signin = {
  type: AuthResponseType,
  args: {
    emailOrUsername: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },

  async resolve(parent, args) {
    try {
      // Check if user exists
      const user = await User.findOne({
        $or: [
          { email: { $regex: new RegExp(`^${args.emailOrUsername}$`, "i") } },
          {
            username: { $regex: new RegExp(`^${args.emailOrUsername}$`, "i") },
          },
        ],
      });

      if (!user) {
        return {
          code: 400,
          status: false,
          message: `User not found`,
        };
      }

      // Validate password
      const isMatch = await bcrypt.compare(args.password, user.password);
      if (!isMatch) {
        return {
          code: 400,
          status: false,
          message: `Invalid password`,
        };
      }

      // Generate JWT Token
      const token = generateToken(user);
      return {
        message: `User logged in Successfully`,
        token,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

/* Resolver for verifyCode */
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
