import { useNavigate } from "react-router-dom";
import Gallery from "./Gallery";


export default function SearchResults({ results }) {
  const navigate = useNavigate();

  if (!results) {
    return <span>ERROR in rendering SearchResults</span>;
  }

  const header = results.explanation;
  const correction = results.correction;
  const correctionType = results.correctionType;
  const cards = results.cards || [];

  async function sendCorrectedSearch() {

    let data = {};
    data[correctionType] = correction;

    // search effects instead
    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("Failed to fetch search results");
      return;
    }

    const resultData = await response.json();

    // Navigate to results page with the fetched data
    navigate("/results", { state: { results: resultData } });
  }

  return (
    <>
      <div className="gallery-header grid-item" id="display-as">
        <h2>{ header }</h2>
        { correction ? (
          <h3>
            Did you mean <span
              className="fake-link"
              onClick={()=> { 
                sendCorrectedSearch();
              }}
              >
              &quot;{ correction }&quot;?</span>
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
          < Gallery 
            cards={cards}
            aggregated={[]}
            groupBy=""  
          />
        }
      </div>
    </>
  )
}