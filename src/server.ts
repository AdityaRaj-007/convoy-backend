import app from "./app";
import http from "http";
import { RideWebSocketGateway } from "./modules/rides/websocket/rides.gateway";
import {
  locationService,
  rideConnectionManger,
  ridesService,
} from "./shared/container";

const PORT = 3000;
const httpServer = http.createServer(app);
const websocketGateway = new RideWebSocketGateway(
  httpServer,
  ridesService,
  rideConnectionManger,
  locationService,
);

httpServer.listen(PORT, () => {
  console.log(`Server is listening on PORT : ${PORT}`);
});
