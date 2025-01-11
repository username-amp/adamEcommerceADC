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

// Define a UserType to represent the user object in GraphQL
const UserType = new GraphQLObjectType({
  name: `User`,
  fields: {
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    gender: { type: GraphQLString },
    birthdate: { type: GraphQLString },
    address: { type: GraphQLString },
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

/* ----- Resolver for Google Signin ----- */
const googleSignin = {
  type: AuthResponseType,
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    image: { type: GraphQLString },
  },

  async resolve(parent, args) {
    try {
      console.log("Google sign-in resolver triggered with args:", args);

      let user = await User.findOne({ email: args.email });
      if (user) {
        console.log("User found:", user);
      } else {
        console.log("User not found. Creating new user...");

        // Generate default values for required fields
        const defaultUsername = args.email.split("@")[0]; // Use the email prefix as the username
        const defaultPassword = generateCode(8); // Use your `generateCode` utility to generate a random password

        user = new User({
          email: args.email,
          name: args.name,
          image: args.image,
          provider: "google",
          username: defaultUsername,
          password: defaultPassword, // You can store a hashed password here if necessary
          phoneNumber: null, // Optional: Or set a default value like "N/A"
        });

        await user.save();
        console.log("New user created:", user);
      }

      const token = generateToken(user);
      console.log("Generated token:", token);

      return {
        message: "Google Signin Successfully",
        token,
      };
    } catch (error) {
      console.error("Error in Google sign-in resolver:", error.message);
      throw new Error(error.message);
    }
  },
};

/* ----- Resolver for Facebook Signin ----- */
const facebookSignin = {
  type: AuthResponseType,
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    image: { type: GraphQLString },
  },

  async resolve(parent, args) {
    try {
      console.log("Facebook sign-in resolver triggered with args:", args);

      let user = await User.findOne({ email: args.email });
      if (user) {
        console.log("User found:", user);
      } else {
        console.log("User not found. Creating new user...");

        // Generate default values for required fields
        const defaultUsername = args.email.split("@")[0];
        const defaultPassword = generateCode(8); // Use your `generateCode` utility for password

        user = new User({
          email: args.email,
          name: args.name,
          image: args.image,
          provider: "facebook",
          username: defaultUsername,
          password: hashPassword(defaultPassword), // Hash this password if needed
          phoneNumber: null,
        });

        await user.save();
        console.log("New user created:", user);
      }

      const token = generateToken(user);
      console.log("Generated token:", token);

      return {
        message: "Facebook Signin Successfully",
        token,
      };
    } catch (error) {
      console.error("Error in Facebook sign-in resolver:", error.message);
      throw new Error(error.message);
    }
  },
};

/* ----- Resolver for Verify Code ----- */
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
          code: "400",
          status: "false",
          message: "User not found",
        };
      }

      if (user.isVerified) {
        return {
          code: "400",
          status: "false",
          message: "User Already Verified",
        };
      }

      // Generate a 6-digit OTP code
      const code = generateCode(6);
      user.verificationCode = code; // Save the OTP
      user.verificationCodeExpiry = Date.now() + 15 * 60 * 1000; // Set expiry to 15 minutes
      await user.save(); // Save the user with the new fields

      // Send email
      await sendEmail({
        emailTo: user.email,
        subject: "Email Verification Code",
        code: code,
        content: "Please verify your account using the code provided.",
      });

      return {
        code: "200",
        status: "true",
        message: "Verification code sent successfully",
      };
    } catch (error) {
      console.error("Error in verifyCode resolver:", error.message);
      throw new Error("Internal server error");
    }
  },
};

/* ----- Resolver for Confirm Code ----- */
const confirmCode = {
  type: ResponseType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    code: { type: new GraphQLNonNull(GraphQLString) },
  },

  async resolve(parent, args) {
    try {
      const user = await User.findOne({ email: args.email });

      if (!user) {
        return {
          code: "401",
          status: "false",
          message: "User not found",
        };
      }

      if (user.verificationCode !== args.code) {
        return {
          code: "400",
          status: "false",
          message: "Invalid Code",
        };
      }

      if (Date.now() > user.verificationCodeExpiry) {
        return {
          code: "400",
          status: "false",
          message: "Code Expired",
        };
      }

      user.isVerified = true; // Set the user as verified
      user.verificationCode = null; // Clear the OTP
      user.verificationCodeExpiry = null; // Clear the expiry time
      await user.save();

      return {
        code: "200",
        status: "true",
        message: "User verified successfully",
      };
    } catch (error) {
      console.error("Error in confirmCode resolver:", error.message);
      throw new Error("Internal server error");
    }
  },
};

/* ----- Resolver for ResetPasswordRequest ----- */
const resetPasswordRequest = {
  type: ResponseType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
  },

  async resolve(parent, args) {
    try {
      const user = await User.findOne({ email: args.email });
      if (!user) {
        return {
          code: 401,
          status: false,
          message: `User not found`,
        };
      }

      const code = generateCode(6);
      user.passwordResetCode = code;
      user.passwordResetCodeExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
      await user.save();

      await sendEmail({
        emailTo: user.email,
        subject: `Password Reset Request`,
        code: code,
        content: `reset your password`,
      });

      return {
        code: 200,
        status: true,
        message: `Password reset code send successfully`,
      };
    } catch (error) {
      console.error(`Error in resetPasswordRequest resolver`, error.message);
      throw new error(`Internal server error`);
    }
  },
};

/* ----- Resolver for ResetPassword ----- */
const resetPassword = {
  type: ResponseType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    newPassword: { type: new GraphQLNonNull(GraphQLString) },
  },

  async resolve(parent, args) {
    try {
      const user = await User.findOne({ email: args.email });
      if (!user) {
        return {
          code: 401,
          status: false,
          message: `User not found`,
        };
      }

      user.password = await hashPassword(args.newPassword);
      await user.save();

      return {
        code: 200,
        status: true,
        message: `Password updated successfully`,
      };
    } catch (error) {
      console.error(`Error in resetPassword resolver`, error.message);
      throw new error(`Internal server error`);
    }
  },
};

/* ----- Resolver for GetUsernameByEmail ----- */
const getUsernameByEmail = {
  type: UserType,
  args: {
    email: { type: GraphQLString }, // Pass the email as an argument
  },
  resolve: async (_, { email }) => {
    try {
      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("User not found");
      }

      // Return the user object
      return {
        username: user.username,
      };
    } catch (error) {
      console.error("Error fetching user:", error.message); // Debugging: Log the error
      throw new Error(error.message);
    }
  },
};

module.exports = {
  signup,
  signin,
  googleSignin,
  facebookSignin,
  verifyCode,
  confirmCode,
  resetPasswordRequest,
  resetPassword,
  getUsernameByEmail,
};
