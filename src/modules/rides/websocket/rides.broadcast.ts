import { WebSocket } from "ws";
import { RideConnectionManager } from "./rides.connectionManger";
import { LocationUpdate } from "../rides.types";

export class RideEventBroadcaster {
  private readonly rideConnectionManager: RideConnectionManager;

  constructor(connectionManager: RideConnectionManager) {
    this.rideConnectionManager = connectionManager;
  }

  broadcastMessage(rideId: string, location: LocationUpdate) {
    const connections = this.rideConnectionManager.getConnections(rideId);

    for (const connection of connections) {
      if (
        connection.getUserId() !== location.userId &&
        connection.getSocket().readyState === WebSocket.OPEN
      ) {
        connection
          .getSocket()
          .send(
            JSON.stringify({ type: "LOCATION_UPDATED", payload: location }),
          );
      }
    }
  }
}
