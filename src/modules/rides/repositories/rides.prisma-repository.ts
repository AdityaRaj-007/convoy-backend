import { PrismaClient } from "../../../generated/prisma/client";
import { IRidesRepository } from "../rides.repository";

export class PrismaRidesRepository implements IRidesRepository {
  private readonly db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }
}
