import { UserDetails } from "./auth.types";

export interface IAuthRepository {
  createUser(phoneNumber: string, name: string): Promise<UserDetails>;
  findUser(phoneNumber: string): Promise<UserDetails | null>;
}
