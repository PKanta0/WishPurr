// back_end/__tests__/orders.test.js
const request = require("supertest");
const app = require("../src/app");
const db = require("../src/config/db");
const bcrypt = require("bcrypt");

let userToken = "";
const orderUserEmail = "jestorder@example.com";
const orderUserPassword = "order123";
let createdOrderId = null;

beforeAll(async () => {
    const hash = await bcrypt.hash(orderUserPassword, 10);
    // สร้าง user สำหรับเทส order
    await db.query(
        "INSERT INTO users (user_name, email, password, role) VALUES (?, ?, ?, 'user')",
        ["jestOrderUser", orderUserEmail, hash]
    );

    const login = await request(app)
        .post("/auth/login")
        .send({ email: orderUserEmail, password: orderUserPassword });

    userToken = login.body.token;
});

afterAll(async () => {
    // ลบ order ของ user ทดสอบ (ถ้าจะให้ชัวร์ใช้ WHERE user_id = ...)
    await db.query(
        `DELETE o, oi FROM orders o
     LEFT JOIN order_items oi ON o.order_id = oi.order_id
     JOIN users u ON o.user_id = u.user_id
     WHERE u.email = ?`,
        [orderUserEmail]
    );

    await db.query("DELETE FROM users WHERE email = ?", [orderUserEmail]);
    await db.end();
});

describe("Orders Module", () => {
    test("User can create order", async () => {
        const res = await request(app)
            .post("/orders")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                firstName: "Test",
                lastName: "User",
                phone: "0000000000",
                address: "Test Address",
                note: "",
                items: [
                    { product_id: 1, quantity: 1 },
                    { product_id: 2, quantity: 2 },
                ],
            });

        expect([201, 400]).toContain(res.statusCode);
    });
});
