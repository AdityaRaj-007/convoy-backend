import express from "express";
import authRouter from "./modules/auth/auth.routes";
import ridesRouter from "./modules/rides/rides.routes";
import { authenticate } from "./middlewares/authenticationMiddleware";

const app = express();

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/ride", authenticate, ridesRouter);

export default app;
