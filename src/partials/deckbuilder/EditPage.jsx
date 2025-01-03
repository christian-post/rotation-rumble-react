import { useState, useEffect } from "react";
import CardsList from "./CardsList";
import DeckStats from "./DeckStats";
import DeckList from "./DeckList";


export default function EditPage({ props }) {
  const [allCards, setAllCards] = useState([]);
  const [deckStats, setDeckStats] = useState({
    cardsTotal: 0,
    fighters: 0,
    items: 0,
    flashes: 0,
    averageCost: 0,
    captain: null
  });

  useEffect(() => {
    // calculate deck stats based on the current decklist
    let cardsTotal = 0;
    let fighters = 0;
    let items = 0;
    let flashes = 0;
    let totalCost = 0;

    props.currentEditDeck.decklist.forEach((card) => {
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
      captain: props.currentEditDeck.captain.name
    });
  }, [props.currentEditDeck.decklist, props.currentEditDeck.captain]);

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
                props.currentEditDeck.captain.color.includes(color)
              )
            );
          })
        )
      );
  }, [props.currentEditDeck.captain]);

  function changeDeckName() {
    const newName = prompt("Enter a new name for your deck:");
    if (newName) {
      props.setCurrentEditDeck({...props.currentEditDeck, name: newName});
    }
  }

  return (
    <div className="grid-container" id="deck-builder">
      <div className="grid-item">
        {/* left side */}
        <CardsList props={{ 
            allCards,
            currentEditDeck: props.currentEditDeck, 
            setCurrentEditDeck: props.setCurrentEditDeck,
          }} />
      </div>
      <div className="grid-item">
        {/* right side */}
        <div className="deck-title-container">
          <h2 id="deck-title">{props.currentEditDeck.name}</h2>
          <button 
            className="standard-button" 
            onClick={changeDeckName}
          >🖊</button>
        </div>
        <DeckStats props={{ 
            deckStats, 
            setCustomDecks: props.setCustomDecks,
            setMode: props.setMode,
            currentEditDeck: props.currentEditDeck,
            setCurrentEditDeck: props.setCurrentEditDeck
          }} /> 
        <DeckList props={{ 
          currentEditDeck: props.currentEditDeck, 
          setCurrentEditDeck: props.setCurrentEditDeck,
         }} />
      </div>
    </div>
  );
}