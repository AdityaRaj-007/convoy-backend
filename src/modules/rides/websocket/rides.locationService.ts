import { redis } from "../../../infrastructure/redis";
import { RideEventBroadcaster } from "./rides.broadcast";

export class LocationService {
  private readonly eventBroadcaster: RideEventBroadcaster;

  constructor(broadcaster: RideEventBroadcaster) {
    this.eventBroadcaster = broadcaster;
  }
  async updateLocation(
    rideId: string,
    userId: string,
    payload: { latitude: number; longitude: number },
  ) {
    const location = {
      latitude: payload.latitude,
      longitude: payload.longitude,
      timestamp: Date.now(),
    };
    await redis.hset(
      `ride:location:${rideId}`,
      userId,
      JSON.stringify(location),
    );

    // call the broadcast function to send it to other users
    const broadcastMessage = { userId, ...location };
    this.eventBroadcaster.broadcastMessage(rideId, broadcastMessage);
  }
}
