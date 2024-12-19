import dotenv from "dotenv";
dotenv.config();

const MONGOURI =
  process.env.NODE_ENV === "development"
    ? process.env.MONGOCOMPASS
    : process.env.NODE_ENV === "test"
    ? process.env.TESTDB
    : process.env.MONGOATLAS;

export default {
  port: process.env.PORT,
  salt: process.env.SALT_ROUNDS,
  MONGOURI,
  environment: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  // paypal: {
  //   publicKey: process.env.PAYPAL_PUBLIC_KEY,
  //   secretKey: process.env.PAYPAL_SECRET_KEY,
  // },
  // mailchimp: {
  //   apiKey: process.env.MAILCHIMP_API_KEY,
  //   sender: process.env.MAILCHIMP_SENDER,
  // }
};
