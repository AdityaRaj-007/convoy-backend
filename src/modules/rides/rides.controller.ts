import { NextFunction, Request, Response } from "express";
import { RidesService } from "./rides.service";
import {
  AcceptRideRequest,
  CancelRide,
  CompleteRide,
  CreateRideBody,
  FetchMembersParams,
  FetchRequestParams,
  JoinRideBody,
  LeaveRide,
  RegenerateInviteCodeParams,
  RejectRideRequest,
  RemoveUserFromRide,
  StartRide,
  UpdateRideDetailsBody,
  UpdateRideDetailsParams,
} from "./rides.types";

export class RidesController {
  private readonly ridesService: RidesService;

  constructor(ridesService: RidesService) {
    this.ridesService = ridesService;
  }

  async createRide(
    req: Request<{}, {}, CreateRideBody>,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, data: null, error: "UNAUTHORIZED" });
    }
    const { userId } = req.user;

    const { rideName, destination } = req.body;

    const data = await this.ridesService.create(rideName, destination, userId);

    return res.status(201).json({ success: true, data, error: null });
  }

  async getActiveRide(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, data: null, error: "UNAUTHORIZED" });
    }

    const { userId } = req.user;

    const data = await this.ridesService.userActiveRides(userId);

    return res.status(200).json({ success: true, data, error: null });
  }

  async joinRide(
    req: Request<{}, {}, JoinRideBody>,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, data: null, error: "UNAUTHORIZED" });
    }

    const { userId } = req.user;

    const { inviteCode } = req.body;

    const data = await this.ridesService.join(userId, inviteCode);

    return res.status(201).json({ success: true, data, error: null });
  }

  async getRideMembers(
    req: Request<FetchMembersParams, {}, {}>,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, data: null, error: "UNAUTHORIZED" });
    }
    const { userId } = req.user;
    const { rideId } = req.params;

    const data = await this.ridesService.rideMembers(rideId, userId);

    return res.status(200).json({ success: true, data, error: null });
  }

  async acceptUserRideRequest(
    req: Request<AcceptRideRequest, {}, {}>,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, data: null, error: "UNAUTHORIZED" });
    }

    const { userId: ownerId } = req.user;

    const { rideId, userId } = req.params;

    const data = await this.ridesService.acceptUserRequest(
      rideId,
      userId,
      ownerId,
    );

    return res.status(200).json({ success: true, data, error: null });
  }

  async rejectUserRideRequest(
    req: Request<RejectRideRequest, {}, {}>,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, data: null, error: "UNAUTHORIZED" });
    }

    const { userId: ownerId } = req.user;

    const { rideId, userId } = req.params;

    const data = await this.ridesService.rejectUserRequest(
      rideId,
      userId,
      ownerId,
    );

    return res.status(200).json({ success: true, data, error: null });
  }

  async removeUserFromRide(
    req: Request<RemoveUserFromRide, {}, {}>,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, data: null, error: "UNAUTHORIZED" });
    }

    const { userId: ownerId } = req.user;
    const { rideId, userId } = req.params;

    const data = await this.ridesService.removeUser(rideId, userId, ownerId);

    return res.status(200).json({ success: true, data, error: null });
  }

  async leaveRide(
    req: Request<LeaveRide, {}, {}>,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, data: null, error: "UNAUTHORIZED" });
    }

    const { userId } = req.user;
    const { rideId } = req.params;

    const data = await this.ridesService.leaveRide(rideId, userId);

    return res.status(200).json({ success: true, data, error: null });
  }

  async startRide(
    req: Request<StartRide, {}, {}>,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, data: null, error: "UNAUTHORIZED" });
    }

    const { userId } = req.user;

    const { rideId } = req.params;

    const data = await this.ridesService.startRide(rideId, userId);

    return res.status(200).json({ success: true, data, error: null });
  }

  async completeRide(
    req: Request<CompleteRide, {}, {}>,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, data: null, error: "UNAUTHORIZED" });
    }

    const { userId } = req.user;

    const { rideId } = req.params;

    const data = await this.ridesService.completeRide(rideId, userId);

    return res.status(200).json({ success: true, data, error: null });
  }

  async cancelRide(
    req: Request<CancelRide, {}, {}>,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, data: null, error: "UNAUTHORIZED" });
    }

    const { userId } = req.user;

    const { rideId } = req.params;

    const data = await this.ridesService.cancelRide(rideId, userId);

    return res.status(200).json({ success: true, data, error: null });
  }

  async updateRideDetails(
    req: Request<UpdateRideDetailsParams, {}, UpdateRideDetailsBody>,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, data: null, error: "UNAUTHORIZED" });
    }

    const { userId } = req.user;
    const { rideId } = req.params;
    const payload = req.body;

    const data = await this.ridesService.updateRideDetails(
      rideId,
      payload,
      userId,
    );

    return res.status(200).json({ success: true, data, error: null });
  }

  async regenerateInviteCode(
    req: Request<RegenerateInviteCodeParams, {}, {}>,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, data: null, error: "UNAUTHORIZED" });
    }

    const { userId } = req.user;
    const { rideId } = req.params;

    const data = await this.ridesService.regenerateCode(rideId, userId);

    return res.status(200).json({ success: true, data, error: null });
  }

  async fetchPendingRequests(
    req: Request<FetchRequestParams, {}, {}>,
    res: Response,
  ) {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, data: null, error: "UNAUTHORIZED" });
    }
    const { userId } = req.user;
    const { rideId } = req.params;

    const data = await this.ridesService.pendingRequests(rideId, userId);

    return res.status(200).json({ success: true, data, error: null });
  }
}
