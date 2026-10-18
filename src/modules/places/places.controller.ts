import { Request, Response } from "express";
import { PlacesService } from "./places.service";
import { PlaceDetailParams, SearchPlacesParams } from "./places.types";

export class PlacesController {
  private readonly placesService: PlacesService;

  constructor(placesService: PlacesService) {
    this.placesService = placesService;
  }

  async getPlacesResult(
    req: Request<{}, {}, {}, SearchPlacesParams>,
    res: Response,
  ) {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, data: null, error: "UNAUTHORIZED" });
    }

    const { input, sessionToken } = req.query;

    const data = await this.placesService.placesSuggestions(
      input.trim(),
      sessionToken,
    );

    return res.status(200).json({ success: true, data, error: null });
  }

  async getPlaceDetails(
    req: Request<{}, {}, {}, PlaceDetailParams>,
    res: Response,
  ) {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, data: null, error: "UNAUTHORIZED" });
    }

    const { placeId, sessionToken } = req.query;

    const data = await this.placesService.placeDetails(
      placeId.trim(),
      sessionToken,
    );

    return res.status(200).json({ success: true, data, error: null });
  }
}
