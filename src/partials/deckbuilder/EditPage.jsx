import { useState, useEffect } from "react";
import CardsList from "./CardsList";
import DeckStats from "./DeckStats";
import DeckList from "./DeckList";


export default function EditPage({ props }) {
  const [allCards, setAllCards] = useState([]);
  const [deckName, setDeckName] = useState("My Deck");
  const [deckStats, setDeckStats] = useState({
    cardsTotal: 0,
    fighters: 0,
    items: 0,
    flashes: 0,
    averageCost: 0,
    captain: null
  });
  const [deckList, setDeckList] = useState([]);
  const setCustomDecks = props.setCustomDecks;

  // if the user has selected a specific deck to edit
  if (props.currentEditDeck) {
    useEffect(() => {
      setDeckName(props.currentEditDeck.name);
      setDeckList(props.currentEditDeck.decklist);
    }, [props.currentEditDeck]);
  }

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
      averageCost,
      captain: props.selectedCaptain.name
    });
  }
  , [deckList]);

  // fetch all cards from the server and filter out the non-Captain ones
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
        <DeckStats 
        props={
            { 
              deckStats, 
              deckList, 
              setCustomDecks,
              selectedCaptain: props.selectedCaptain,
              goBack 
            }
          }
        />
        <DeckList props={{ deckList, setDeckList }} />
      </div>
    </div>
  );
}