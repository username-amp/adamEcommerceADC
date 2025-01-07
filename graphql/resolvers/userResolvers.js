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
    confirmPassword: { type: new GraphQLNonNull(GraphQLString) },
    role: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    gender: { type: new GraphQLNonNull(GraphQLString) },
    birthdate: { type: new GraphQLNonNull(GraphQLString) },
    terms: { type: GraphQLString },
  },

  async resolve(parent, args) {
    try {
      // Validate Confirm Password
      if (args.password !== args.confirmPassword) {
        return {
          code: 400,
          status: false,
          message: `Password do not match`,
        };
      }

      // Validate Birthdate
      const birthdate = new Date(args.birthdate);
      const currentDate = new Date();

      // Check if the birthdate is valid
      if (isNaN(birthdate.getTime())) {
        return {
          code: 400,
          status: false,
          message: "Invalid birthdate. Please provide a valid date.",
        };
      }

      // Check if the birthdate is in the future
      if (birthdate >= currentDate) {
        return {
          code: 400,
          status: false,
          message: "Invalid birthdate. Birthdate must be in the past.",
        };
      }

      // Validate phone number
      const phoneRegex = /^09\d{9}$/;
      if (args.phoneNumber && !phoneRegex.test(args.phoneNumber)) {
        return {
          code: 400,
          status: false,
          message: `Invalid phone number`,
        };
      }

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
        gender: args.gender,
        birthdate: birthdate,
        terms: args.terms || null,
      });

      const savedUser = await newUser.save();

      const token = generateToken(savedUser);

      return {
        code: 200,
        status: true,
        message: `User registered successfully`,
        token, // Return the generated token
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

/* ----- Resolver for SignIn ----- */
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

/* ----- Resolver for VerifyCode ----- */
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
