import Router from "express";
import { validate } from "../../middlewares/requestValidationMiddleware";
import {
  AcceptRideRequestSchema,
  CreateRidesSchema,
  JoinRideSchema,
  UpdateRideStatusSchema,
  RejectRideRequestSchema,
  RemoveUserSchema,
  UpdateRideDetailsBodySchema,
  UpdateRideDetailsParamsSchema,
  RegenrateInviteCodeSchema,
  FetchMembersSchema,
  FetchRequestsParamsSchema,
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
  CompleteRide,
  CancelRide,
  UpdateRideDetailsParams,
  UpdateRideDetailsBody,
  FetchMembersParams,
  RegenerateInviteCodeParams,
  FetchRequestParams,
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

router.get<FetchMembersParams, {}, {}>(
  "/:rideId/members",
  validate({ params: FetchMembersSchema }),
  asyncHandler(ridesController.getRideMembers.bind(ridesController)),
);

router.post<AcceptRideRequest, {}, {}>(
  "/:rideId/members/:userId/accept",
  validate({ params: AcceptRideRequestSchema }),
  asyncHandler(ridesController.acceptUserRideRequest.bind(ridesController)),
);

router.post<RejectRideRequest, {}, {}>(
  "/:rideId/members/:userId/reject",
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
  validate({ params: UpdateRideStatusSchema }),
  asyncHandler(ridesController.leaveRide.bind(ridesController)),
);

router.post<StartRide, {}, {}>(
  "/:rideId/start",
  validate({ params: UpdateRideStatusSchema }),
  asyncHandler(ridesController.startRide.bind(ridesController)),
);

router.post<CompleteRide, {}, {}>(
  "/:rideId/complete",
  validate({ params: UpdateRideStatusSchema }),
  asyncHandler(ridesController.completeRide.bind(ridesController)),
);

router.post<CancelRide, {}, {}>(
  "/:rideId/cancel",
  validate({ params: UpdateRideStatusSchema }),
  asyncHandler(ridesController.cancelRide.bind(ridesController)),
);

router.patch<UpdateRideDetailsParams, {}, UpdateRideDetailsBody>(
  "/:rideId",
  validate({
    body: UpdateRideDetailsBodySchema,
    params: UpdateRideDetailsParamsSchema,
  }),
  asyncHandler(ridesController.updateRideDetails.bind(ridesController)),
);

router.post<RegenerateInviteCodeParams, {}, {}>(
  "/:rideId/invite-code/regenerate",
  validate({ params: RegenrateInviteCodeSchema }),
  asyncHandler(ridesController.regenerateInviteCode.bind(ridesController)),
);

router.get<FetchRequestParams, {}, {}>(
  "/:rideId/members/requests",
  validate({ params: FetchRequestsParamsSchema }),
  asyncHandler(ridesController.fetchPendingRequests.bind(ridesController)),
);
export default router;
