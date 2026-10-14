import Router from "express";
import { PlaceDetailParams, SearchPlacesParams } from "./places.types";
import { validate } from "../../middlewares/requestValidationMiddleware";
import { PlaceDetailSchema, SearchPlacesSchema } from "./places.schema";
import { asyncHandler } from "../../utils/async-handler";
import { placesController } from "../../shared/container";

const router = Router();

router.get<{}, {}, {}, SearchPlacesParams>(
  "/autocomplete",
  validate({ query: SearchPlacesSchema }),
  asyncHandler(placesController.getPlacesResult.bind(placesController)),
);

router.get<{}, {}, {}, PlaceDetailParams>(
  "/details",
  validate({ query: PlaceDetailSchema }),
  asyncHandler(placesController.getPlaceDetails.bind(placesController)),
);

export default router;
