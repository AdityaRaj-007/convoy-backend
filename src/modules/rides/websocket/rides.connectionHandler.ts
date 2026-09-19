import { RawData, WebSocket } from "ws";
import { RideConnectionManager } from "./rides.connectionManger";
import { ConnectionContext } from "./rides.context";
import { WebsocketMessageSchema } from "../rides.schema";
import { LocationService } from "./rides.locationService";

export class RideConnectionHandler {
  private readonly context: ConnectionContext;
  private readonly connectionManager: RideConnectionManager;
  private readonly locationService: LocationService;

  constructor(
    context: ConnectionContext,
    manager: RideConnectionManager,
    locationService: LocationService,
  ) {
    this.context = context;
    this.connectionManager = manager;
    this.locationService = locationService;
  }

  register() {
    this.connectionManager.addConnection(this.context);

    const socket = this.context.getSocket();

    socket.on("message", (message) => {
      this.handleMessage(message);
    });

    socket.on("close", () => {
      this.handleClose();
    });

    socket.on("error", (error) => {
      this.handleError(error);
    });
  }

  async handleMessage(message: RawData) {
    try {
      const msg = JSON.parse(message.toString());
      const parsedMessage = WebsocketMessageSchema.parse(msg);
      const ws = this.context.getSocket();
      switch (parsedMessage.type) {
        case "LOCATION_UPDATE": {
          const rideId = this.context.getRideId();
          const userId = this.context.getUserId();
          const payload = parsedMessage.payload;
          await this.locationService.updateLocation(rideId, userId, payload);
          break;
        }
        case "PING":
          ws.send(JSON.stringify({ type: "PONG" }));
          break;
        default:
          this.sendError("INVALID_MSG_TYPE");
      }
    } catch (err) {
      this.sendError("INVALID_REQUEST");
    }
  }

  handleClose() {
    this.connectionManager.removeConnection(this.context);
  }

  sendError(errorType: string) {
    const ws = this.context.getSocket();

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "error", payload: { code: errorType } }));
    }
  }

  handleError(error: Error) {
    console.error("Websocket Error", {
      error,
      userId: this.context.getUserId(),
      rideId: this.context.getRideId(),
    });
  }
}
