import { Context } from "../../index";
import validator from "validator";

interface SignupArgs {
  email: string;
  name: string;
  bio: string;
  password: string;
}

interface UserPayload {
  userErrors: {
    message: string;
  }[];
  user: null;
}

export const authResolvers = {
  signup: async (
    parent: any,
    { email, name, password, bio }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    // Validation
    const isEmail = validator.isEmail(email);

    if (!isEmail) {
      return {
        userErrors: [
          {
            message: "Invalid email format",
          },
        ],
        user: null,
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
        user: null,
      };
    }

    if (!name || !bio) {
      return {
        userErrors: [
          {
            message: "Invalid name or bio",
          },
        ],
        user: null,
      };
    }

    return {
      userErrors: [],
      user: null,
    };

    // const result = await prisma.user.create({
    //   data: {
    //     email,
    //     name,
    //     password,
    //   },
    // });
    // return result;
  },
};
