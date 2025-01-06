import dotenv from "dotenv";
import { connectToDb, getDb } from "./db.js";
import fs from "fs"; 
dotenv.config();


function connectToDbAsync() {
  return new Promise((resolve, reject) => {
    connectToDb((err) => {
      if (err) {
        reject(err); // Reject the Promise if there's an error
      } else {
        resolve(); // Resolve the Promise on success
      }
    });
  });
}


export async function commonWords() {
  // This only needs to be manually executed after a database update
  try {
    await connectToDbAsync(); // Wait for the database connection to establish
    const db = getDb(); // Retrieve the database instance

    const results = await db
      .collection(process.env.COLLECTION)
      .find({})
      .toArray(); // Fetch data from the collection

    const fieldWordCounts = {}; 

    results.forEach((doc) => {
      // Remove the `_id`, `id`, and `image_url` fields
      const { _id, id, image_url, dice, ...rest } = doc;

      Object.entries(rest).forEach(([field, value]) => {
        // Flatten the field value into a single string
        const fieldValue = Array.isArray(value)
          ? value.map((item) => (typeof item === "string" ? item : JSON.stringify(item))).join(" ")
          : typeof value === "string"
          ? value
          : JSON.stringify(value);

        // Tokenize the string into words and normalize case
        const words = fieldValue
          .split(/\W+/) // Split on non-word characters
          .map((word) => word.toLowerCase()) // Convert to lowercase
          .filter((word) => word.length >= 3 && isNaN(word)); // Exclude numbers

        // Initialize the field in the dictionary if not present
        if (!fieldWordCounts[field]) {
          fieldWordCounts[field] = {};
        }

        // Count occurrences of each word for this field
        words.forEach((word) => {
          fieldWordCounts[field][word] = (fieldWordCounts[field][word] || 0) + 1;
        });
      });
    });

    // Convert word counts to sorted word lists for each field
    const fieldWordLists = {};

    Object.entries(fieldWordCounts).forEach(([field, wordCounts]) => {
      const sortedWords = Object.entries(wordCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .map(([word]) => word); // Extract only the words

      // Optionally filter out blacklist words
      const blacklist = ["the", "http", "com", "jpg"];
      fieldWordLists[field] = sortedWords.filter((word) => !blacklist.includes(word));
    });

    // Save the JSON file
    const filePath = "data/common_words.json";
    fs.writeFileSync(filePath, JSON.stringify(fieldWordLists, null, 2), "utf8");
    console.log(`Words saved to ${filePath}`);
  } catch (err) { 
    console.error("Error in commonWords:", err);
    throw err; // Re-throw the error for handling in the caller
  }
}


