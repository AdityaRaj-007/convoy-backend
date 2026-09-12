import { IRidesRepository } from "./rides.repository";
import { RideDestination } from "./rides.types";

export class RidesService {
  private readonly ridesRepository: IRidesRepository;

  constructor(ridesRepository: IRidesRepository) {
    this.ridesRepository = ridesRepository;
  }

  async create(name: string, destination: RideDestination) {}

  async userActiveRides(userId: string) {}

  async join(userId: string, inviteCode: string) {}

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
      name?: string;
      destination?: { name?: string; lat: number; long: number };
    },
  ) {}

  async regenerateCode(rideId: string) {}
}
