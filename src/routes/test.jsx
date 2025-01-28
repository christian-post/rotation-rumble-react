import React, { useEffect, useState, useRef } from "react";
import { useLoaderData } from "react-router-dom";
import Tooltip from "../components/Tooltip";

import localforage from "localforage";
import { generateUniqueId } from "../utils/common";


function CardsList2({ props }) {
  // left side of the Edit Page that shows the available cards

  // sorting order of the columns
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [sortedCards, setSortedCards] = useState([]);

  // SORTING
  useEffect(() => {
    // Compute sorted data whenever props.allCards or sortConfig changes
    const sortData = () => {
      const sorted = [...props.allCards].sort((a, b) => {
        if (sortConfig.key) {
          const aVal = a[sortConfig.key];
          const bVal = b[sortConfig.key];

          if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
          if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
      setSortedCards(sorted);
    };

    sortData();
  }, [props.allCards, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  function filterTable(event) {
    // filters the cards table based on the input value
    const {value} = event.currentTarget;
    
    const table = document.getElementById("card-gallery-table");
    const rows = table.getElementsByTagName("tr");
    for (let i = 1; i < rows.length; i++) {
      const name = rows[i].getElementsByTagName("td")[0].textContent;
      const cardtype = rows[i].getElementsByTagName("td")[1].textContent;
      const costs = rows[i].getElementsByTagName("td")[2].textContent;

      if (name.toLowerCase().includes(value.toLowerCase()) || 
          cardtype.toLowerCase().includes(value.toLowerCase()) || 
          costs.toLowerCase().includes(value.toLowerCase())) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    }
  }


  return (
    <>
      <div style={{paddingLeft: "2rem"}}>
        <h2>All Cards</h2>
      </div>
      <div className="ui-bar-horizontal">
        <label htmlFor="card-filter">Filter</label>
        <input 
          type="text" 
          id="card-filter" 
          name="card-filter" 
          placeholder="Name or Cardtype"
          onChange={filterTable}
        />
        <Tooltip 
          content="Filter the cards by name or card type" 
          position="right"
        >
          <i className="fa fa-question-circle" />
        </Tooltip>
      </div>
      {props.allCards.length > 0 ? (
      <table 
        id="card-gallery-table"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead
          style={{
            position: "sticky",
            top: 0,
            backgroundColor: "white",
            zIndex: 1,
            // transform: "translateY(10px)", // Simulates extra space
            // transition: "transform 0.2s ease", // Smooth animation
          }}
        >
          <tr>
            <th 
              className="sortable-table-col-head"
              onClick={() => requestSort("name")}
            >
              <div style={{ marginBottom: "8px" }}>
                <span>Name</span>
                <i
                    className={`sort-button fa ${
                      sortConfig.key === "name"
                        ? `fa-sort-${sortConfig.direction}`
                        : "fa-sort"
                    }`}
                    style={{ fontSize: "24px" }}
                  />
              </div>
            </th>
            <th
              className="sortable-table-col-head"
              onClick={() => requestSort("cardtype")}
            >
              <div>
                <span>Card Type</span>
                <i
                    className={`sort-button fa ${
                      sortConfig.key === "cardtype"
                        ? `fa-sort-${sortConfig.direction}`
                        : "fa-sort"
                    }`}
                    style={{ fontSize: "24px" }}
                  />
              </div>
            </th>
            <th
              className="sortable-table-col-head"
              onClick={() => requestSort("color")}
            >
              <div>
                <span>Colors</span>
                <i
                    className={`sort-button fa ${
                      sortConfig.key === "color"
                        ? `fa-sort-${sortConfig.direction}`
                        : "fa-sort"
                    }`}
                    style={{ fontSize: "24px" }}
                  />
              </div>
            </th>
            <th>Info</th>
            <th><span className="span-no-wrap">Add to Deck</span></th>
          </tr>
        </thead>
        <tbody>
        {sortedCards.map((card, index) => (
            <tr
              key={card.name}
              style={{
                backgroundColor: index % 2 === 1 ? "var(--color-highlight)" : "transparent",
              }}
            >
              <td>{card.name}</td>
              <td>{card.cardtype}</td>
              <td>
                {card.color.map((color) => (
                  <span
                    key={color}
                    className="color-circle"
                    style={{ backgroundColor: color }}
                    aria-label={`Color: ${color}`}
                  >
                    {color[0]}
                  </span>
                ))}
              </td>
              <td>
                <props.CardModal />
                <p onClick={() => props.setSelectedCard(card)} style={{ cursor: "pointer" }}>
                  💬
                </p>
              </td>
              <td>
                {!props.currentEditDeck.decklist.some(
                  (deckCard) => deckCard.name === card.name
                ) && (
                  <div className="add-to-deck-td">
                    <button
                      className="deckbuilder-table-button"
                      onClick={() => {
                        props.setCurrentEditDeck({
                          ...props.currentEditDeck,
                          decklist: [...props.currentEditDeck.decklist, card],
                        });
                      }}
                    >
                      <i
                        className="fa fa-plus"
                        style={{ color: "grey", cursor: "pointer" }}
                      />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>) : <div><h2>Loading the cards list...</h2></div>}
    </>
  );
}



function DeckStats2({ props }) {

  return ( 
    <>
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        marginBottom: "1rem"
      }}
      >
        <h2 style={{ textAlign: "left" }}>Deck Stats</h2>
        <div style={{ 
          display: "flex", 
          flexDirection: "row", 
          justifyContent: "flex-end",
          alignItems: "center",
          gap: ".5rem"
         }}>
          <button
            className="standard-button"
            // onClick={saveDeck}
          >
            💾 Save Changes
          </button>
          {props.currentEditDeck.decklist.length > 0 && (<div 
            className="standard-button"
            // onClick={()=> props.setMode("overview")}
            >
            📊 Overview
          </div>)}
          <button 
            className="standard-button"
            // onClick={()=> props.setMode("start")}
            >
            🔙 Go Back
          </button>
        </div>
      </div>
      <div>
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
        }}
        > 
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
        {/* <div id="deck-validity-check">
          Checking the validity of the deck...
        </div> */}
      </div>
    </>
  )
}



export default function Test() {
  const { data, error } = useLoaderData();

  if (error) {
    return <ErrorPage displayedError={error}/>;
  }

  if (!data) {
    return <LoadingPlaceholder />;
  }

  const [mode, setMode] = useState("start"); 
  // value that holds the current deck object which can be edited
  const [currentEditDeck, setCurrentEditDeck] = useState({
    decklist: [],
    id: null,
    name: "New Deck",
    captain: {
      "_id": {
        "$oid": "676d80a1fe83b24400f38862"
      },
      "name": "Toma Oni",
      "set": "Core Set",
      "deck": [
        "Bolts & Bones"
      ],
      "cardtype": "Captain",
      "color": [
        "blue",
        "red"
      ],
      "dice": "No",
      "effect1": "You may play flash cards from your\u0003discard pile during\u0003your turn.",
      "image_url": "http://rotation-rumble.com/images/toma_oni.jpg",
      "id": "toma_oni"
    }
  });

  // all decks from localForage
  const [customDecks, setCustomDecks] = useState(data.customDecks);
  
  const [allCards, setAllCards] = useState([]);
  const [deckStats, setDeckStats] = useState({
    cardsTotal: 0,
    fighters: 0,
    items: 0,
    flashes: 0,
    averageCost: 0,
    captain: null
  });

  // Modal that prompts the deck name
  const modalRef = useRef(null);
  // Modal that shows the card info
  const cardModalRef = useRef(null);
  const [selectedCard, setSelectedCard] = useState(null);
  useEffect(() => {
    if (selectedCard) {
      openCardModal();
    }
  }, [selectedCard]);

  const openCardModal = () => {
    cardModalRef.current?.showModal();
    document.body.style.overflow = "hidden";  // disable scrolling
  };

  const closeCardModal = () => {
    cardModalRef.current?.close();
    document.body.style.overflow = "";
  };

  function CardModal() {
    const handleOutsideClick = (event) => {
      if (cardModalRef.current && event.target === cardModalRef.current) {
        // If the click is on the dialog itself (not its children), close the modal
        closeCardModal();
      }
    };
  
    useEffect(() => {
      document.addEventListener("mousedown", handleOutsideClick);
  
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, []);

    if (!selectedCard) {
      return null;
    }

    return (
      <dialog 
        className="dialog-modal" 
        ref={cardModalRef}
        onCancel={(event) => {
          event.preventDefault();
          closeCardModal();
        }}  
      >
        <CardWindow props={{card: selectedCard}} />
      </dialog>
    );
  }

  useEffect(() => {
    // populate allCards with cards that match the captain's colors
    fetch("/api/all-cards")
      .then((res) => res.json())
      .then((data) =>
        setAllCards(
          data.cards.filter((card) => {
            return (
              card.cardtype !== "Captain" &&
              card.color.every((color) =>
                currentEditDeck.captain.color.includes(color)
              )
            );
          })
        )
      );
  }, [currentEditDeck.captain]);

  return (
    <main>
      <div 
        className="grid-container" 
        style={{ 
          gridTemplateColumns: "3fr 2fr",
          gridTemplateRows: "1fr 4fr",
        }}
      >
        <div 
          // className="grid-item"
          style={{  border: "2px solid red", padding: "1rem", gridRow: "1 / span 3" }}
        >
          {/* left side */}
          <CardsList2 props={{ 
              allCards,
              currentEditDeck: currentEditDeck, 
              setCurrentEditDeck: setCurrentEditDeck,
              cardModalRef: cardModalRef,
              CardModal: CardModal,
              setSelectedCard: setSelectedCard
            }} />
        </div>
        <div className="grid-item" style={{  border: "2px solid red", padding: "1rem" }}>
          <div className="deck-title-container">
            <h2 id="deck-title">{currentEditDeck.name}</h2>
            <button 
              className="standard-button" 
              // onClick={openDecknameModal}
            >🖊</button>
            {/* <DecknameModal /> */}
          </div>
          <DeckStats2 props={{ 
            deckStats, 
            setCustomDecks: setCustomDecks,
            setMode: setMode,
            currentEditDeck: currentEditDeck,
            setCurrentEditDeck: setCurrentEditDeck,
          }} />
        </div>
        <div className="grid-item" style={{  border: "2px solid red", padding: "1rem" }}>
          Test
        </div>
      </div>
    </main>
  );
}