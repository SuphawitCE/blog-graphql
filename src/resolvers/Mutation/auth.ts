import { Context } from "../../index";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const JWT_SIGNATURE = process.env.JWT_SIGNATURE;

interface SignupArgs {
  credentials: {
    email: string;
    password: string;
  };
  name: string;
  bio: string;
}

interface SigninArgs {
  credentials: {
    email: string;
    password: string;
  };
}

interface UserPayload {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

export const authResolvers = {
  signup: async (
    parent: any,
    { credentials, name, bio }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = credentials;
    // Validation
    const isEmail = validator.isEmail(email);

    if (!isEmail) {
      return {
        userErrors: [
          {
            message: "Invalid email format",
          },
        ],
        token: null,
      };
    }

    const isValidPassword = validator.isLength(password, { min: 5 });

    if (!isValidPassword) {
      return {
        userErrors: [
          {
            message: "Invalid password format",
          },
        ],
        token: null,
      };
    }

    if (!name || !bio) {
      return {
        userErrors: [
          {
            message: "Invalid name or bio",
          },
        ],
        token: null,
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Prisma
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // Create user profile
    await prisma.profile.create({
      data: {
        bio,
        userId: user.id,
      },
    });

    const token = await JWT.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SIGNATURE,
      {
        expiresIn: 3600000,
      }
    );

    return {
      userErrors: [],
      token,
    };
  },
  signin: async (
    parent: any,
    { credentials }: SigninArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = credentials;
    const user = await prisma.user.findUnique({ wher: { email } });

    if (!user) {
      return {
        userErrors: [
          {
            message: "Invalid credentials",
          },
        ],
        token: null,
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return {
        userErrors: [
          {
            message: "Invalid credentials",
          },
        ],
        token: null,
      };
    }

    const token = await JWT.sign({ userId: user.id }, JWT_SIGNATURE, {
      expiresIn: 3600000,
    });

    return {
      userErrors: [],
      token,
    };
  },
};
