import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { capitalize } from "../server/utils";
import { replacePlaceholdersWithImages } from "./results";
import CardImage from "../components/CardImage";


function CardBody() {
  const { card, error } = useLoaderData();

  // TODO error handling

  switch (card.cardtype) {
    case "Fighter":
      return (
        <table className="card-stats-table">
          <tbody>
            <tr>
              <td>DMG <span className="span-bold">{card.dmg}</span></td>
              <td>Dice <span className="span-bold">{card.dice}</span></td>
            </tr>
            <tr>
              <td>DEF <span className="span-bold">{card.def}</span></td>
              <td>Set <span className="span-bold">{card.set}</span></td>
            </tr>
          </tbody>
        </table>
      );
    default:
      return (
        <table className="card-stats-table">
          <tbody>
            <tr>
              <td>
                Costs <span className="span-bold">{card.costs} </span>
                <img className="inline-image" src="/images/money.png" alt="M"></img>
              </td>
              <td>Set <span className="span-bold">{card.set}</span></td>
            </tr>
          </tbody>
        </table>
      )
  }
}


export function CardInfo() {
  const { card, error } = useLoaderData();

  // TODO error handling

  return (
    <>
    <div className="card-text">
      <div className="card-title-container">
        <span className="card-title">{card.name}</span>
      </div>

      <div className="flavor-text-container">
        <span className="flavor-text">{card.flavour}</span>
      </div>

      <div>
        <span className="card-type-text" data-cardtype={card.cardtype}>
          {card.cardtype}
          <span> &#8212; </span>
          <span id="card-color">{card.color.map(capitalize).join(", ")}</span>
        </span>
      </div>
      <div>
        <CardBody card={card} />
      </div>
      <div>
        {Array.from({ length: 4 }, (_, i) => {
          const key = `effect${i + 1}`;
          return (
            card[key] && (
              <div 
                key={key}
                className="card-stats-effects"
              >
                <p>
                  <span className="span-bold | card-effect">
                    <span className="effect-name">
                      {`Effect ${i + 1}`}
                    </span>
                  </span>
                </p>
                <p className="single-card-effect">
                  {replacePlaceholdersWithImages(card[key])}
                </p>
              </div>
            )
          );
        })}
      </div>
    </div>
    </>
  );
}



export default function SingleCard() {
  const { card, error } = useLoaderData();

  return (
    <main>
      <div className="grid-container" style={{ gridTemplateColumns: "100%" }}>
        <div className="grid-container singlecard-grid">
          {
            (card != undefined) ? 
            <>
            <div className="grid-item" id="singlecard-image">
              <CardImage data={{ card: card, sizing: "large" }}/>
            </div>
            <div className="grid-item">
              <CardInfo card={card}/>
            </div>
            </> : 
            <div className="grid-item">
              <h1>Oops, this card does not exist 😅</h1>
            </div>
          }
            {/* <div className="add-to-deck-container" id="add-to-deck-container">
              <input 
                type="button" 
                className="add-to-deck-button" 
                value="Add to current deck"
                onclick="addCardfromSinglecard()"
              >
            </div> */}
        </div>
      </div>
    </main>
  );
}
