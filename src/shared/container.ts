import { prisma } from "../infrastructure/prisma";
import { AuthController } from "../modules/auth/auth.controller";
import { IAuthRepository } from "../modules/auth/auth.repository";
import { AuthService } from "../modules/auth/auth.service";
import { AuthPrismaRepository } from "../modules/auth/repositories/auth.prisma-repository";

const authRepository: IAuthRepository = new AuthPrismaRepository(prisma);
export const authService: AuthService = new AuthService(authRepository);
export const authController: AuthController = new AuthController(authService);
