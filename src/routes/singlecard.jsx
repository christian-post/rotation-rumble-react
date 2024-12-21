import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { getSingleCard } from "../server/getcard";
import { capitalize } from "../server/utils";
import { replacePlaceholdersWithImages } from "./results";


export async function loader({ params }) {
  const card = await getSingleCard(params.cardId);

  if (card == undefined) {
    console.log("card is undefined")
    return { 
      error: `Card with ID "${params.cardId}" not found.`
    };
  };

  return { card };
}


function CardBody() {
  const { card, error } = useLoaderData();

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
        {card.effect1 && (
          <p>Effect 1: {replacePlaceholdersWithImages(card.effect1)}</p>
        )}
        {card.effect2 && (
          <p>Effect 2: {replacePlaceholdersWithImages(card.effect2)}</p>
        )}
        {card.effect3 && (
          <p>Effect 3: {replacePlaceholdersWithImages(card.effect3)}</p>
        )}
        {card.effect4 && (
          <p>Effect 4: {replacePlaceholdersWithImages(card.effect4)}</p>
        )}
      </div>
    </div>
    </>
  );
}





export function SingleCard() {
  // TODO: replace with components/CardImage ?
  const { card, error } = useLoaderData();

  const placeholderImage = "/images/Lazy-Load-MTG.jpg";

  // State to track if the actual image has loaded
  const [imageLoaded, setImageLoaded] = useState(false);

  // Image load handler
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const imageErrorHandler = (event) => {
    event.target.src = '/images/Image_Not_Found.jpg';
    setImageLoaded(true);
  }


  return (
    <main>
      <div className="grid-container" style={{ gridTemplateColumns: "100%" }}>
        <div className="grid-container singlecard-grid">
          {
            (card != undefined) ? 
            <>
            <div className="grid-item" id="singlecard-image">
              {!imageLoaded && (
                  <img
                    className="card-image-large pulsating-placeholder"
                    src={placeholderImage}
                    alt="Loading..."
                  />
                  )}
                  <img
                    className="card-image-large"
                    src={card.image_url}
                    alt={card.name}
                    loading="lazy"
                    onLoad={handleImageLoad}
                    onError={imageErrorHandler}
                    style={{ opacity: imageLoaded ? 1 : 0, transition: "opacity 0.3s" }}
                  />
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
