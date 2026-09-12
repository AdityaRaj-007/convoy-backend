import {
  ActiveRide,
  CompletedRide,
  RemovedUser,
  RideDestination,
  RideDetails,
  RideMembers,
  RideMembership,
} from "./rides.types";

export interface IRidesRepository {
  create(name: string, destination: RideDestination): Promise<RideDetails>;

  activeRides(userId: string): Promise<RideDetails | null>;

  join(rideId: string, inviteCode: string): Promise<RideDetails | null>;

  rideMembers(rideId: string): Promise<RideMembers | null>;

  acceptRequest(rideId: string, userId: string): Promise<RideMembership | null>;

  rejectRequest(rideId: string, userId: string): Promise<RideMembership | null>;

  removeUser(rideId: string, userId: string): Promise<RemovedUser | null>;

  leaveRide(rideId: string): Promise<RemovedUser | null>;

  startRide(rideId: string): Promise<ActiveRide | null>;

  completeRide(rideId: string): Promise<CompletedRide | null>;
}
