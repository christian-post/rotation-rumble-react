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

  // if the user has selected a specific deck to edit
  useEffect(() => {
    if (props.currentEditDeck) {
      setDeckName(props.currentEditDeck.name);
      setDeckList(props.currentEditDeck.decklist);
    }
  }, [props.currentEditDeck]);
  

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

  useEffect(() => {
    fetch("/api/all-cards")
      .then((res) => res.json())
      .then((data) =>
        setAllCards(
          data.cards.filter((card) => {
            // Filter out captains and check if all card colors match the 
            // captain's colors
            return (
              card.cardtype !== "Captain" &&
              card.color.every((color) =>
                props.selectedCaptain.color.includes(color)
              )
            );
          })
        )
      );
  }, [props.selectedCaptain.color]);

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
        <CardsList props={
          { 
            allCards, 
            deckList, 
            currentEditDeck: props.currentEditDeck, 
            setDeckList
          }
          } />
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
              setCustomDecks: props.setCustomDecks,
              selectedCaptain: props.selectedCaptain,
              goBack,
              setMode: props.setMode,
              currentEditDeck: props.currentEditDeck,
              setCurrentEditDeck: props.setCurrentEditDeck
            }
          }
        />
        <DeckList props={{ deckList, setDeckList }} />
      </div>
    </div>
  );
}