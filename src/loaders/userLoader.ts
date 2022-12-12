import { User } from ".prisma/client";
import DataLoader from "dataloader";
import { prisma } from "..";

type BatchUser = (ids: number[]) => Promise<User[]>;

// Batch request
const batchUsers: BatchUser = async (ids) => {
  const users = await prisma.user.findMany({ where: { id: { in: ids } } });

  const userMap: { [key: string]: User } = {};
  users.forEach((user) => {
    userMap[user.id] = user;
  });

  const batch = ids.map((id) => userMap[id]);

  return batch;
};

export const userLoader = new DataLoader<number, User>(batchUsers);
