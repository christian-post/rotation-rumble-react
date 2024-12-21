import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import Gallery from "../partials/gallery";


export async function loader({ params }) {
  const request = await fetch(`/api/all-cards`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  const cards = await request.json();

  if (cards == undefined) {
    console.log("cards is undefined")
    return { 
      error: `Cards not found.`
    };
  };

  return { cards };
}


export function CardGallery() {
  const { cards, error } = useLoaderData();

  console.log(cards)

  return (
    <main>
      <div
        className="grid-container"
        style={{ gridTemplateColumns: "50% 50%" }}
      >
        <div className="grid-item" style={{ gridColumn: "1 / span 2" }}>
          <Gallery cards={cards} />
        </div>
      </div>
    </main>
  );
}