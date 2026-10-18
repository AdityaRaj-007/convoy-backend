import { env } from "../../config/env";
import { PlacesSuggestion } from "./places.types";

export class PlacesService {
  private readonly GOOGLE_PLACES_BASE_URL = "https://places.googleapis.com/v1";
  async placesSuggestions(
    input: string,
    sessionToken?: string,
  ): Promise<PlacesSuggestion[]> {
    const response = await fetch(
      `${this.GOOGLE_PLACES_BASE_URL}/places:autocomplete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": `${env.googleMapApiKey}`,
          "X-Goog-FieldMask":
            "suggestions.placePrediction.placeId,suggestions.placePrediction.text.text",
        },
        body: JSON.stringify({
          input,
          languageCode: "en",
          ...(sessionToken ? { sessionToken } : {}),
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error(
        "Google places autocomplete failed : ",
        response.status,
        error,
      );
      throw new Error("PLACE_SEARCH_FAILED");
    }

    const result = (await response.json()) as {
      suggestions?: {
        placePrediction: { placeId: string; text: { text: string } };
      }[];
    };

    return (result.suggestions ?? [])
      .filter((suggestion) => suggestion.placePrediction)
      .map((suggestion) => ({
        placeId: suggestion.placePrediction.placeId,
        description: suggestion.placePrediction!.text.text,
      }));
  }

  async placeDetails(placeId: string) {}
}
