import express from "express";
import cors from "cors";
import { connectToDb, getDb } from "./db.js";
import { 
  processSearch, 
  sendAdvancedSearch,
  sendSimpleSearch,
  getDecklists
} from "./search.js";
import { testOrderDeck } from "./woocommerce.js";
import dotenv from "dotenv";
import { escapeRegex, sanitize } from "./utils.js";

dotenv.config();

const app = express();

let db;

app.use(cors());
app.use(express.json());


// Cache the orders for decks to prevent duplicate orders
let cachedOrders = {};


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


app.get("/api/card/:cardId", async (req, res) => {
  const { cardId } = req.params; // Extract cardId from the route

  try {
    const results = await db.collection(process.env.COLLECTION)
      .find({ id: cardId }) // Match based on cardId
      .toArray();

    if (results.length === 0) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching card:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.get("/api/all-cards", async (req, res) => {
  // get all cards, grouped by a given parameter or null
  const groupBy = req.query.groupBy || null;

  const pipeline = [
    { $group: { _id: `\$${groupBy}`, count: { $sum: 1 }}},
    {$sort: { _id: 1 }} 
  ];
  const aggCursor = db.collection(process.env.COLLECTION)
      .aggregate(pipeline);

  try {
    const aggregated = await aggCursor.toArray();

    let sort = {};
    sort[groupBy] = 1;
    sort["name"] = 1;

    const cards = await db.collection(process.env.COLLECTION)
      .find()
      .sort(sort)
      .toArray();

    res.json({ cards, aggregated });
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}); 


app.get("/api/decklists", async (req, res) => {
  const preconDecklists = await getDecklists(db);
  res.json({ preconDecklists });
})


app.post("/api/test", async (req, res) => {
  const decklists = await getDecklists(db);

  res.json({ 
    message: `${req.body.message} The backend is working!`,
    decklists: decklists 
  });

  // res.json(decklists);
});


app.post("/api/test-shop", async (req, res) => {
  const { deckname, captain, cards, image } = req.body;

  const stringifiedDeck = JSON.stringify(req.body);

  try {
    console.log("cachedOrders:", cachedOrders);

    if (
      Object.keys(cachedOrders).includes(deckname) &&
      cachedOrders[deckname].deckString === stringifiedDeck
    ) {
      console.log("Order already placed for this deck.");
      return res.json(cachedOrders[deckname].order);
    } else {
      cachedOrders[deckname] = null;
    }

    console.log("Request received for deck order:", req.body);

    const response = await testOrderDeck(deckname, captain, cards, image);

    console.log("response from server", response.status, response.statusText);

    if (response.status !== 200) {
      return res.status(response.status).json({
        code: response.code || "UNKNOWN_ERROR",
        message: response.message || "An error occurred.",
        data: response.data || null, // Ensure `data` exists
      });
    }

    cachedOrders[deckname] = {
      order: response.data,
      deckString: stringifiedDeck
    };
    console.log("Sending response for deck order.");
    return res.json(response.data);
  } catch (error) {
    console.error("Error processing deck order:", error);
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "An unexpected error occurred.",
      data: null, // Always provide `data`
    });
  }
});




app.post("/api/simple-search", async (req, res) => {
  console.log("Request received:", req.body);
  const formData = req.body;

  formData.name = new RegExp(escapeRegex(formData.name), "i");
  
  const results = await sendSimpleSearch(db, formData);
  res.json(results);
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
