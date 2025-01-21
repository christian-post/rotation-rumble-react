export default async function galleryLoader({ params }) {
  const groupBy = params.groupBy;
  
  const request = await fetch(`/api/all-cards?groupBy=${groupBy}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  const { cards, aggregated } = await request.json();

  if (cards == undefined) {
    console.log("cards is undefined")
    return { 
      error: `Cards not found.`
    };
  };

  return { cards, aggregated, groupBy };
}