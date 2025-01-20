import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import CardImage from "../components/CardImage";


export default function Test() {
  const { cards, aggregated, groupBy, error } = useLoaderData();

  // turn the array into an object with key "id"
  const cardsObject = cards.reduce((acc, obj) => {
      acc[obj.id] = obj;
      return acc;
  }, {});

  const card = cardsObject["mett"]

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