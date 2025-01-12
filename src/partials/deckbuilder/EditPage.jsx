import { useState, useEffect, useRef } from "react";
import CardsList from "./CardsList";
import DeckStats from "./DeckStats";
import DeckList from "./DeckList";
import CardWindow from "../../components/CardWindow";


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


  const openDecknameModal = () => {
    modalRef.current?.showModal();
    document.body.style.overflow = "hidden";  // disable scrolling
  };

  const closeDecknameModal = () => {
    modalRef.current?.close();
    document.body.style.overflow = "";
  };

  function DecknameModal() {
    const [localDeckName, setLocalDeckName] = useState(props.currentEditDeck.name);

    const handleChange = (event) => {
      setLocalDeckName(event.target.value);
    };

    const handleSubmit = (event) => {
      event.preventDefault(); // Prevent the form from closing the modal
      console.log("Form Data Submitted:", localDeckName);
  
      props.setCurrentEditDeck({ ...props.currentEditDeck, name: localDeckName });
  
      closeDecknameModal(); // Close the modal after submission
    };

    return (
      <dialog className="dialog-modal" ref={modalRef}>
        <h2>Enter a new name for your deck:</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="deckname-input">
            New Deck Name
            <input
              id="deckname-input"
              type="text"
              name="deckname"
              value={localDeckName}
              onChange={handleChange}
            />
          </label>
          <button className="standard-button" type="submit">
            submit
          </button>
        </form>
      </dialog>
    )
  }

  return (
    <div className="grid-container" id="deck-builder">
      <div className="grid-item">
        {/* left side */}
        <CardsList props={{ 
            allCards,
            currentEditDeck: props.currentEditDeck, 
            setCurrentEditDeck: props.setCurrentEditDeck,
            cardModalRef: cardModalRef,
            CardModal: CardModal,
            setSelectedCard: setSelectedCard
          }} />
      </div>
      <div className="grid-item">
        {/* right side */}
        <div className="deck-title-container">
          <h2 id="deck-title">{props.currentEditDeck.name}</h2>
          <button 
            className="standard-button" 
            onClick={openDecknameModal}
          >🖊</button>
          <DecknameModal />
        </div>
        <DeckStats props={{ 
            deckStats, 
            setCustomDecks: props.setCustomDecks,
            setMode: props.setMode,
            currentEditDeck: props.currentEditDeck,
            setCurrentEditDeck: props.setCurrentEditDeck,
          }} /> 
        <DeckList props={{ 
          currentEditDeck: props.currentEditDeck, 
          setCurrentEditDeck: props.setCurrentEditDeck,
          cardModal: cardModalRef,
          CardModal: CardModal,
          setSelectedCard: setSelectedCard
         }} />
      </div>
    </div>
  );
}