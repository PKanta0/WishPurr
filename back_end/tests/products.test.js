// back_end/__tests__/products.test.js
const request = require("supertest");
const app = require("../src/app");
const db = require("../src/config/db");
const bcrypt = require("bcrypt");

let adminToken = "";
let createdProductId = null;
const adminEmail = "jestadmin@example.com";
const adminPassword = "admin123";

beforeAll(async () => {
    // สร้าง admin สำหรับเทส
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await db.query(
        "INSERT INTO users (user_name, email, password, role) VALUES (?, ?, ?, 'admin')",
        ["jestAdmin", adminEmail, passwordHash]
    );

    // login เพื่อเอา token
    const login = await request(app)
        .post("/auth/login")
        .send({ email: adminEmail, password: adminPassword });

    adminToken = login.body.token;
});

afterAll(async () => {
    // ลบ product ที่สร้างจากเทส (ถ้ามี)
    if (createdProductId) {
        await db.query("DELETE FROM products WHERE product_id = ?", [
            createdProductId,
        ]);
    }
    // ลบ admin ทดสอบ
    await db.query("DELETE FROM users WHERE email = ?", [adminEmail]);
    await db.end();
});

describe("Product Module", () => {
    test("GET /products should return array", async () => {
        const res = await request(app).get("/products");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("Admin can create product", async () => {
        const res = await request(app)
            .post("/products")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Jest Product",
                price: 199,
                category_name: "ลูกแมว",
                image_cover: "/img/test.png",
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("product_id");
        createdProductId = res.body.product_id;
    });

    test("Admin can update product", async () => {
        const res = await request(app)
            .put(`/products/${createdProductId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Updated Jest Product",
                price: 250,
                category_name: "ลูกแมว",
                image_cover: "/img/test.png",
            });

        expect(res.statusCode).toBe(200);
    });
});
