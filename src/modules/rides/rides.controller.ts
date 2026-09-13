import { NextFunction, Request, Response } from "express";
import { RidesService } from "./rides.service";
import { CreateRideBody, JoinRideBody } from "./rides.types";

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

  async getRideMembers(req: Request, res: Response, next: NextFunction) {}

  async acceptUserRideRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {}

  async rejectUserRideRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {}

  async removeUserFromRide(req: Request, res: Response, next: NextFunction) {}

  async leaveRide(req: Request, res: Response, next: NextFunction) {}

  async startRide(req: Request, res: Response, next: NextFunction) {}

  async completeRide(req: Request, res: Response, next: NextFunction) {}

  async updateRideDetails(req: Request, res: Response, next: NextFunction) {}

  async regenerateInviteCode(req: Request, res: Response, next: NextFunction) {}
}
