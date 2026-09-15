import { PrismaClient } from "../../../generated/prisma/client";
import { IRidesRepository } from "../rides.repository";
import {
  ActiveRide,
  CancelledRide,
  CompletedRide,
  CurrentRideDetails,
  RemovedUser,
  RequestDetails,
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

  async userRides(userId: string): Promise<CurrentRideDetails[]> {
    const rides = await this.db.ride.findMany({
      where: {
        status: "CREATED",
        members: { some: { userId, status: { in: ["ACTIVE", "PENDING"] } } },
      },
      select: {
        id: true,
        inviteCode: true,
        destination: true,
        status: true,
        members: {
          where: { userId, status: { in: ["ACTIVE", "PENDING"] } },
          select: { role: true, status: true },
          take: 1,
        },
      },
    });

    console.log("Ride List : " + rides);

    return rides.map((ride) => ({
      rideId: ride.id,
      inviteCode: ride.inviteCode,
      destination: ride.destination as RideDestination,
      status: ride.status,
      membership: {
        role: ride.members[0]!.role,
        status: ride.members[0]!.status,
      },
    }));
  }

  async activeRides(userId: string): Promise<CurrentRideDetails[]> {
    const rides = await this.db.ride.findMany({
      where: {
        status: "ACTIVE",
        members: { some: { userId, status: "ACTIVE" } },
      },
      select: {
        id: true,
        inviteCode: true,
        destination: true,
        status: true,
        members: {
          where: { userId, status: "ACTIVE" },
          select: { role: true, status: true },
          take: 1,
        },
      },
    });

    console.log("Ride List : " + rides);

    return rides.map((ride) => ({
      rideId: ride.id,
      inviteCode: ride.inviteCode,
      destination: ride.destination as RideDestination,
      status: ride.status,
      membership: {
        role: ride.members[0]!.role,
        status: ride.members[0]!.status,
      },
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
      createdBy: data.createdBy,
    };
  }

  async acceptRequest(
    rideId: string,
    userId: string,
  ): Promise<RideMembership | null> {
    const data = await this.db.$transaction(async (tx) => {
      const membership = await tx.rideMembership.findUnique({
        where: { rideId_userId: { rideId, userId } },
      });

      if (!membership || membership.status !== "PENDING") {
        return null;
      }

      const updatedData = await tx.rideMembership.update({
        where: { rideId_userId: { rideId, userId } },
        data: { status: "ACTIVE" },
      });

      return {
        userId: updatedData.userId,
        status: updatedData.status,
        role: updatedData.role,
      };
    });

    return data;
  }

  async rejectRequest(
    rideId: string,
    userId: string,
  ): Promise<RideMembership | null> {
    const data = await this.db.$transaction(async (tx) => {
      const membership = await tx.rideMembership.findUnique({
        where: { rideId_userId: { rideId, userId } },
      });

      if (!membership || membership.status !== "PENDING") {
        return null;
      }

      const deletedData = await tx.rideMembership.delete({
        where: { rideId_userId: { rideId, userId } },
      });

      return {
        userId: deletedData.userId,
        role: deletedData.role,
        status: deletedData.status,
      };
    });

    return data;
  }

  async removeUser(
    rideId: string,
    userId: string,
  ): Promise<RemovedUser | null> {
    const data = await this.db.$transaction(async (tx) => {
      const isMember = await tx.rideMembership.findUnique({
        where: { rideId_userId: { rideId, userId } },
      });

      if (!isMember) {
        return null;
      }

      const removedUser = await tx.rideMembership.delete({
        where: { rideId_userId: { rideId, userId } },
        include: { user: { select: { id: true, name: true } } },
      });

      return { name: removedUser.user.name, id: removedUser.user.id };
    });

    return data;
  }

  async leaveRide(rideId: string, userId: string): Promise<RemovedUser | null> {
    const data = await this.db.$transaction(async (tx) => {
      const membership = await tx.rideMembership.findUnique({
        where: { rideId_userId: { rideId, userId } },
        omit: { rideId: true, userId: true, createdAt: true, status: true },
        include: { user: { select: { id: true, name: true } } },
      });

      if (!membership) {
        throw new Error("NOT_A_RIDE_MEMBER");
      }

      await tx.rideMembership.delete({
        where: { rideId_userId: { rideId, userId } },
      });

      if (membership.role === "OWNER") {
        const nextUser = await tx.rideMembership.findFirst({
          where: { rideId, status: "ACTIVE" },
          orderBy: { createdAt: "asc" },
          select: { userId: true },
        });

        if (!nextUser) {
          await tx.ride.update({
            where: { id: rideId },
            data: { status: "CANCELLED" },
          });

          await tx.rideMembership.deleteMany({
            where: { rideId, status: "PENDING" },
          });
          return null;
        }

        await tx.rideMembership.update({
          where: { rideId_userId: { rideId, userId: nextUser.userId } },
          data: { role: "OWNER" },
        });
      }

      return membership.user;
    });

    return data;
  }

  async startRide(rideId: string): Promise<ActiveRide | null> {
    return await this.db.ride.update({
      where: { id: rideId },
      data: { status: "ACTIVE" },
      select: { id: true, status: true, rideName: true },
    });
  }

  async completeRide(rideId: string): Promise<CompletedRide | null> {
    const data = await this.db.$transaction(async (tx) => {
      const rideData = await tx.ride.update({
        where: { id: rideId },
        data: { status: "COMPLETED" },
      });

      if (!rideData) {
        return null;
      }

      await tx.rideMembership.updateMany({
        where: { rideId, status: "ACTIVE" },
        data: { status: "COMPLETED" },
      });

      await tx.rideMembership.deleteMany({
        where: { rideId, status: "PENDING" },
      });

      return {
        name: rideData.rideName,
        status: rideData.status,
        id: rideData.id,
      };
    });

    return data;
  }

  async cancelRide(rideId: string): Promise<CancelledRide | null> {
    const data = await this.db.$transaction(async (tx) => {
      const rideData = await tx.ride.update({
        where: { id: rideId },
        data: { status: "CANCELLED" },
      });

      if (!rideData) {
        return null;
      }

      await tx.rideMembership.deleteMany({
        where: { rideId },
      });

      return {
        id: rideData.id,
        name: rideData.rideName,
        status: rideData.status,
      };
    });

    return data;
  }

  async updateRideDetails(
    rideId: string,
    payload: { rideName: string; destination: RideDestination },
  ): Promise<RideDetails> {
    const data = await this.db.ride.update({
      where: { id: rideId },
      data: { rideName: payload.rideName, destination: payload.destination },
      omit: { createdAt: true, createdBy: true },
    });

    return {
      rideId: data.id,
      inviteCode: data.inviteCode,
      destination: data.destination as RideDestination,
      status: data.status,
    };
  }

  async updateInviteCode(
    rideId: string,
    inviteCode: string,
  ): Promise<RideDetails> {
    const data = await this.db.ride.update({
      where: { id: rideId },
      data: { inviteCode },
    });

    return {
      rideId: data.id,
      inviteCode: data.inviteCode,
      destination: data.destination as RideDestination,
      status: data.status,
    };
  }

  async pendingRequests(rideId: string): Promise<RequestDetails[]> {
    const requests = await this.db.rideMembership.findMany({
      where: { rideId, status: "PENDING" },
      omit: { createdAt: true, role: true, rideId: true },
      include: { user: { select: { name: true, phoneNumber: true } } },
    });

    return requests.map((request) => ({
      userId: request.userId,
      status: request.status,
      name: request.user.name,
      phoneNumber: request.user.phoneNumber,
    }));
  }

  async isMember(
    rideId: string,
    userId: string,
  ): Promise<RideMembership | null> {
    return await this.db.rideMembership.findUnique({
      where: { rideId_userId: { rideId, userId } },
      select: { userId: true, role: true, status: true },
    });
  }

  async currentOwnerOfARide(rideId: string): Promise<RideMembership | null> {
    return await this.db.rideMembership.findFirst({
      where: { rideId, role: "OWNER", status: "ACTIVE" },
      select: { userId: true, role: true, status: true },
    });
  }
}
