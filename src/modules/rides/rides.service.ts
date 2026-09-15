import { generate } from "short-uuid";
import { IRidesRepository } from "./rides.repository";
import { RideDestination } from "./rides.types";

export class RidesService {
  private readonly ridesRepository: IRidesRepository;

  constructor(ridesRepository: IRidesRepository) {
    this.ridesRepository = ridesRepository;
  }

  async create(rideName: string, destination: RideDestination, userId: string) {
    const inviteCode = generate();

    const activeRides = await this.ridesRepository.activeRides(userId);

    const currentRides = await this.ridesRepository.userRides(userId);

    console.log("Active Ride Lists : " + activeRides + typeof activeRides);
    if (activeRides.length > 0) {
      throw new Error("ACTIVE_RIDE_EXISTS");
    }

    if (currentRides.length > 0) {
      throw new Error("RIDE_EXISTS");
    }

    const data = await this.ridesRepository.create(
      rideName,
      destination,
      userId,
      inviteCode,
    );

    return data;
  }

  async userRides(userId: string) {
    return this.ridesRepository.userRides(userId);
  }

  async userActiveRides(userId: string) {
    const activeRides = await this.ridesRepository.activeRides(userId);
    console.log("Active Rides : " + activeRides);

    return activeRides;
  }

  async join(userId: string, inviteCode: string) {
    return await this.ridesRepository.join(userId, inviteCode);
  }

  async rideMembers(rideId: string, userId: string) {
    const isMember = await this.ridesRepository.isMember(rideId, userId);

    if (!isMember) {
      throw new Error("NOT_A_RIDE_MEMBER");
    }

    if (isMember.status !== "ACTIVE") {
      throw new Error("NOT_PART_OF_RIDE");
    }
    return await this.ridesRepository.rideMembers(rideId);
  }

  async acceptUserRequest(rideId: string, userId: string, ownerId: string) {
    const rideDetails = await this.ridesRepository.rideDetails(rideId);

    if (!rideDetails) {
      throw new Error("RIDE_DOES_NOT_EXISTS");
    }

    const currentOwner = await this.ridesRepository.currentOwnerOfARide(rideId);

    if (!currentOwner) {
      throw new Error("INVALID_REQUEST");
    }

    if (ownerId !== currentOwner.userId) {
      throw new Error("FORBIDDEN");
    }

    if (["COMPLETED", "CANCELLED"].includes(rideDetails.status)) {
      throw new Error("INVALID_RIDE_STATUS");
    }

    const data = await this.ridesRepository.acceptRequest(rideId, userId);

    if (!data) {
      throw new Error("NOT_A_MEMBER");
    }

    return data;
  }

  async rejectUserRequest(rideId: string, userId: string, ownerId: string) {
    const rideDetails = await this.ridesRepository.rideDetails(rideId);

    if (!rideDetails) {
      throw new Error("RIDE_DOES_NOT_EXISTS");
    }

    const currentOwner = await this.ridesRepository.currentOwnerOfARide(rideId);

    if (!currentOwner) {
      throw new Error("INVALID_REQUEST");
    }

    if (ownerId !== currentOwner.userId) {
      throw new Error("FORBIDDEN");
    }

    if (["COMPLETED", "CANCELLED"].includes(rideDetails.status)) {
      throw new Error("INVALID_RIDE_STATUS");
    }

    const data = await this.ridesRepository.rejectRequest(rideId, userId);

    if (!data) {
      throw new Error("NOT_A_MEMBER");
    }

    return data;
  }

  async removeUser(rideId: string, userId: string, ownerId: string) {
    const rideDetails = await this.ridesRepository.rideDetails(rideId);

    if (!rideDetails) {
      throw new Error("RIDE_DOES_NOT_EXISTS");
    }

    const currentOwner = await this.ridesRepository.currentOwnerOfARide(rideId);

    if (!currentOwner) {
      throw new Error("INVALID_REQUEST");
    }

    if (ownerId !== currentOwner.userId) {
      throw new Error("FORBIDDEN");
    }

    if (["COMPLETED", "CANCELLED"].includes(rideDetails.status)) {
      throw new Error("INVALID_STATUS");
    }

    if (userId === ownerId) {
      throw new Error("CANNOT_REMOVE_SELF");
    }
    return await this.ridesRepository.removeUser(rideId, userId);
  }

  async leaveRide(rideId: string, userId: string) {
    const rideDetails = await this.ridesRepository.rideDetails(rideId);

    if (!rideDetails) {
      throw new Error("RIDE_DOES_NOT_EXISTS");
    }

    if (rideDetails.status === "COMPLETED") {
      throw new Error("INVALID_STATUS");
    }

    if (rideDetails.status === "CANCELLED") {
      throw new Error("INVALID_STATUS");
    }

    return await this.ridesRepository.leaveRide(rideId, userId);
  }

