import { useLoaderData } from "react-router-dom"
import CardImage from "../components/CardImage";


export default function Gallery({ cards }) {
  if (!cards) {
    return <>ERROR when loading card gallery</>
  }

  return (
    <div className="card-gallery">
        {
          cards.map( card => {
            return (
              <a key={card.id} href={`card/${card.id}`}>
                < CardImage data={{ card: card, sizing: "medium" }} />
              </a>
            );
          })
        }
    </div>
  );
}



