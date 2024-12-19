
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
import config from "../../config";


// Set up Mongoose connection
beforeAll(async () => {
  await mongoose.connect(config.MONGOURI as string);
 
});

describe("POST /api/auth/register", () => {
  beforeEach(async () => {
    await User.deleteMany({}); // Clear the collection before each test
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Close connection after all tests
  });
  it("should create a new user and return 201 status", async () => {
    const newUser = {
      name: "testuser",
      email: "testuser@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("_id"); // Assuming user ID is returned
    expect(response.body.data.name).toBe(newUser.name);
    expect(response.body.data.email).toBe(newUser.email);
  });
  it("should not allow duplicate email registration", async () => {
    const existingUser = {
      name: "existinguser",
      email: "existing@example.com",
      password: "password123",
    };

    await User.create(existingUser); // Create a user manually

    const response = await request(app)
      .post("/api/auth/register")
      .send(existingUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email already in use");
  });
  it("should return a validation error for invalid data", async () => {
    const invalidUser = {
      name: "noemailuser",
      email: "invalidemail", // Invalid email format
      password: "short", // Password too short
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(invalidUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("errors");
  });
});


