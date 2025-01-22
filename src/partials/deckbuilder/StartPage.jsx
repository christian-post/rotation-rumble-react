import { useState, useEffect, useRef } from "react";
import Tooltip from "../../components/Tooltip";
import CardImage from "../../components/CardImage";
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

  const preconModalRef = useRef(null);
  const [selectedPrecon, setSelectedPrecon] = useState(null);
  useEffect(() => {
    if (selectedPrecon) {
      openPreconModal();
    }
  }, [selectedPrecon]);

  const openPreconModal = () => {
    preconModalRef.current?.showModal();
    document.body.style.overflow = "hidden";  // disable scrolling
  };

  const handleClose = () => {
    preconModalRef.current?.close();
    document.body.style.overflow = "";
  };

  // Dialogue that shows a choice between two precon decks
  function PreconSelectModal() {
    const [selectedDeck, setSelectedDeck] = useState(null);

    useEffect(()=> {
      if (selectedDeck) {
        handleClose();
        console.log(`you selected ${selectedDeck.name}`);
        editDeck(selectedDeck);
      }
    }, [selectedDeck]);

    if (!selectedPrecon) {
      return null;
    }
    
    return (
      <dialog 
        className="dialog-modal precon-dialog" 
        ref={preconModalRef}
        onCancel={(event) => {
          event.preventDefault();
          handleClose();
        }}  
      >
        <h2>Select one of the two decks in {selectedPrecon.name}:</h2>
        <div className="precon-selection">
          <div className="precon-selection-card">
            <CardImage props={{card: selectedPrecon.captains[0], sizing: "large"}}/>
            <button 
              className="standard-button"
              onClick={() => setSelectedDeck(selectedPrecon.decks[0])}
            >
              SELECT {selectedPrecon.captains[0].name.toUpperCase()}
            </button>
          </div>
          <div className="precon-selection-card">
          <CardImage props={{card: selectedPrecon.captains[1], sizing: "large"}}/>
            <button 
              className="standard-button"
              onClick={() => setSelectedDeck(selectedPrecon.decks[1])}
            >
              SELECT {selectedPrecon.captains[1].name.toUpperCase()}
            </button>
          </div>
        </div>
      </dialog>
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
      {Object.keys(props.customDecks).length > 0 && (<section className="section-bg-white">
        <p className="your-decks-h">Your decks:</p>
      </section>)}
      <section className="section-bg-white">
        <div className="custom-decks-container">
          {Object.keys(props.customDecks).map((deck) => (
            // TODO: loading placeholder for the image
            <div key={deck}>
              <CardImage props={{
                card: props.customDecks[deck].captain, 
                sizing: "medium",
                onClick: ()=> editDeck(props.customDecks[deck]),
                customStyle: {cursor: "pointer"}
              }}/>
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
        <PreconSelectModal />
        <div className="custom-decks-container">
          {Object.keys(props.preconDecks).map((name) => (
            props.preconDeckImages[name] && (
              <div className="precon-deck" key={name} id={name}>
                <img
                  className="deck-image-small wiggle-test2"
                  src={props.preconDeckImages[name]}
                  alt={name}
                  onClick={()=> setSelectedPrecon(props.preconDecks[name])}
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