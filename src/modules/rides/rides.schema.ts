import z from "zod";

export const CreateRidesSchema = z.object({
  destination: z.object({
    name: z.string().nullable(),
    lat: z.number(),
    long: z.number(),
  }),
  rideName: z.string(),
});

export const JoinRideSchema = z.object({
  inviteCode: z.string(),
});

export const FetchMembersSchema = z.object({
  rideId: z.string(),
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
  rideName: z.string(),
  destination: z.object({
    name: z.string().nullable(),
    lat: z.number(),
    long: z.number(),
  }),
});

export const UpdateRideDetailsParamsSchema = z.object({
  rideId: z.string(),
});

export const RegenrateInviteCodeSchema = z.object({
  rideId: z.string(),
});

export const FetchRequestsParamsSchema = z.object({
  rideId: z.string(),
});
