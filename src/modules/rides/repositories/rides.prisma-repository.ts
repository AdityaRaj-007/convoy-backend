import { PrismaClient } from "../../../generated/prisma/client";
import { IRidesRepository } from "../rides.repository";
import { RideDestination, RideDetails } from "../rides.types";

export class PrismaRidesRepository implements IRidesRepository {
  private readonly db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async create(
    rideName: string,
    destination: RideDestination,
    userId: string,
    inviteCode: string,
  ): Promise<RideDetails> {
    const data = await this.db.$transaction(async (tx) => {
      const rideDetail = await tx.ride.create({
        data: {
          rideName,
          destination,
          inviteCode,
          createdBy: userId,
          status: "CREATED",
        },
      });

      await tx.rideMembership.create({
        data: {
          rideId: rideDetail.id,
          userId: userId,
          role: "OWNER",
          status: "ACTIVE",
        },
      });

      return {
        rideId: rideDetail.id,
        destination: rideDetail.destination as RideDestination,
        status: rideDetail.status,
        inviteCode: rideDetail.inviteCode,
      };
    });

    return data;
  }

  async activeRides(userId: string): Promise<RideDetails[]> {
    const rides = await this.db.ride.findMany({
      where: { createdBy: userId, status: "ACTIVE" },
      select: {
        id: true,
        inviteCode: true,
        destination: true,
        status: true,
      },
    });

    console.log("Ride List : " + rides);

    return rides.map((ride) => ({
      rideId: ride.id,
      inviteCode: ride.inviteCode,
      destination: ride.destination as RideDestination,
      status: ride.status,
    }));
  }

  async join(userId: string, inviteCode: string): Promise<RideDetails> {
    const data = await this.db.$transaction(async (tx) => {
      const rideData = await tx.ride.findUnique({ where: { inviteCode } });

      if (!rideData) {
        throw new Error("INVALID_INVITE_CODE");
      }

      if (rideData.status === "COMPLETED" || rideData.status === "CANCELLED") {
        throw new Error(`RIDE_IS_${rideData.status}`);
      }
      const rideId = rideData.id;
      const rideMemberShip = await tx.rideMembership.findFirst({
        where: {
          userId,
          status: { in: ["PENDING", "ACTIVE"] },
        },
      });

      if (rideMemberShip) {
        throw new Error("ALREADY_MEMBER");
      }

      const rideMemberShipStatus =
        rideData.status === "ACTIVE" ? "ACTIVE" : "PENDING";
      await tx.rideMembership.create({
        data: { userId, rideId, role: "MEMBER", status: rideMemberShipStatus },
      });

      return {
        rideId,
        destination: rideData.destination as RideDestination,
        inviteCode,
        status: rideData.status,
      };
    });

    return data;
  }
}
