import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import Gallery from "../partials/Gallery";


export default function CardGallery() {
  const { cards, aggregated, groupBy, error } = useLoaderData();

  // TODO: error handling

  return (
    <main>
      <div
        className="grid-container"
        style={{ gridTemplateColumns: "50% 50%" }}
      >
        <div className="grid-item" style={{ gridColumn: "1 / span 2" }}>
          <Gallery 
            cards={cards}
            aggregated={aggregated}
            groupBy={groupBy}
          />
        </div>
      </div>
    </main>
  );
}