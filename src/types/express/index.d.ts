import { AuthenticatedUser } from "../../modules/auth/auth.types";

declare global {
  namespace Express {
    export interface Request {
      user?: AuthenticatedUser;
    }
  }
}
