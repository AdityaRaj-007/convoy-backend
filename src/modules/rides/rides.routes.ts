import Router from "express";
import { validate } from "../../middlewares/requestValidationMiddleware";
import {
  AcceptRideRequestSchema,
  CreateRidesSchema,
  JoinRideSchema,
  LeaveRideSchema,
  RejectRideRequestSchema,
  RemoveUserSchema,
  StartRideSchema,
} from "./rides.schema";
import { ridesController } from "../../shared/container";
import { asyncHandler } from "../../utils/async-handler";
import {
  CreateRideBody,
  JoinRideBody,
  AcceptRideRequest,
  RejectRideRequest,
  RemoveUserFromRide,
  LeaveRide,
  StartRide,
} from "./rides.types";

const router = Router();

router.post<{}, {}, CreateRideBody>(
  "/",
  validate({ body: CreateRidesSchema }),
  asyncHandler(ridesController.createRide.bind(ridesController)),
);

router.get(
  "/active",
  asyncHandler(ridesController.getActiveRide.bind(ridesController)),
);

router.post<{}, {}, JoinRideBody>(
  "/join",
  validate({ body: JoinRideSchema }),
  asyncHandler(ridesController.joinRide.bind(ridesController)),
);

router.get(
  "/:rideId/members",
  asyncHandler(ridesController.getRideMembers.bind(ridesController)),
);

router.post<AcceptRideRequest, {}, {}>(
  "/:rideId/member/:userId/accept",
  validate({ params: AcceptRideRequestSchema }),
  asyncHandler(ridesController.acceptUserRideRequest.bind(ridesController)),
);

router.post<RejectRideRequest, {}, {}>(
  "/:rideId/member/:userId/reject",
  validate({ params: RejectRideRequestSchema }),
  asyncHandler(ridesController.rejectUserRideRequest.bind(ridesController)),
);

router.delete<RemoveUserFromRide, {}, {}>(
  "/:rideId/members/:userId",
  validate({ params: RemoveUserSchema }),
  asyncHandler(ridesController.removeUserFromRide.bind(ridesController)),
);

router.post<LeaveRide, {}, {}>(
  "/:rideId/leave",
  validate({ params: LeaveRideSchema }),
  asyncHandler(ridesController.leaveRide.bind(ridesController)),
);

router.post<StartRide, {}, {}>(
  "/:rideId/start",
  validate({ params: StartRideSchema }),
  asyncHandler(ridesController.startRide.bind(ridesController)),
);
export default router;
