

import connectToDb from "./utils/connectToDb";
import app from "./app";
import config from "./config";
import logger from "./utils/logger";

const PORT = config.port || 7000
connectToDb()
app.listen(PORT,()=>{
    logger.info(`App has started on port ${PORT}`)
 
})