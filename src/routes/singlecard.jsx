import { useLoaderData } from "react-router-dom";
import { getSingleCard } from "../server/getcard";


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

export default function SingleCard() {
  const { card, error } = useLoaderData();

  return (
    <main>
      <div className="grid-container" style={{ gridTemplateColumns: "100%" }}>
        <div className="grid-item">
            <p>{ (card == undefined) ? error : card.name }</p>
        </div>
      </div>
    </main>
  );
}
