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

export const UpdateRideStatusSchema = z.object({
  rideId: z.string(),
});

export const UpdateRideDetailsBodySchema = z.object({
  rideName: z.string() || null,
  destination: z.object() || null,
});

export const UpdateRideDetailsParamsSchema = z.object({
  rideId: z.string(),
});

export const RegenrateInviteCodeSchema = z.object({
  rideId: z.string(),
});
