import "express-async-errors";
import express, { Application } from "express";

import morgan from "morgan";
import cors from "cors";
import logger from "./utils/logger";
import { error, notFound } from "./middlewares/error";
import authRoutes from "./routes/auth";
import budgetRoutes from "./routes/budget";
import transactionRoutes from "./routes/transaction";


const app: Application = express();
const morganFormat = ":method :url :status :response-time ms";
app.use(express.json()); // Parses JSON requests
app.use(cors({ credentials: true }));
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message:string) => {
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


// Placeholder route
app.use("/api/auth", authRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/transactions", transactionRoutes);
app.use(notFound);
app.use(error);

export default app;
