import { IRidesRepository } from "./rides.repository";

export class RidesService {
  private readonly ridesRepository: IRidesRepository;

  constructor(ridesRepository: IRidesRepository) {
    this.ridesRepository = ridesRepository;
  }
}
