import { PrismaClient } from "../../../generated/prisma/client";
import { IRidesRepository } from "../rides.repository";
import {
  RemovedUser,
  RideDestination,
  RideDetails,
  RideMembers,
  RideMembership,
} from "../rides.types";

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
    // TODO
    // Fetch the rideMembership role as well
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

  async rideMembers(rideId: string): Promise<RideMembers> {
    const members = await this.db.rideMembership.findMany({
      where: { rideId, status: "ACTIVE" },
      omit: { status: true, createdAt: true, rideId: true },
      include: { user: { select: { name: true, phoneNumber: true } } },
    });

    return members.map((member) => ({
      userId: member.userId,
      name: member.user.name,
      phoneNumber: member.user.phoneNumber,
      role: member.role,
    }));
  }

  async rideDetails(rideId: string): Promise<RideDetails | null> {
    const data = await this.db.ride.findUnique({
      where: { id: rideId },
      omit: { createdAt: true, updatedAt: true },
    });

    if (!data) {
      return null;
    }

    return {
      destination: data.destination as RideDestination,
      rideId: data.id,
      inviteCode: data.inviteCode,
      status: data.status,
    };
  }

  async acceptRequest(
    rideId: string,
    userId: string,
  ): Promise<RideMembership | null> {
    const data = await this.db.rideMembership.update({
      where: { rideId_userId: { rideId, userId } },
      data: { status: "ACTIVE" },
    });

    if (!data) {
      return null;
    }

    return { userId: data.userId, role: data.role, status: data.status };
  }

  async rejectRequest(
    rideId: string,
    userId: string,
  ): Promise<RideMembership | null> {
    const data = await this.db.rideMembership.delete({
      where: { rideId_userId: { rideId, userId }, status: "PENDING" },
    });

    if (!data) {
      return null;
    }

    return { userId: data.userId, role: data.role, status: data.status };
  }

  async removeUser(
    rideId: string,
    userId: string,
  ): Promise<RemovedUser | null> {
    const data = await this.db.rideMembership.delete({
      where: { rideId_userId: { rideId, userId } },
      omit: {
        rideId: true,
        userId: true,
        status: true,
        role: true,
        createdAt: true,
      },
      include: { user: { select: { name: true, id: true } } },
    });

    if (!data) {
      return null;
    }

    return { name: data.user.name, id: data.user.id };
  }

  async leaveRide(rideId: string, userId: string): Promise<RemovedUser | null> {
    const data = await this.db.rideMembership.delete({
      where: { rideId_userId: { rideId, userId } },
      omit: {
        rideId: true,
        userId: true,
        status: true,
        role: true,
        createdAt: true,
      },
      include: { user: { select: { name: true, id: true } } },
    });

    if (!data) {
      return null;
    }

    return { name: data.user.name, id: data.user.id };
  }
}
