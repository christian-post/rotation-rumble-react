import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import Tooltip from "../components/Tooltip";


function StartPage({ props }) {

  function changeMode() {
    props.setMode("edit");
  }

  return (
    <div className="grid-container">
      <div className="grid-item" style={{ gridColumn: "1 / span 2" }}>
        <div className="container-left">
          <h2>Create a new deck from scratch</h2>
        </div>
        <div className="container-left">
          <button onClick={changeMode}>➕ New Deck</button>
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
          {props.deckNames.map((name) => (
            props.deckImages[name] && (
              <div key={name}>
                <Tooltip content={name}>
                  <img
                    className="deck-image-small"
                    src={props.deckImages[name]}
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


function CardsList({ props }) {
  // left side of the Edit Page that shows the available cards
  return (
    <>
      <div className="all-cards-title">
        <h2>All Cards</h2>
      </div>
      <div className="ui-bar-horizontal">
        <label htmlFor="card-filter">Filter</label>
        <input 
          type="text" 
          id="card-filter" 
          name="card-filter" 
          // onkeyup="filterTable()" //TODO see Tutorial for how this should update in real time
        />
      </div>
      <table className="card-gallery-table" id="card-gallery-table">
        <thead>
          <tr>
            <th className="sortable-table-col-head">
              <span>Name</span>
              <span>&#x25BC;</span>
            </th>
            <th className="sortable-table-col-head">
              <span>Card Type</span>
              <span>&#x25BC;</span>
            </th>
            <th className="sortable-table-col-head">
              <span>Costs</span>
              <span>&#x25BC;</span>
            </th>
            <th>Info</th>
            <th>Add to Deck</th>
          </tr>
        </thead>
        <tbody>
          {props.allCards.map((card) => (
            <tr key={card.name}>
              <td>{card.name}</td>
              <td>{card.cardtype}</td>
              <td>{card.costs}</td>
              <td>💬</td>
              <td>
                {!props.deckList.includes(card) && <button onClick={()=> {
                  // adds the card to the deck list
                  props.setDeckList([...props.deckList, card]);
                }}>➕</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}


function DeckStats({ props }) {

  return ( 
    <>
      <div className="toggle-header">
        <h2 style={{ textAlign: "left" }}>Deck Stats</h2>
        <button 
          className="standard-button" 
          onClick={props.goBack} // TODO: placeholder, show statistics page instead
        >💾 Save Changes
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


function DeckList({ props }) {
  return (
    <div className="deck-container">
      <table className="card-gallery-table" id="my-deck-table">
        <thead>
          <tr>
            <th className="sortable-table-col-head">
              <span>Name</span>
              <span>&#x25BC;</span>
            </th>
            <th className="sortable-table-col-head">
              <span>Card Type</span>
              <span>&#x25BC;</span>
            </th>
            <th className="sortable-table-col-head">
              <span>Costs</span>
              <span>&#x25BC;</span>
            </th>
            <th>Info</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {props.deckList.map((card) => (
            <tr key={card.name}>
              <td>{card.name}</td>
              <td>{card.cardtype}</td>
              <td>{card.costs}</td>
              <td>💬</td>
              <td><button onClick={()=> {
                // removes the card from the deck list
                props.setDeckList(props.deckList.filter((c) => c !== card));
              }}>❌</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


function EditPage({ props }) {
  const [allCards, setAllCards] = useState([]);
  const [deckName, setDeckName] = useState("My Deck");
  const [deckStats, setDeckStats] = useState({
    cardsTotal: 0,
    fighters: 0,
    items: 0,
    flashes: 0,
    averageCost: 0
  });
  const [deckList, setDeckList] = useState([]);

  useEffect(() => {
    //calculate deck stats
    let cardsTotal = 0;
    let fighters = 0;
    let items = 0;
    let flashes = 0;
    let totalCost = 0;

    deckList.forEach((card) => {
      cardsTotal++;
      totalCost += card.costs || 0;
      if (card.cardtype === "Fighter") {
        fighters++;
      } else if (card.cardtype === "Item") {
        items++;
      } else if (card.cardtype === "Flash") {
        flashes++;
      }
    });
    const averageCost = Math.round(totalCost / cardsTotal * 100)  / 100;
    
    setDeckStats({
      cardsTotal,
      fighters,
      items,
      flashes,
      averageCost
    });
  }
  , [deckList]);


  useEffect(() => {
    fetch("/api/all-cards")
      .then((res) => res.json())
      .then((data) => setAllCards(
        data.cards.filter((card) => card.cardtype !== "Captain")));
  }, []);

  function goBack() {
    props.setMode("start");
  }

  function changeDeckName() {
    const newName = prompt("Enter a new name for your deck:");
    if (newName) {
      setDeckName(newName);
    }
  }

  return (
    <div className="grid-container" id="deck-builder">
      <div className="grid-item">
        {/* left side */}
        <CardsList props={{ allCards, deckList, setDeckList }} />
      </div>
      <div className="grid-item">
        {/* right side */}
        <div className="deck-title-container">
          <h2 id="deck-title">{deckName}</h2>
          <button 
            className="standard-button" 
            onClick={changeDeckName}
          >🖊</button>
        </div>
        <DeckStats props={{ deckStats, goBack }} />
        <DeckList props={{ deckList, setDeckList }} />
      </div>
    </div>
  );
}


export default function Deckbuilder() {
  const { data, error } = useLoaderData();

  if (error) {
    return <div>Error loading deck data: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  // Mode defines which children are rendered
  const [mode, setMode] = useState("start"); // start, edit


  const deckNames = Object.keys(data.decklists)

  // TODO: put in own file
  // maps the deck names to the corresponding images
  const deckImages = {
    "Bolts & Bones": "images/decks/RR-Bolts-Bones-PnP.jpg",
    "Bows & Blades": "images/decks/RR-Bows-Blades-PnP.jpg",
    "Howls & Horrors": "images/decks/RR-Howls-Horors-PnP.jpg",
    "Trash & Tiaras": "images/decks/Rotation-Rumble-Trash-Tiaras-Print-and-Play.webp",
    "Clubs & Critters": "images/decks/Print-And-Play-Clubs-and-Critters-Rotation-Rumble.webp",
    "Goblins & Glaciers": "images/decks/Print-Play-Rotation-Rumble-Goblins-And-Glaciers.webp",
    "Tales & Tussle": "images/decks/Print-And-Play-Rotation-Rumble-Tales-and-Tussle.webp",
    "Sakura & Shuriken": "images/decks/Print-And-Play-Rotation-Rumble-Sakura-Shuriken.webp"
  }
  
  return (
    <main>
      {{
        start: <StartPage props={{ deckNames, deckImages, mode, setMode }} />,
        edit: <EditPage props={{ mode, setMode }} />,
      }[mode] || null}
    </main>
  )
}