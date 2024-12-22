import { describe, it, expect, beforeEach, afterAll, beforeAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import config from "../../config";
import Transaction from "../../models/transaction";
import app from "../../app";

describe("POST /api/transactions", () => {
  beforeAll(async () => {
    await mongoose.connect(config.MONGOURI as string);
  });
  beforeEach(async () => {
    await Transaction.deleteMany({});
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
  it("Should return 201 and data if successful", async () => {
    const newTransaction = {
      category: "New Transaction",
      amount: 500,
      narration: "This transaction happens weekly",
    };
    const res = await request(app).post("/api/transactions").send(newTransaction);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Transaction created successfully");
    expect(res.body.data).toHaveProperty("category", "New Transaction");
    expect(res.body.data).toHaveProperty("narration", "This transaction happens weekly");
    expect(res.body.data).toHaveProperty("amount", 500);
  });
  it("should return 400 if 'narration' is missing", async () => {
    const payload = { category: "New Transaction", amount: 500 };

    const res = await request(app).post("/api/transactions").send(payload);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error"); 
  });

  it("should return 400 if 'amount' is missing", async () => {
    const payload = { category: "New Transaction", narration: "This transaction happens weekly" };

    const res = await request(app).post("/api/transactions").send(payload);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if 'category' is missing", async () => {
    const payload = { narration: "This transaction happens weekly", amount: 500 };

    const res = await request(app).post("/api/transactions").send(payload);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});

describe("GET /api/transactions", () => {
  beforeAll(async () => {
    await mongoose.connect(config.MONGOURI as string);
  });
  beforeEach(async () => {
    await Transaction.deleteMany({});
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("Should return 200 and all the transactions data", async () => {
    await Transaction.insertMany([
      { category: "Transaction1", amount: 200, narration: "weekly" },
      { category: "Transaction2", amount: 500, narration: "monthly" },
      { category: "Transaction3", amount: 1000, narration: "yearly" },
    ]);

    const res = await request(app).get("/api/transactions");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
  });
  it("Should return an empty array if there are no transactions", async () => {
    const res = await request(app).get("/api/transactions");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });
});

describe("GET /api/transactions/:transactionId", function () {
  beforeAll(async () => {
    await mongoose.connect(config.MONGOURI as string);
  });
  beforeEach(async () => {
    await Transaction.deleteMany({});
    await Transaction.create({
      _id: "5f5c7f3d5d1e7b3a1c2b1234",
      category: "New Transaction",
      amount: 200,
      narration: "weekly",
    });
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should return transaction data when a valid transaction ID is provided", async () => {
    const response = await request(app).get(
      "/api/transactions/5f5c7f3d5d1e7b3a1c2b1234"
    );
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("category", "New Transaction");
    expect(response.body.data).toHaveProperty("amount", 200);
    expect(response.body.data).toHaveProperty("narration", "weekly");
  });
  it("should return 404 if transaction is not found", async () => {
    const response = await request(app).get(
      "/api/transactions/5f5c7f3d5d1e7b3a1c2b5678"
    );
    expect(response.status).toBe(404);
  });
});

describe("PUT /api/transactions/:transactionId", function () {
  beforeAll(async () => {
    await mongoose.connect(config.MONGOURI as string);
  });
  beforeEach(async () => {
    await Transaction.deleteMany({});
    await Transaction.create({
      _id: "5f5c7f3d5d1e7b3a1c2b1234",
      category: "Transaction",
      amount: 200,
      narration: "weekly",
    });
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should update transaction data and send updated data as response", async () => {
    const response = await request(app)
      .put("/api/transactions/5f5c7f3d5d1e7b3a1c2b1234")
      .send({
        category: "New Transaction",
        amount: 300,
      });
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("category", "New Transaction");
    expect(response.body.data).toHaveProperty("amount", 300);
    expect(response.body.data).toHaveProperty("narration", "weekly");
  });
  it("should return 404 if transaction is not found", async () => {
    const response = await request(app).put(
      "/api/transactions/5f5c7f3d5d1e7b3a1c2b5678"
    );
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});

describe("DELETE /api/transactions/:transactionId", function () {
  beforeAll(async () => {
    await mongoose.connect(config.MONGOURI as string);
  });
  beforeEach(async () => {
    await Transaction.deleteMany({});
    await Transaction.create({
      _id: "5f5c7f3d5d1e7b3a1c2b1234",
      category: "Transaction",
      amount: 200,
      narration: "weekly",
    });
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should return transaction data when a valid transaction ID is provided", async () => {
    const response = await request(app).get(
      "/api/transactions/5f5c7f3d5d1e7b3a1c2b1234"
    );
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("category", "Transaction");
    expect(response.body.data).toHaveProperty("amount", 200);
    expect(response.body.data).toHaveProperty("narration", "weekly");
  });
  it("should return status 200 and message after deleting transaction data ", async () => {
    const response = await request(app).delete(
      "/api/transactions/5f5c7f3d5d1e7b3a1c2b1234"
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Transaction deleted succesfully");
  });
  it("should delete transaction data and should return 404 when trying to get that transaction", async () => {
    await request(app).delete("/api/transactions/5f5c7f3d5d1e7b3a1c2b1234");

    const response = await request(app).get(
      "/api/transactions/5f5c7f3d5d1e7b3a1c2b1234"
    );
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
  it("should return 404 if transaction is not found", async () => {
    const response = await request(app).delete(
      "/api/transactions/5f5c7f3d5d1e7b3a1c2b5678"
    );
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});
