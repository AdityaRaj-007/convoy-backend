import { RidesService } from "./rides.service";

export class RidesController {
  private readonly ridesService: RidesService;

  constructor(ridesService: RidesService) {
    this.ridesService = ridesService;
  }
}