  async startRide(rideId: string, userId: string) {
    const rideDetails = await this.ridesRepository.rideDetails(rideId);

    if (!rideDetails) {
      throw new Error("RIDE_DOES_NOT_EXISTS");
    }

    const currentOwner = await this.ridesRepository.currentOwnerOfARide(rideId);

    if (!currentOwner) {
      throw new Error("INVALID_REQUEST");
    }

    if (userId !== currentOwner.userId) {
      throw new Error("FORBIDDEN");
    }

    if (rideDetails.status !== "CREATED") {
      throw new Error("INVALID_RIDE_STATUS");
    }

    const data = await this.ridesRepository.startRide(rideId);

    return data;
  }

  async completeRide(rideId: string, userId: string) {
    const rideDetails = await this.ridesRepository.rideDetails(rideId);

    if (!rideDetails) {
      throw new Error("RIDE_DOES_NOT_EXISTS");
    }

    const currentOwner = await this.ridesRepository.currentOwnerOfARide(rideId);

    if (!currentOwner) {
      throw new Error("INVALID_REQUEST");
    }

    if (userId !== currentOwner.userId) {
      throw new Error("FORBIDDEN");
    }

    if (rideDetails.status !== "ACTIVE") {
      throw new Error("INVALID_RIDE_STATUS");
    }

    const data = await this.ridesRepository.completeRide(rideId);

    return data;
  }

  async cancelRide(rideId: string, userId: string) {
    const rideDetails = await this.ridesRepository.rideDetails(rideId);

    if (!rideDetails) {
      throw new Error("RIDE_DOES_NOT_EXISTS");
    }

    const currentOwner = await this.ridesRepository.currentOwnerOfARide(rideId);

    if (!currentOwner) {
      throw new Error("INVALID_REQUEST");
    }

    if (userId !== currentOwner.userId) {
      throw new Error("FORBIDDEN");
    }

    if (!["ACTIVE", "CREATED"].includes(rideDetails.status)) {
      throw new Error("INAVLID_RIDE_STATUS");
    }

    const data = await this.ridesRepository.cancelRide(rideId);

    return data;
  }

  async updateRideDetails(
    rideId: string,
    payload: {
      rideName: string;
      destination: RideDestination;
    },
    userId: string,
  ) {
    const rideDetails = await this.ridesRepository.rideDetails(rideId);

    if (!rideDetails) {
      throw new Error("RIDE_DOES_NOT_EXISTS");
    }

    const currentOwner = await this.ridesRepository.currentOwnerOfARide(rideId);

    if (!currentOwner) {
      throw new Error("INVALID_REQUEST");
    }

    if (currentOwner.userId !== userId) {
      throw new Error("FORBIDDEN");
    }

    if (["CANCELLED", "COMPLETED"].includes(rideDetails.status)) {
      throw new Error("INVALID_RIDE_STATUS");
    }

    const data = await this.ridesRepository.updateRideDetails(rideId, payload);

    return data;
  }

  async regenerateCode(rideId: string, userId: string) {
    const rideDetails = await this.ridesRepository.rideDetails(rideId);

    if (!rideDetails) {
      throw new Error("RIDE_DOES_NOT_EXISTS");
    }

    const currentOwner = await this.ridesRepository.currentOwnerOfARide(rideId);

    if (!currentOwner) {
      throw new Error("INVALID_REQUEST");
    }

    if (userId !== currentOwner.userId) {
      throw new Error("FORBIDDEN");
    }

    if (["COMPLETED", "CANCELLED"].includes(rideDetails.status)) {
      throw new Error("INVALID_STATUS");
    }

    const newInviteCode = generate();

    const data = await this.ridesRepository.updateInviteCode(
      rideId,
      newInviteCode,
    );

    return data;
  }

  async pendingRequests(rideId: string, userId: string) {
    const rideDetails = await this.ridesRepository.rideDetails(rideId);

    if (!rideDetails) {
      throw new Error("RIDE_DOES_NOT_EXISTS");
    }

    const currentOwner = await this.ridesRepository.currentOwnerOfARide(rideId);

    if (!currentOwner) {
      throw new Error("INVALID_REQUEST");
    }

    if (userId !== currentOwner.userId) {
      throw new Error("FORBIDDEN");
    }

    if (["COMPLETED", "CANCELLED"].includes(rideDetails.status)) {
      throw new Error("INVALID_STATUS");
    }

    const data = await this.ridesRepository.pendingRequests(rideId);

    return data;
  }
}
