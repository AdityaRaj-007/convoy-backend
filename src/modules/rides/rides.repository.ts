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
} from "./rides.types";

export interface IRidesRepository {
  create(
    rideName: string,
    destination: RideDestination,
    userId: string,
    inviteCode: string,
  ): Promise<RideDetails>;

  activeRides(userId: string): Promise<CurrentRideDetails[]>;

  join(userId: string, inviteCode: string): Promise<RideDetails | null>;

  rideMembers(rideId: string): Promise<RideMembers>;

  rideDetails(rideId: string): Promise<RideDetails | null>;

  acceptRequest(rideId: string, userId: string): Promise<RideMembership | null>;

  rejectRequest(rideId: string, userId: string): Promise<RideMembership | null>;

  removeUser(rideId: string, userId: string): Promise<RemovedUser | null>;

  leaveRide(rideId: string, userId: string): Promise<RemovedUser | null>;

  startRide(rideId: string): Promise<ActiveRide | null>;

  completeRide(rideId: string): Promise<CompletedRide | null>;

  cancelRide(rideId: string): Promise<CancelledRide | null>;

  updateRideDetails(
    rideId: string,
    payload: { rideName: string; destination: RideDestination },
  ): Promise<RideDetails>;

  updateInviteCode(rideId: string, inviteCode: string): Promise<RideDetails>;

  pendingRequests(rideId: string): Promise<RequestDetails[]>;

  isMember(rideId: string, userId: string): Promise<RideMembership | null>;

  currentOwnerOfARide(rideId: string): Promise<RideMembership | null>;
}
