import z from "zod";

export const CreateRidesSchema = z.object({
  destination: z.object(),
});

export const JoinRideSchema = z.object({
  inviteCode: z.string(),
});

export const AcceptRideRequestSchema = z.object({
  rideId: z.string(),
  userId: z.string(),
});

export const RejectRideRequestSchema = z.object({
  rideId: z.string(),
  userId: z.string(),
});

export const RemoveUserSchema = z.object({
  rideId: z.string(),
  userId: z.string(),
});

export const LeaveRideSchema = z.object({
  rideId: z.string(),
});

export const StartRideSchema = z.object({
  rideId: z.string(),
});
