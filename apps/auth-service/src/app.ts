import cors from "cors";
import express from "express";
import { errorMiddleware } from "./middleware/error.middleware";
import { authRoutes } from "./routes/auth.routes";
import { userRoutes } from "./routes/user.routes";
import { loggingMiddleware, requestIdMiddleware } from "@shared/index";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(requestIdMiddleware);
app.use(loggingMiddleware);

app.use("/auth", authRoutes());
app.use("/users", userRoutes());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "auth-service" });
});

app.use(errorMiddleware);
