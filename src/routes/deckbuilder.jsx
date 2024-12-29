import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import StartPage from "../partials/deckbuilder/StartPage";
import EditPage from "../partials/deckbuilder/EditPage";
import CaptainSelectPage from "../partials/deckbuilder/CaptainSelectPage";


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
  const [currentEditDeck, setCurrentEditDeck] = useState(null);
  const [customDecks, setCustomDecks] = useState(data.customDecks);
  // value that holds the selected captain object
  const [selectedCaptain, setSelectedCaptain] = useState(null);

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
            preconDeckNames, 
            preconDeckImages,
            customDecks,
            mode,
            setMode,
            setCurrentEditDeck
          }
        } />,
        edit: <EditPage props={
          { 
            mode, setMode, currentEditDeck, 
            setCustomDecks, selectedCaptain,
            setSelectedCaptain
          }
        } />,
        captainSelect: <CaptainSelectPage props={
          { 
            mode, setMode, currentEditDeck, 
            setCustomDecks, selectedCaptain,
            setSelectedCaptain
          }
        } />
      }[mode] || null}
    </main>
  )
}