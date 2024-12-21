import { useLoaderData } from "react-router-dom"
import CardImage from "../components/CardImage";


export default function Gallery({ cards }) {
  if (!cards) {
    return <>ERROR when loading card gallery</>
  }
  
  console.log("Cards array:", cards);

  return (
    <div className="card-gallery">
        {
          cards.map( card => {
            return (
              <a href={`card/${card.id}`}>
                < CardImage card={card} />
              </a>
            );
          })
        }
    </div>
  );
}



