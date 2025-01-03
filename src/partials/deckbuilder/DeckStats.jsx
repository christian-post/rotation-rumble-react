import localforage from "localforage";
import { generateUniqueId } from "../../utils/common";

export default function DeckStats({ props }) {

  function saveDeck() {
    if (props.currentEditDeck.decklist.length === 0) {
      alert("You cannot save an empty deck.");
      return;
    } 

    // check if the last loaded deck has a UUID
    // if not, generate a new one
    if (!props.currentEditDeck.id) {
      props.currentEditDeck.id = generateUniqueId();
    }

    // saves the deck to the local storage
    localforage.getItem("customDecks")
      .then((customDecks) => {
        // Initialize the customDecks collection if it doesn't exist
        if (!customDecks) {
          customDecks = {};
        }

        // Add the new deck to the customDecks object
        customDecks[`deck_${props.currentEditDeck.id}`] = props.currentEditDeck;

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
      console.log("Deck saved:", props.currentEditDeck);
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
        {props.currentEditDeck.decklist.length > 0 && (<div 
          className="standard-button"
          onClick={()=> props.setMode("overview")}
        >
          📊 Overview
        </div>)}
        <button 
          className="standard-button"
          onClick={()=> props.setMode("start")}
        >
          🔙 Go Back
        </button>
      </div>
      <div>
        <div id="deck-stats"> 
          <table style={{ height: "100%" }}>
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
                <td>Captain:</td>
                <td>{props.deckStats.captain}</td>
              </tr>
            </tbody>
          </table>
          <img 
            className="card-image-medium"
            src={props.currentEditDeck.captain.image_url} 
            alt={props.currentEditDeck.captain.name}
          />
        </div>
        <div id="deck-validity-check">
          Checking the validity of the deck...
        </div>
      </div>
    </>
  )
}