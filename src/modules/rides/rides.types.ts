import z from "zod";
import {
  AcceptRideRequestSchema,
  CreateRidesSchema,
  FetchMembersSchema,
  FetchRequestsParamsSchema,
  JoinRideSchema,
  RegenrateInviteCodeSchema,
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
export type FetchMembersParams = z.infer<typeof FetchMembersSchema>;
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
export type RegenerateInviteCodeParams = z.infer<
  typeof RegenrateInviteCodeSchema
>;
export type FetchRequestParams = z.infer<typeof FetchRequestsParamsSchema>;

export type RideDestination = {
  name?: string | null;
  lat: number;
  long: number;
};
export type RideDetails = {
  rideId: string;
  inviteCode: string;
  destination: RideDestination;
  status: RideStatus;
  createdBy?: string;
};
export type RideMembers = {
  userId: string;
  name: string | null;
  phoneNumber: string;
  role: Role;
}[];

export type RideMembership = {
  userId: string;
  role: Role;
  status: MembershipStatus;
};

export type RemovedUser = { name: string | null; id: string };
export type ActiveRide = { rideName: string; status: RideStatus; id: string };
export type CompletedRide = { name: string; status: RideStatus; id: string };
export type CancelledRide = { name: string; status: RideStatus; id: string };
export type RequestDetails = {
  userId: string;
  status: MembershipStatus;
  name: string | null;
  phoneNumber: string;
};

export type CurrentRideDetails = RideDetails & {
  membership: { role: Role; status: MembershipStatus };
};

export type LocationUpdate = {
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: number;
};
