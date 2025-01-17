import { useState, useEffect } from "react";
import Tooltip from "../../components/Tooltip";
import CardImage from "../../components/CardImage";


export default function CaptainSelectPage({ props }) {
  const [allCaptains, setAllCaptains] = useState([]);

  useEffect(() => {
    // load Captain images into the allCaptains array
    fetch("/api/all-cards")
      .then((res) => res.json())
      .then((data) => setAllCaptains(
        data.cards.filter((card) => card.cardtype == "Captain")));
  }, []);

  function goToDeckEdit(captain) {
    props.setCurrentEditDeck({...props.currentEditDeck, captain: captain});
    props.setMode("edit");
  }

  return (
    <div className="grid-container">
      <div className="grid-item" style={{ gridColumn: "1 / span 2" }}>
        <div className="card-gallery">
          <div className="card-gallery-divider">
            <h2>Select your Captain first:</h2>
          </div>
          {allCaptains.map((captain) => (
            <div 
              key={captain.id} 
              onClick={()=> goToDeckEdit(captain)} 
              style={{ cursor: "pointer" }}
            >
              <CardImage props={{ card: captain, sizing: "medium" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}