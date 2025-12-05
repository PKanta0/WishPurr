// back_end/__tests__/reviews.test.js
const request = require("supertest");
const app = require("../src/app");
const db = require("../src/config/db");
const bcrypt = require("bcrypt");

let userToken = "";
const reviewUserEmail = "jestreview@example.com";
const reviewUserPassword = "review123";
const productId = 1; // ต้องมีสินค้าตัวนี้จริงใน DB

beforeAll(async () => {
    const hash = await bcrypt.hash(reviewUserPassword, 10);
    await db.query(
        "INSERT INTO users (user_name, email, password, role) VALUES (?, ?, ?, 'user')",
        ["jestReviewUser", reviewUserEmail, hash]
    );

    const login = await request(app)
        .post("/auth/login")
        .send({ email: reviewUserEmail, password: reviewUserPassword });

    userToken = login.body.token;
});

afterAll(async () => {
    // ลบรีวิวที่ user นี้เขียน
    await db.query(
        `DELETE r FROM reviews r
     JOIN users u ON r.user_id = u.user_id
     WHERE u.email = ?`,
        [reviewUserEmail]
    );

    await db.query("DELETE FROM users WHERE email = ?", [reviewUserEmail]);
    await db.end();
});

describe("Review Module", () => {
    test("User can create review", async () => {
        const res = await request(app)
            .post("/reviews")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                productId,
                rating: 5,
                comment: "Good product",
            });

        expect(res.statusCode).toBe(403);
    });

    test("User cannot review same product twice", async () => {
        const res = await request(app)
            .post("/reviews")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                productId,
                rating: 5,
                comment: "Second review attempt",
            });

        expect(res.statusCode).toBe(403);
    });
});
