import z from "zod";
import {
  AcceptRideRequestSchema,
  CreateRidesSchema,
  JoinRideSchema,
  RejectRideRequestSchema,
  RemoveUserSchema,
  UpdateRideDetailsBodySchema,
  UpdateRideDetailsParamsSchema,
  UpdateRideStatusSchema,
} from "./rides.schema";
import {
  MembershipStatus,
  RideStatus,
  Role,
} from "../../generated/prisma/enums";

export type CreateRideBody = z.infer<typeof CreateRidesSchema>;
export type JoinRideBody = z.infer<typeof JoinRideSchema>;
export type AcceptRideRequest = z.infer<typeof AcceptRideRequestSchema>;
export type RejectRideRequest = z.infer<typeof RejectRideRequestSchema>;
export type RemoveUserFromRide = z.infer<typeof RemoveUserSchema>;
export type LeaveRide = z.infer<typeof UpdateRideStatusSchema>;
export type StartRide = z.infer<typeof UpdateRideStatusSchema>;
export type CompleteRide = z.infer<typeof UpdateRideStatusSchema>;
export type CancelRide = z.infer<typeof UpdateRideStatusSchema>;
export type UpdateRideDetailsParams = z.infer<
  typeof UpdateRideDetailsParamsSchema
>;
export type UpdateRideDetailsBody = z.infer<typeof UpdateRideDetailsBodySchema>;

export type RideDestination = { name?: string; lat: number; long: number };
export type RideDetails = {
  rideId: string;
  inviteCode: string;
  destination: RideDestination;
  status: RideStatus;
};
export type RideMembers = {
  userId: string;
  name: string;
  phoneNumber: string;
  status: MembershipStatus;
}[];

export type RideMembership = {
  userId: string;
  role: Role;
  status: MembershipStatus;
};

export type RemovedUser = { name: string };

export type ActiveRide = { name: string; status: RideStatus; id: string };

export type CompletedRide = { name: string; status: RideStatus; id: string };
