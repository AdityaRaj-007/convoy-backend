import { ConnectionContext } from "./rides.context";

export class RideConnectionManager {
  private readonly rooms = new Map<string, Set<ConnectionContext>>();

  addConnection(context: ConnectionContext) {
    const rideId = context.getRideId();

    let room = this.rooms.get(rideId);

    if (!room) {
      room = new Set();
      this.rooms.set(rideId, room);
    }

    room.add(context);
  }
  removeConnection(context: ConnectionContext) {
    const rideId = context.getRideId();

    let room = this.rooms.get(rideId);

    if (!room) {
      return;
    }

    room.delete(context);
  }
  getConnections(rideId: string) {
    const room = this.rooms.get(rideId);

    if (!room) {
      return new Set();
    }
    return room;
  }
  hasConnections(rideId: string) {
    const room = this.rooms.get(rideId);

    if (!room || room.size === 0) {
      return false;
    }
    return true;
  }
  removeRideConnections(rideId: string) {
    const room = this.rooms.get(rideId);

    if (!room) {
      return;
    }

    room.forEach((connection) => connection.getSocket().close());

    this.rooms.delete(rideId);
  }
}
