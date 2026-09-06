import { PrismaClient } from "../../../generated/prisma/client";
import { UserDetails } from "../auth.types";
import { IAuthRepository } from "../auth.repository";

export class AuthPrismaRepository implements IAuthRepository {
  private readonly db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async findUser(phoneNumber: string): Promise<UserDetails | null> {
    return this.db.user.findUnique({
      where: { phoneNumber },
      select: { id: true, phoneNumber: true, name: true },
    });
  }

  async createUser(phoneNumber: string): Promise<UserDetails> {
    return this.db.user.create({
      data: { phoneNumber },
      select: { id: true, phoneNumber: true, name: true },
    });
  }
}
