import { env } from "../../config/env";
import { PlaceDetails, PlacesSuggestion } from "./places.types";

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

    console.log("Response : " + response);

    const result = (await response.json()) as {
      suggestions?: {
        placePrediction?: {
          placeId: string;
          text: { text: string };
        };
      }[];
    };

    console.log(JSON.stringify(result));

    return (result.suggestions ?? [])
      .filter((suggestion) => suggestion.placePrediction)
      .map((suggestion) => ({
        placeId: suggestion.placePrediction!.placeId,
        description: suggestion.placePrediction!.text.text,
      }));
  }

  async placeDetails(
    placeId: string,
    sessionToken?: string,
  ): Promise<PlaceDetails> {
    const params = new URLSearchParams();

    if (sessionToken) {
      params.set("sessionToken", sessionToken);
    }

    const query = params.toString();

    const url =
      `${this.GOOGLE_PLACES_BASE_URL}/places/${encodeURIComponent(placeId)}` +
      (query ? `${query}` : "");

    const response = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": `${env.googleMapApiKey}`,
        "X-Goog-FieldMask": "id,displayName,formattedAddress,location",
      },
    });

    if (!response.ok) {
      const error = await response.text();

      console.error("Google places details failed : ", response.status, error);

      throw new Error("PLACE_DETAILS_FAILED");
    }

    const place = (await response.json()) as {
      id: string;
      displayName?: { text: string };
      formattedAddress?: string;
      location?: { latitude: number; longitude: number };
    };

    console.log("Place Details : " + JSON.stringify(place));

    if (!place.location) {
      throw new Error("PLACE_LOCATION_UNAVAILABLE");
    }

    return {
      placeId: place.id,
      name:
        place.displayName?.text ?? place.formattedAddress ?? "Selected Place",
      address: place.formattedAddress ?? "",
      latitude: place.location.latitude,
      longitude: place.location.longitude,
    };
  }
}
