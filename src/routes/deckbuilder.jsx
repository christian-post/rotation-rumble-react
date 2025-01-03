import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import StartPage from "../partials/deckbuilder/StartPage";
import EditPage from "../partials/deckbuilder/EditPage";
import CaptainSelectPage from "../partials/deckbuilder/CaptainSelectPage";
import DeckOverview from "../partials/deckbuilder/DeckOverview";
import ErrorPage from "./error-page";
import LoadingPlaceholder from "./loading-placeholder";

export default function Deckbuilder() {
  const { data, error } = useLoaderData();

  if (error) {
    return <ErrorPage displayedError={error}/>;
  }

  if (!data) {
    return <LoadingPlaceholder />;
  }

  // Mode defines which children are rendered
  // start, edit, captainSelect, overview
  const [mode, setMode] = useState("start"); 
  // value that holds the current deck object which can be edited
  const [currentEditDeck, setCurrentEditDeck] = useState({
    decklist: [],
    id: null,
    name: "New Deck",
    captain: null
  });

  console.log(currentEditDeck);

  // all decks from localForage
  const [customDecks, setCustomDecks] = useState(data.customDecks);

  const preconDeckNames = Object.keys(data.preconDecklists)

  // TODO: put in own file
  // maps the deck names to the corresponding images
  const preconDeckImages = {
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
        start: <StartPage props={
          { 
            mode,
            setMode,
            preconDeckNames, 
            preconDeckImages,
            customDecks,
            setCustomDecks,
            setCurrentEditDeck
          }
        } />,
        edit: <EditPage props={
          { 
            mode, 
            setMode, 
            currentEditDeck, 
            setCurrentEditDeck,
            setCustomDecks
          }
        } />,
        captainSelect: <CaptainSelectPage props={
          { 
            mode, 
            setMode, 
            currentEditDeck,
            setCurrentEditDeck,
            setCustomDecks
          }
        } />,
        overview: <DeckOverview props={
          { 
            mode, 
            setMode, 
            currentEditDeck, 
            setCustomDecks
          }
        } />
      }[mode] || null}
    </main>
  )
}