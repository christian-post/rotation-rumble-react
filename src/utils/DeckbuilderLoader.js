// Loader function for Deckbuilder.jsx
import localforage from "localforage";

export default async function deckbuilderLoader() {
  try {
    const request = await fetch("/api/decklists", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!request.ok) {
      throw new Error("Failed to fetch decklists");
    }

    const data = await request.json();

    // add custom decks from localforage
    const customDecks = await localforage.getItem("customDecks");
    data.customDecks = customDecks || {};

    return { data };
  } catch (error) {
    console.error("Loader error:", error);
    return { data: null, error: error.message };
  }
}
