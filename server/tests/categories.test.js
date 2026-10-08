import request from "supertest";
import Category from "../src/models/Category.js";

import {
    connectTestDatabase,
    clearTestDatabase,
    closeTestDatabase,
} from "./helpers/testDatabase.js";

const { default: app } =
    await import("../src/app.js");

beforeAll(async () => {
    await connectTestDatabase();
});

afterEach(async () => {
    await clearTestDatabase();
});

afterAll(async () => {
    await closeTestDatabase();
});

describe("Category API", () => {
    test("POST /api/categories should create a category", async () => {
        const response = await request(app)
            .post("/api/categories")
            .send({
                name: "Electronics",
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.name).toBe(
            "Electronics",
        );

        expect(response.body).toHaveProperty(
            "_id",
        );
    });

    test("POST /api/categories should reject missing name", async () => {
        const response = await request(app)
            .post("/api/categories")
            .send({});

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            message: "Category name is required",
        });
    });

    test("POST /api/categories should reject duplicate category", async () => {
        await Category.create({
            name: "Electronics",
        });

        const response = await request(app)
            .post("/api/categories")
            .send({
                name: "Electronics",
            });

        expect(response.statusCode).toBe(409);

        expect(response.body).toEqual({
            message: "Category already exists",
        });
    });

    test("GET /api/categories should return all categories", async () => {
        await Category.create({
            name: "Electronics",
        });

        await Category.create({
            name: "Furniture",
        });

        const response = await request(app)
            .get("/api/categories");

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveLength(2);

        expect(response.body[0]).toHaveProperty(
            "name",
        );
    });

    test("GET /api/categories should return an empty array when no categories exist", async () => {
        const response = await request(app)
            .get("/api/categories");

        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual([]);
    });
});