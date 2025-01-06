// Loader for Singlecard.jsx

async function getSingleCard(cardId) {
  const card = await fetch(`/api/card/${cardId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!card.ok) {
    console.error(`Failed to fetch card with ID ${cardId}`);
    return;
  }

  return await card.json();
}

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