
import {
    describe,
    it,
    expect,
    beforeEach,
    afterAll,
    beforeAll,
    
  } from "vitest";
  import request from "supertest"; // To test HTTP endpoints
  import app from "../../app";
  import mongoose from "mongoose";
  import User from "../../models/user";
  import { comparePassword, hashPassword } from "../../utils/helpers";
import config from "../../config";


  // Set up Mongoose connection
  beforeAll(async () => {
    
      
    await mongoose.connect(config.MONGOURI as string);
    console.log("Test Db connected")
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
        await User.deleteMany({}); // Clear the collection before each test
      });
      afterAll(async () => {
      await mongoose.connection.close();
    });
    it("Should return 200 and token if login is succesful", async () => {
      const password="password123"
      const hashedPassword = await hashPassword(password)
    
    
      await User.create({
        email: "newUser@gmail.com",
        name: "newUser",
        password: hashedPassword,
      });
  
      const resp = await request(app)
        .post("/api/auth/login")
        .send({
          email: "newUser@gmail.com",
          password: "password123",
        });
  
      expect(resp.status).toBe(200);
      expect(resp.body).toHaveProperty("token")
  
    });
  
  
    it("Should return 401 if email does not exist", async () => {
      const resp = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@gmail.com",
          password: "password123",
        });
  
      expect(resp.status).toBe(401);
      expect(resp.body.error).toBe("Invalid credentials");
    });
  
    it("Should return 401 if password is incorrect", async () => {
      const password = "password123";
      const hashedPassword = await hashPassword(password)
  
      const newUser = await User.create({
        email: "newUser@gmail.com",
        name: "newUser",
        password: hashedPassword,
      });
  
      const resp = await request(app)
        .post("/api/auth/login")
        .send({
          email: "newUser@gmail.com",
          password: "wrongpassword",
        });
  
      expect(resp.status).toBe(401);
      expect(resp.body.error).toBe("Invalid credentials");
    });
  
    it("Should validate that the comparePassword function works correctly", async () => {
      const password = "password123";
      const hashedPassword = await hashPassword(password)
  
      const isMatch = await comparePassword("password123", hashedPassword);
      expect(isMatch).toBe(true);
  
      const isNotMatch = await comparePassword("wrongpassword", hashedPassword);
      expect(isNotMatch).toBe(false);
    });
  });