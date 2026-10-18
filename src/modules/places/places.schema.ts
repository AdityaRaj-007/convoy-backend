import z from "zod";

export const SearchPlacesSchema = z.object({
  input: z.string(),
  sessionToken: z.string().optional(),
});

export const PlaceDetailSchema = z.object({
  placeId: z.string(),
});
