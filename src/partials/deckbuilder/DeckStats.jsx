import localforage from "localforage";
import { generateUniqueId } from "../../utils/common";

export default function DeckStats({ props }) {

  function saveDeck() {
    if (props.deckList.length === 0) {
      alert("You cannot save an empty deck.");
      return;
    }

    const deck = {
      "decklist": props.deckList,
      "id": generateUniqueId(),
      "name": document.getElementById("deck-title").textContent
    };

    // saves the deck to the local storage
    localforage.getItem("customDecks")
      .then((customDecks) => {
        // Initialize customDecks if it doesn't exist
        if (!customDecks) {
          customDecks = {};
        }

        // Add the new deck to the customDecks object
        customDecks[`deck_${deck.id}`] = deck;

        // Update the customDecks state
        props.setCustomDecks(customDecks);

        // Save the updated customDecks object back to localForage
        return localforage.setItem("customDecks", customDecks);
      })
      .then(() => {
        alert("Deck saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving deck:", error);
        alert("Error saving deck. Please try again.");
      });
  }

  return ( 
    <>
      <div className="toggle-header">
        <h2 style={{ textAlign: "left" }}>Deck Stats</h2>
        <button 
          className="standard-button" 
          onClick={saveDeck}
        >💾 Save Changes
        </button>
        <button 
          className="standard-button"
          onClick={props.goBack}
        >
          🔙 Go Back
        </button>
      </div>
      <div>
        <div id="deck-stats">
          <table>
            <tbody>
              <tr>
                <td>Fighters:</td>
                <td>{props.deckStats.fighters}</td>
                <td>Total Cards:</td>
                <td>{props.deckStats.cardsTotal}</td>
              </tr>
              <tr>
                <td>Items:</td>
                <td>{props.deckStats.items}</td>
                <td>Average Cost:</td>
                <td>{props.deckStats.averageCost || 0}</td>
              </tr>
              <tr>
                <td>Flashes:</td>
                <td>{props.deckStats.flashes}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id="deck-validity-check"></div>
      </div>
    </>
  )
}