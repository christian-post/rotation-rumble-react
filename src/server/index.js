import express from "express";
import cors from "cors";
import { connectToDb, getDb } from "./db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

let db;

app.use(cors());
app.use(express.json());


connectToDb((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1); // Exit if connection fails
    }

    db = getDb();

    // Start the server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

// Example route
app.post("/api/submit", (req, res) => {
    const { name, email } = req.body;

    db.collection("users")
        .insertOne({ name, email })
        .then(() => res.status(200).json({ message: "Form submitted successfully!" }))
        .catch((err) => res.status(500).json({ error: "Database error", details: err }));
});

export default app;
