import { useEffect } from "react";
import Tooltip from "../../components/Tooltip";
import localforage from "localforage";


export default function StartPage({ props }) {
  // start page of the deckbuilder
  // shows the available decks and the option to create a new deck

  function gotoNewDeck() {
    // show the component where one can select their Captain
    props.setMode("captainSelect");
    props.setCurrentEditDeck({
      decklist: [],
      id: null,
      name: "New Deck",
      captain: null
    });
  }

  function editDeck(deck) {
    props.setCurrentEditDeck(deck);
    props.setMode("edit");
  }

  function deleteAllDecks() {
    window.confirm("Are you sure you want to delete all decks? This can not be undone!")
      .then((result) => {
        if (result) {
          localforage.removeItem("customDecks")
            .then(() => {
              props.setCustomDecks({});
            })
            .catch((error) => {
              console.error("Error deleting decks:", error);
              alert("Error deleting decks. Please try again.");
            });
        } else {
          console.log("User canceled the deletion.");
        }
      });
  }

  return (
    <div className="grid-container">
      <div className="grid-item" style={{ gridColumn: "1 / span 2" }}>
        <div className="container-left">
          <h2>Create a new deck from scratch</h2>
        </div>
        <div className="container-left">
          <button onClick={gotoNewDeck}>➕ New Deck</button>
          <button onClick={deleteAllDecks}>⚠ Delete All Decks</button>
        </div>
      </div>

      <div className="grid-item" style={{ gridColumn: "1 / span 2" }}>
        <div className="container-between">
          <h2>Your Decks:</h2>
        </div>
        <div className="decklist-container">
          {/* load decks from local forage */}
          {Object.keys(props.customDecks).map((deck) => (
            <div key={deck}>
              <img
                className="deck-image-small"
                src={props.customDecks[deck].captain.image_url}
                alt={props.customDecks[deck].name}
                onClick={()=> editDeck(props.customDecks[deck])}
              />
              <h3>{props.customDecks[deck].name}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-item" style={{ gridColumn: "1 / span 2" }}>
        <div className="container-between">
          <h2>Explore and customize the preconstructed decks</h2>
          <label htmlFor="deckSearch">
            Filter Decks: 
            <input
              id="deckSearch"
              type="text"
              placeholder="Deck Name"
              />
          </label>
        </div>
        <div className="decklist-container">
          {props.preconDeckNames.map((name) => (
            props.preconDeckImages[name] && (
              <div key={name}>
                <Tooltip content={name}>
                  <img
                    className="deck-image-small"
                    src={props.preconDeckImages[name]}
                    alt={name}
                  />
                </Tooltip>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  )
}