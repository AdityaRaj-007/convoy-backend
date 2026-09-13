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

  async rideMembers(rideId: string) {}

  async acceptUserRequest(rideId: string, userId: string, ownerId: string) {}

  async rejectUserRequest(rideId: string, userId: string, ownerId: string) {}

  async removeUser(rideId: string, userId: string) {}

  async leaveRide(rideId: string) {}

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
