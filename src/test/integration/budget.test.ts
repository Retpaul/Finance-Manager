import { describe, it, expect, beforeEach, afterAll, beforeAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import config from "../../config";
import Budget from "../../models/budget";
import app from "../../app";

describe("POST /api/budgets", () => {
  beforeAll(async () => {
    await mongoose.connect(config.MONGOURI as string);
  });
  beforeEach(async () => {
    await Budget.deleteMany({});
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
  it("Should return 201 and data if successful", async () => {
    const newBudget = {
      title: "New Budget",
      total_amount: 500,
      duration: "weekly",
    };
    const res = await request(app).post("/api/budgets").send(newBudget);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Budget created successfully");
    expect(res.body.data).toHaveProperty("title", "New Budget");
    expect(res.body.data).toHaveProperty("duration", "weekly");
    expect(res.body.data).toHaveProperty("total_amount", 500);
    expect(res.body.data).toHaveProperty("ownerId");
  });
  it("should return 400 if 'duration' is missing", async () => {
    const payload = { title: "New Budget", total_amount: 500 };

    const res = await request(app).post("/api/budgets").send(payload);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if 'total_amount' is missing", async () => {
    const payload = { title: "New Budget", duration: "weekly" };

    const res = await request(app).post("/api/budgets").send(payload);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if 'title' is missing", async () => {
    const payload = { duration: "weekly", total_amount: 500 };

    const res = await request(app).post("/api/budgets").send(payload);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});

describe("GET /api/budgets", () => {
  beforeAll(async () => {
    await mongoose.connect(config.MONGOURI as string);
  });
  beforeEach(async () => {
    await Budget.deleteMany({});
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("Should return 200 and all the budgets data", async () => {
    await Budget.insertMany([
      { title: "Budget1", total_amount: 200, duration: "weekly" },
      { title: "Budget2", total_amount: 500, duration: "monthly" },
      { title: "Budget3", total_amount: 1000, duration: "yearly" },
    ]);

    const res = await request(app).get("/api/budgets");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });
  it("Should return an empty array if there are no budgets", async () => {
    const res = await request(app).get("/api/budgets");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

describe("GET /api/budgets/:budgetId", function () {
  beforeAll(async () => {
    await mongoose.connect(config.MONGOURI as string);
  });
  beforeEach(async () => {
    await Budget.deleteMany({});
    await Budget.create({
      _id: "5f5c7f3d5d1e7b3a1c2b1234",
      title: "New Budget",
      total_amount: 200,
      duration: "weekly",
    });
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should return budget data when a valid budget ID is provided", async () => {
    const response = await request(app).get(
      "/api/budgets/5f5c7f3d5d1e7b3a1c2b1234"
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title", "New Budget");
    expect(response.body).toHaveProperty("total_amount", 200);
    expect(response.body).toHaveProperty("duration", "weekly");
    expect(response.body).toHaveProperty("ownerId");
  });
  it("should return 404 if budget is not found", async () => {
    const response = await request(app).get(
      "/api/budgets/5f5c7f3d5d1e7b3a1c2b5678"
    );
    expect(response.status).toBe(404);
  });
});

describe("PUT /api/budgets/:budgetId", function () {
  beforeAll(async () => {
    await mongoose.connect(config.MONGOURI as string);
  });
  beforeEach(async () => {
    await Budget.deleteMany({});
    await Budget.create({
      _id: "5f5c7f3d5d1e7b3a1c2b1234",
      title: "Budget",
      total_amount: 200,
      duration: "weekly",
    });
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should update budget data and send updated data as response", async () => {
    const response = await request(app)
      .put("/api/budgets/5f5c7f3d5d1e7b3a1c2b1234")
      .send({
        title: "New Budget",
        total_amount: 300,
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title", "New Budget");
    expect(response.body).toHaveProperty("total_amount", 300);
    expect(response.body).toHaveProperty("duration", "weekly");
  });
  it("should return 404 if budget is not found", async () => {
    const response = await request(app).put(
      "/api/budgets/5f5c7f3d5d1e7b3a1c2b5678"
    );
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});

describe("DELETE /api/budgets/:budgetId", function () {
  beforeAll(async () => {
    await mongoose.connect(config.MONGOURI as string);
  });
  beforeEach(async () => {
    await Budget.deleteMany({});
    await Budget.create({
      _id: "5f5c7f3d5d1e7b3a1c2b1234",
      title: "Budget",
      total_amount: 200,
      duration: "weekly",
    });
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should return budget data when a valid budget ID is provided", async () => {
    const response = await request(app).get(
      "/api/budgets/5f5c7f3d5d1e7b3a1c2b1234"
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title", "Budget");
    expect(response.body).toHaveProperty("total_amount", 200);
    expect(response.body).toHaveProperty("duration", "weekly");
  });
  it("should return status 200 and message after deleting budget data ", async () => {
    const response = await request(app).delete(
      "/api/budgets/5f5c7f3d5d1e7b3a1c2b1234"
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Budget deleted succesfully");
  });
  it("should delete budget data and should return 404 when trying to get that budget", async () => {
    await request(app).delete("/api/budgets/5f5c7f3d5d1e7b3a1c2b1234");

    const response = await request(app).get(
      "/api/budgets/5f5c7f3d5d1e7b3a1c2b1234"
    );
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
  it("should return 404 if budget is not found", async () => {
    const response = await request(app).delete(
      "/api/budgets/5f5c7f3d5d1e7b3a1c2b5678"
    );
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});
