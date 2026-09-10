import z from "zod";
import {
  AcceptRideRequestSchema,
  CreateRidesSchema,
  JoinRideSchema,
  LeaveRideSchema,
  RejectRideRequestSchema,
  RemoveUserSchema,
  StartRideSchema,
} from "./rides.schema";

export type CreateRideBody = z.infer<typeof CreateRidesSchema>;
export type JoinRideBody = z.infer<typeof JoinRideSchema>;
export type AcceptRideRequest = z.infer<typeof AcceptRideRequestSchema>;
export type RejectRideRequest = z.infer<typeof RejectRideRequestSchema>;
export type RemoveUserFromRide = z.infer<typeof RemoveUserSchema>;
export type LeaveRide = z.infer<typeof LeaveRideSchema>;
export type StartRide = z.infer<typeof StartRideSchema>;
