import { jest } from "@jest/globals";
import request from "supertest";

import Item from "../src/models/Item.js";
import Category from "../src/models/Category.js";

import {
    connectTestDatabase,
    clearTestDatabase,
    closeTestDatabase,
} from "./helpers/testDatabase.js";

jest.unstable_mockModule(
    "../src/services/phoneService.js",
    () => ({
        validatePhoneNumber: jest.fn(),
    }),
);

const { validatePhoneNumber } =
    await import("../src/services/phoneService.js");

const { default: app } =
    await import("../src/app.js");

beforeAll(async () => {
    await connectTestDatabase();
});

afterEach(async () => {
    await clearTestDatabase();
    jest.resetAllMocks();
});

afterAll(async () => {
    await closeTestDatabase();
});

const createTestCategory = async () => {
    return await Category.create({
        name: "Electronics",
    });
};

describe("Main API", () => {
    test("GET / should return API status", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
            message: "Main API is running",
        });
    });

    test("POST /api/items should reject missing name", async () => {
        const response = await request(app)
            .post("/api/items")
            .send({
                description: "Development laptop",
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            message: "Name is required",
        });
    });

    test("POST /api/items should create an item without a mobile number", async () => {
        const category = await createTestCategory();

        const response = await request(app)
            .post("/api/items")
            .send({
                name: "Laptop",
                description: "Development laptop",
                category: category._id.toString(),
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.name).toBe("Laptop");

        expect(response.body.description).toBe(
            "Development laptop",
        );

        expect(response.body.mobileNumber).toBeNull();

        expect(response.body.category.name).toBe(
            "Electronics",
        );

        expect(
            validatePhoneNumber,
        ).not.toHaveBeenCalled();
    });

    test("POST /api/items should validate and create an item with a mobile number", async () => {
        const category = await createTestCategory();

        validatePhoneNumber.mockResolvedValue({
            countryCode: "LB",
            countryName: "Lebanon",
            operatorName: "Touch",
        });

        const response = await request(app)
            .post("/api/items")
            .send({
                name: "Phone",
                description: "Test phone",
                mobileNumber: "+96181987156",
                category: category._id.toString(),
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.mobileNumber).toBe(
            "+96181987156",
        );

        expect(response.body.category.name).toBe(
            "Electronics",
        );

        expect(
            validatePhoneNumber,
        ).toHaveBeenCalledWith(
            "+96181987156",
        );
    });

    test("POST /api/items should reject an invalid mobile number", async () => {
        const category = await createTestCategory();

        validatePhoneNumber.mockRejectedValue({
            response: {
                status: 400,
            },
        });

        const response = await request(app)
            .post("/api/items")
            .send({
                name: "Phone",
                description: "Test phone",
                mobileNumber: "123",
                category: category._id.toString(),
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            message: "Invalid mobile number",
        });
    });

    test("POST /api/items should handle unavailable phone service", async () => {
        const category = await createTestCategory();

        validatePhoneNumber.mockRejectedValue({
            response: {
                status: 503,
            },
        });

        const response = await request(app)
            .post("/api/items")
            .send({
                name: "Phone",
                description: "Test phone",
                mobileNumber: "+96181987156",
                category: category._id.toString(),
            });

        expect(response.statusCode).toBe(503);

        expect(response.body).toEqual({
            message:
                "Phone validation service is unavailable",
        });
    });

    test("GET /api/items should return all items", async () => {
        const category = await createTestCategory();

        await Item.create({
            name: "Laptop",
            description: "Development laptop",
            category: category._id,
        });

        await Item.create({
            name: "Keyboard",
            description: "Mechanical keyboard",
            category: category._id,
        });

        const response = await request(app)
            .get("/api/items");

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveLength(2);

        expect(response.body[0].category.name).toBe(
            "Electronics",
        );
    });

    test("PUT /api/items/:id should update an item", async () => {
        const category = await createTestCategory();

        const item = await Item.create({
            name: "Laptop",
            description: "Old description",
            category: category._id,
        });

        const response = await request(app)
            .put(`/api/items/${item._id}`)
            .send({
                name: "Gaming Laptop",
                description: "Updated description",
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.name).toBe(
            "Gaming Laptop",
        );

        expect(response.body.description).toBe(
            "Updated description",
        );

        expect(response.body.category.name).toBe(
            "Electronics",
        );
    });

    test("PUT /api/items/:id should reject an invalid item ID", async () => {
        const response = await request(app)
            .put("/api/items/not-a-valid-id")
            .send({
                name: "Laptop",
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            message: "Invalid item ID",
        });
    });

    test("PUT /api/items/:id should return 404 when item does not exist", async () => {
        const fakeId = "507f1f77bcf86cd799439011";

        const response = await request(app)
            .put(`/api/items/${fakeId}`)
            .send({
                name: "Laptop",
            });

        expect(response.statusCode).toBe(404);

        expect(response.body).toEqual({
            message: "Item not found",
        });
    });

    test("DELETE /api/items/:id should delete an item", async () => {
        const category = await createTestCategory();

        const item = await Item.create({
            name: "Laptop",
            description: "Development laptop",
            category: category._id,
        });

        const response = await request(app)
            .delete(`/api/items/${item._id}`);

        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
            message: "Item deleted successfully",
        });

        const deletedItem = await Item.findById(
            item._id,
        );

        expect(deletedItem).toBeNull();
    });

    test("DELETE /api/items/:id should return 404 when item does not exist", async () => {
        const fakeId = "507f1f77bcf86cd799439011";

        const response = await request(app)
            .delete(`/api/items/${fakeId}`);

        expect(response.statusCode).toBe(404);

        expect(response.body).toEqual({
            message: "Item not found",
        });
    });
});