import { useState, useEffect } from "react";
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

  function filterDecks(event) {
    // filters the preconstructed decks
    const {value} = event.currentTarget;

    document.querySelectorAll(".precon-deck").forEach(
      elem => {
        if (elem.id.toLowerCase().includes(value.toLowerCase().trim())) {
          elem.style.display = "";
        } else {
          elem.style.display = "none";
        }
      }
    );
  }

  return (
    <div className="page-container ">
      <section className="top-section">
        <p>Create a new deck from scratch:</p>
      </section>
      <section>
        <div className="create-deck-button-container">
          <button 
            className="deckbuilder-button add-deck-button" 
            onClick={gotoNewDeck}
          >
            <i className="fa fa-plus-circle" style={{ fontSize: "20px"}}/>
            <span>ADD NEW DECK</span>
          </button>
          <button 
            className="deckbuilder-button delete-decks-button"
            onClick={deleteAllDecks}
          >
            <i className="fa fa-trash" style={{ fontSize: "20px"}}/>
            <span>DELETE ALL DECKS</span>
          </button>
        </div>
      </section>
      <section className="section-bg-white">
        <p className="your-decks-h">Your decks:</p>
      </section>
      <section className="section-bg-white">
        <div className="custom-decks-container">
          {Object.keys(props.customDecks).map((deck) => (
            <div key={deck}>
              <img
                className="deck-image-small"
                src={props.customDecks[deck].captain.image_url}
                alt={props.customDecks[deck].name}
                onClick={()=> editDeck(props.customDecks[deck])}
              />
              <p className="deck-title-p">
                {props.customDecks[deck].name}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section>
          <div className="subsection-header ">
            <p className="choose-decks-h">
              Explore and customize the preconstructed decks:
            </p>
            <div className="container-right">
              <label htmlFor="deckSearch">
                Filter Decks:
              </label>
              <input
                id="deckSearch"
                type="text"
                placeholder="Deck Name"
                onChange={filterDecks}
                />
            </div>
          </div>
      </section>
      <section>
        <div className="custom-decks-container">
          {props.preconDeckNames.map((name) => (
            props.preconDeckImages[name] && (
              <div className="precon-deck" key={name} id={name}>
                <img
                  className="deck-image-small"
                  src={props.preconDeckImages[name]}
                  alt={name}
                />
                <p className="deck-title-p">
                  {name}
                </p>
              </div>)
            ))}
        </div>
      </section>
    </div>
  )
}