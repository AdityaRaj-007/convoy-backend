import express from "express";
import authRouter from "./modules/auth/auth.routes";
import ridesRouter from "./modules/rides/rides.routes";
import { authenticate } from "./middlewares/authenticationMiddleware";
import placesRouter from "./modules/places/places.routes";

const app = express();

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/rides", authenticate, ridesRouter);
app.use("/api/places", authenticate, placesRouter);

export default app;
