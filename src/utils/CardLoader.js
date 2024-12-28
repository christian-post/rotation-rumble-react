// Loader for Singlecard.jsx
import { getSingleCard } from  "../server/getcard.js";


export default async function cardLoader({ params }) {
  // on page load, gets the data for this card ID
  const card = await getSingleCard(params.cardId);

  if (card == undefined) {
    console.log("card is undefined")
    return { 
      error: `Card with ID "${params.cardId}" not found.`
    };
  };

  return { card };
}