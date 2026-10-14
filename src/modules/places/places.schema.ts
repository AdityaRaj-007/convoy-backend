import z from "zod";

export const SearchPlacesSchema = z.object({
  input: z.string(),
});

export const PlaceDetailSchema = z.object({
  placeId: z.string(),
});
