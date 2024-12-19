import config from "../config";
import { connect } from "mongoose";
import logger from "./logger";


const connectToDb = async () => {
  try {
   
    await connect(config.MONGOURI as string);
    logger.info("MongoDB connected Succesfully")
    
  } catch (error) {
    
    logger.error("Something went wrong while connecting to MongoDb")
    console.log(error)
    throw new Error("error");
  }
};

export default connectToDb;
