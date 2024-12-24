import Gallery from "./Gallery";
import { useLoaderData } from "react-router-dom";


export default function SearchResults({ results }) {
  if (!results) {
    return <span>ERROR in rendering SearchResults</span>;
  }

  const header = results.explanation;
  const correction = results.correction;
  const correctionType = results.correctionType;
  const cards = results.cards || [];

  return (
    <>
      <div className="gallery-header grid-item" id="display-as">
        <h2>{ header }</h2>
        { correction ? (
          <h3>
            Did you mean <span
              className="fake-link"
              // onClick={ ()=> { 
              //   // TODO: Link to corrected search
              // } }
              >
              { correction }"</span>?
          </h3>
        ) : null }
      </div>

      <div className="grid-item" style= {{ gridColumn: "1 / span 2" }}>
        { (cards.length === 0) ? (
          <div className="notFound-image-container">
            <img 
              className="notFound-image" 
              src="/images/rotation-rumble-no-card-found.jpg"
            />
          </div>
        ) : 
          < Gallery cards={cards} />
        }
      </div>
    </>
  )
}