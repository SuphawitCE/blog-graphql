import JWT from "jsonwebtoken";

export const getUserFromToken = (token: string) => {
  try {
    return JWT.verify(token, process.env.JWT_SIGNATURE) as { userId: number };
  } catch (error) {
    return null;
  }
};
