import express from "express";
import cors from "cors";
import { connectToDb, getDb } from "./db.js";
import { 
  processSearch, 
  sendAdvancedSearch, 
  testSearch, 
  getDecklists 
} from "./search.js";
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
    const BACKEND_PORT = process.env.BACKEND_PORT || 3000;
    app.listen(BACKEND_PORT, () => {
        console.log(`Server running on port ${BACKEND_PORT}`);
    });
});


app.post("/api/test", async (req, res) => {
  const decklists = await getDecklists(db)

  const searchResults = await testSearch(db);

  res.json({ 
    message: `${req.body.message} The backend is working!`,
    searchResults: searchResults,
    decklists: decklists 
  });
});


app.post("/api/search", async (req, res) => {
  try {
    console.log("Request received:", req.body);
    const formData = req.body;

    // Process the search inputs
    const { search, searchExplain } = processSearch(formData);

    // Perform the advanced search
    const results = await sendAdvancedSearch(
      db,
      search, 
      formData.effects, 
      searchExplain
    );

    // Send the results back to the client
    res.json(results);
  } catch (error) {
    console.error("Error processing search:", error);
    res.status(500).json({ error: "An error occurred during the search." });
  }
});


export default app;
