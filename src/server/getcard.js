

export async function getSingleCard(cardId) {
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
