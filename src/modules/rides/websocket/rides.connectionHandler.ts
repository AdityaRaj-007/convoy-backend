import { RawData } from "ws";
import { RideConnectionManager } from "./rides.connectionManger";
import { ConnectionContext } from "./rides.context";

export class RideConnectionHandler {
  private readonly context: ConnectionContext;
  private readonly connectionManager: RideConnectionManager;

  constructor(context: ConnectionContext, manager: RideConnectionManager) {
    this.context = context;
    this.connectionManager = manager;
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

    socket.on("error", () => {
      this.handleError();
    });
  }

  handleMessage(message: RawData) {
    try {
      const msg = JSON.parse(message.toString());
      const ws = this.context.getSocket();
      switch (msg.type) {
        case "LOCATION_UPDATE":
          // call the broadcast message function
          // also update the location for the user who sent this message
          break;
        case "PING":
          ws.send(JSON.stringify({ type: "PONG" }));
          break;
        default:
          this.handleError();
      }
    } catch (err) {
      this.handleError();
    }
  }

  handleClose() {
    this.connectionManager.removeConnection(this.context);
  }

  handleError() {
    console.error();
  }
}
