import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";

import { getAuthToken, getPostToken, resetDB } from "./controllers/_other.controller.js";

import auth from "./middleware/auth.js";

import usersRoutes from "./routes/users.routes.js";
import campaignsRoutes from "./routes/campaigns.routes.js";

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.get("/", (_, res) => res.send("App is running"));
app.get("/auth-token", getAuthToken);
app.get("/post-token", getPostToken);
app.post("/reset-db", resetDB);

app.use(auth);

app.use("/users", usersRoutes);
app.use("/campaigns", campaignsRoutes);

const CONNECTION_URL = "mongodb://localhost:27017";
const PORT = 3000;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch((err) => console.error(err.message));
