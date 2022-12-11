import { Context } from "../../index";

interface SignupArgs {
  email: string;
  name: string;
  bio: string;
  password: string;
}

export const authResolvers = {
  signup: async (
    parent: any,
    { email, name, password, bio }: SignupArgs,
    { prisma }: Context
  ) => {
    const result = await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });
    return result;
  },
};
