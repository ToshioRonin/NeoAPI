import { setupSwagger } from "./config/swagger.js";
import routes from "./routes/index.routes.js";
import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
//llamado de las rutas
app.use("/api", routes);

setupSwagger(app);

export default app;