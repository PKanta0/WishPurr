const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// register routes 
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/reviews", reviewRoutes);


// test server
app.get("/health", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1 AS result");
        res.json({ status: "ok", db: rows[0].result });
    } catch (err) {
        res.status(500).json({ status: "error", message: "DB connection failed" });
    }
});

// start server
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`WishPurr backend running on http://localhost:${PORT}`);
    });
}

//supertest unit test
module.exports = app;