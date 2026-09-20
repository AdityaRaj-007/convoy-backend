import http from "http";
import { Duplex } from "stream";
import { URL } from "url";
import { WebSocketServer } from "ws";
import { RidesService } from "../rides.service";
import { verifyToken } from "../../../utils/verifyToken";
import { RideConnectionHandler } from "./rides.connectionHandler";
import { RideConnectionManager } from "./rides.connectionManger";
import { ConnectionContext } from "./rides.context";
import { LocationService } from "./rides.locationService";

export class RideWebSocketGateway {
  private readonly wss: WebSocketServer;
  private readonly rideService: RidesService;
  private readonly connectionManager: RideConnectionManager;
  private readonly locationService: LocationService;

  constructor(
    server: http.Server,
    service: RidesService,
    connectionManager: RideConnectionManager,
    locationService: LocationService,
  ) {
    this.wss = new WebSocketServer({ noServer: true });
    this.rideService = service;
    this.connectionManager = connectionManager;
    this.locationService = locationService;

    server.on("upgrade", (request, socket, head) => {
      this.handleUpgrade(request, socket, head).catch((error) => {
        console.log("Websocket connection error : " + error);
        socket.destroy();
      });
    });
  }

  private async handleUpgrade(
    request: http.IncomingMessage,
    socket: Duplex,
    head: Buffer,
  ) {
    const rideId = this.getRideId(request);
    console.log("Ride Id : ", rideId);
    if (!rideId) {
      // close the connection
      this.rejectUpgrade(socket, 404, "NOT_FOUND");
      return;
    }

    const rideDetails = await this.rideService.findRideById(rideId);

    if (!rideDetails) {
      // close the connection
      console.log("Ride Not Found");
      this.rejectUpgrade(socket, 404, "NOT_FOUND");
      return;
    }

    if (rideDetails.status !== "ACTIVE") {
      console.log("Ride is not active");
      this.rejectUpgrade(socket, 403, "FORBIDDEN");
      return;
    }

    const authHeader = request.headers["authorization"];

    if (!authHeader) {
      // close the connection
      // throw UNAUTHORIZED error
      console.log("Auth header not found");
      this.rejectUpgrade(socket, 401, "UNAUTHORIZED");
      return;
    }

    const userId = await verifyToken(authHeader);

    if (!userId) {
      // close the connection
      // throw UNAUTHORIZED error
      console.log("user not found");
      this.rejectUpgrade(socket, 401, "UNAUTHORIZED");
      return;
    }

    const membership = await this.rideService.findMembership(rideId, userId);

    if (!membership || membership.status !== "ACTIVE") {
      // throw INVALID_MEMBER_STATUS
      // close connection
      console.log("User is not an active member");
      this.rejectUpgrade(socket, 403, "FORBIDDEN");
      return;
    }

    this.wss.handleUpgrade(request, socket, head, (ws) => {
      const connectionContext = new ConnectionContext(rideId, userId, ws);
      const connectionHandler = new RideConnectionHandler(
        connectionContext,
        this.connectionManager,
        this.locationService,
      );

      connectionHandler.register();
    });
  }

  private getRideId(request: http.IncomingMessage): string | null {
    const url = new URL(request.url ?? "", `http://${request.headers.host}`);
    console.log("URL : " + url);

    return url.pathname.match(/^\/rides\/([^/]+)$/)?.[1] ?? null;
  }

  private rejectUpgrade(socket: Duplex, statusCode: number, message: string) {
    socket.write(
      `HTTP/1.1 ${statusCode} ${message}\r\n` +
        `Connection: close\r\n` +
        `\r\n`,
    );

    socket.destroy();
  }
}
