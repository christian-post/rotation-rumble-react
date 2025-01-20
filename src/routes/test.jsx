import React, { useEffect, useState } from "react";
import CardImage from "../components/CardImage";


export default function Test() {

  const card = {
      "_id": {
        "$oid": "676d80a1fe83b24400f3886a"
      },
      "name": "Mace",
      "set": "Core Set",
      "deck": [
        "Bows & Blades",
        "Clubs & Critters"
      ],
      "cardtype": "Item",
      "color": [
        "black"
      ],
      "dice": "No",
      "costs": 0,
      "effect1": "Equipped fighter gains +1 ATK.",
      "image_url": "http://rotation-rumble.com/images/mace.jpg",
      "id": "mace"
  };

  return (
    <main>
      <div className="grid-container" style={{ gridTemplateColumns: "100%" }}>
        <div className="grid-item" style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}>
         <CardImage props={{ card: card, sizing: "medium" }} />
         <CardImage props={
          { card: card, 
            sizing: "medium", 
            className: "card-image-medium wiggle-test2" }
          } />
         <CardImage props={
          { card: card, 
            sizing: "medium", 
            className: "card-image-medium wiggle-test1" }
          } />
        </div>
      </div>
    </main>
  );
}