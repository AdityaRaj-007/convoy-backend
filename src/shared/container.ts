import { prisma } from "../infrastructure/prisma";
import { AuthController } from "../modules/auth/auth.controller";
import { IAuthRepository } from "../modules/auth/auth.repository";
import { AuthService } from "../modules/auth/auth.service";
import { AuthPrismaRepository } from "../modules/auth/repositories/auth.prisma-repository";
import { PrismaRidesRepository } from "../modules/rides/repositories/rides.prisma-repository";
import { RidesController } from "../modules/rides/rides.controller";
import { IRidesRepository } from "../modules/rides/rides.repository";
import { RidesService } from "../modules/rides/rides.service";

const authRepository: IAuthRepository = new AuthPrismaRepository(prisma);
export const authService: AuthService = new AuthService(authRepository);
export const authController: AuthController = new AuthController(authService);

const ridesRepository: IRidesRepository = new PrismaRidesRepository(prisma);
export const ridesService: RidesService = new RidesService(ridesRepository);
export const ridesController: RidesController = new RidesController(
  ridesService,
);
