import "express-async-errors";
import express, { Application } from "express";

import morgan from "morgan";
import logger from "./utils/logger";
import { error, notFound } from "./middlewares/error";
import authRoutes from "./routes/auth";

const app: Application = express();
const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.use(express.json()); // Parses JSON requests
// Placeholder route
app.use("/api/auth",authRoutes)
app.use(notFound);
app.use(error);

export default app;
