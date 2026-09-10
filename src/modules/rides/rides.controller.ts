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
  ) {}

  async getActiveRide(req: Request, res: Response, next: NextFunction) {}

  async joinRide(
    req: Request<{}, {}, JoinRideBody>,
    res: Response,
    next: NextFunction,
  ) {}

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
}
