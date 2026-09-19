import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";

export class RideWebSocketGateway {
  private readonly wss: WebSocketServer;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ noServer: true });
    server.on("upgrade", () => {});
  }
}
