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
import { escapeRegex } from "./utils.js";

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
  const { deckname, captain, cards } = req.body;

  console.log("cachedOrders:", cachedOrders);

  if (Object.keys(cachedOrders).includes(deckname)) {
    console.log("Order already placed for this deck.");
    return res.json(cachedOrders[deckname]);
  } else {
    cachedOrders[deckname] = { id: undefined };
  }

  console.log("Request received for deck order:", req.body);
  const response = await testOrderDeck(deckname, captain, cards);
  // const response = {
  //   code: 200,
  //   message: "Order placed successfully",
  //   data: {
  //     status: 200,
  //     id: "12345",
  // }};

  console.log("response from server", response);
  // console.log("response from server", response.data);

  if (response.data.status !== 200) {
    res.status(response.status).json({
      code: response.code,
      message: response.message,
      data: response.data,
    });
  } else {
    res.json(response.data);
    cachedOrders[deckname] = response.data;
  }
})


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
