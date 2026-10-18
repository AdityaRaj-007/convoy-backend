import z from "zod";
import { PlaceDetailSchema, SearchPlacesSchema } from "./places.schema";

export type SearchPlacesParams = z.infer<typeof SearchPlacesSchema>;
export type PlaceDetailParams = z.infer<typeof PlaceDetailSchema>;

export type PlacesSuggestion = {
  placeId: string;
  description: string;
};
