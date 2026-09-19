import { WebSocket } from "ws";

export class ConnectionContext {
  private readonly userId: string;
  private readonly rideId: string;
  private readonly socket: WebSocket;

  constructor(userId: string, rideId: string, socket: WebSocket) {
    this.userId = userId;
    this.rideId = rideId;
    this.socket = socket;
  }

  getRideId(): string {
    return this.rideId;
  }

  getUserId(): string {
    return this.userId;
  }

  getSocket(): WebSocket {
    return this.socket;
  }
}
