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

    console.log("Active Ride Lists : " + activeRides + typeof activeRides);
    if (activeRides === null) {
      throw new Error("ACTIVE_RIDE_EXISTS");
    }

    const data = await this.ridesRepository.create(
      rideName,
      destination,
      userId,
      inviteCode,
    );

    return data;
  }

  async userActiveRides(userId: string) {
    const activeRides = await this.ridesRepository.activeRides(userId);
    console.log("Active Rides : " + activeRides);

    if (!activeRides) {
      return {};
    }

    return activeRides;
  }

  async join(userId: string, inviteCode: string) {
    return await this.ridesRepository.join(userId, inviteCode);
  }

  async rideMembers(rideId: string) {
    return await this.ridesRepository.rideMembers(rideId);
  }

  async acceptUserRequest(rideId: string, userId: string, ownerId: string) {
    const rideDetails = await this.ridesRepository.rideDetails(rideId);

    if (!rideDetails) {
      throw new Error("RIDE_DOES_NOT_EXISTS");
    }

    if (rideDetails.createdBy !== ownerId) {
      throw new Error("FORBIDDEN");
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

    if (rideDetails.createdBy !== ownerId) {
      throw new Error("FORBIDDEN");
    }

    const data = await this.ridesRepository.acceptRequest(rideId, userId);

    if (!data) {
      throw new Error("NOT_A_MEMBER");
    }

    return data;
  }

  async removeUser(rideId: string, userId: string) {
    const rideDetails = this.ridesRepository.rideDetails(rideId);

    if (!rideDetails) {
      throw new Error("RIDE_DOES_NOT_EXISTS");
    }
    return await this.ridesRepository.removeUser(rideId, userId);
  }

  async leaveRide(rideId: string, userId: string) {
    const rideDetails = this.ridesRepository.rideDetails(rideId);

    if (!rideDetails) {
      throw new Error("RIDE_DOES_NOT_EXISTS");
    }

    return await this.ridesRepository.leaveRide(rideId, userId);
  }

  async startRide(rideId: string) {}

  async completeRide(rideId: string) {}

  async cancelRide(rideId: string) {}

  async updateRideDetails(
    rideId: string,
    payload: {
      name: string;
      destination: RideDestination;
    },
  ) {}

  async regenerateCode(rideId: string) {}
}
