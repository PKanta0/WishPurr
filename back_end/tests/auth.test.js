// back_end/__tests__/auth.test.js
const request = require("supertest");
const app = require("../src/app");
const db = require("../src/config/db");
const bcrypt = require("bcrypt");

describe("Auth Module", () => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    const testUser = {
        username: "jestUser",
        email: uniqueEmail,
        password: "123456",
    };

    afterAll(async () => {
        // ลบ user ทดสอบออกจาก DB
        await db.query("DELETE FROM users WHERE email = ?", [testUser.email]);
        await db.end();
    });

    test("should register new user", async () => {
        const res = await request(app).post("/auth/register").send(testUser);
        expect([200, 201]).toContain(res.statusCode);
        expect(res.body).toHaveProperty("message")
    });

    test("should not register duplicate email", async () => {
        const res = await request(app).post("/auth/register").send(testUser);
        expect(res.statusCode).toBe(400);
    });

    test("should login successfully", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ email: testUser.email, password: testUser.password });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body).toHaveProperty("user");
    });
});
