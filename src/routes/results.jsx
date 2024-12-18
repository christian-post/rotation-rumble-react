import { useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { capitalize } from "../server/utils";


const placeholderMap = {
  "{s}": "/images/star.png", 
  "{g}": "/images/money.png",
  "{d}": "/images/dice.png",
  "{b}": "/images/bury.png"
};



export function replacePlaceholdersWithImages(text) {
  // Use a regular expression to find placeholders 
  // and replace them with <img> elements
  return text.split(/(\{.*?\})/).map((segment, index) => {
    if (placeholderMap[segment]) {
      return (
        <img
          key={index}
          src={placeholderMap[segment]}
          alt={segment}
          className="inline-symbol"
        />
      );
    }
    return segment;
  });
}

const correctedSearch = (results) => {
  // TODO
  return;
}


export default function ResultsNew() {
  const location = useLocation();
  const { results } = location.state || { results: [] };

  return (
    <main>
      <div class="grid-container" style="grid-template-columns: 50% 50%;">
        <div class="gallery-header grid-item" id="display-as">
          <h2>Search results for [...]</h2>
          {results.correction && (
            // show search correction if necessary
            <h3>
              Did you mean <span
                className="fake-link"
                onClick={() => correctedSearch(results)}
                >
                {results.correction}</span>?
            </h3>
          )}
        </div>
        <div class="grid-item" style="grid-column: 1 / span 2">
          {/* <%- include('../partials/card-gallery-' + locals.query.as); %> */}
          {!results.cards.length && 
            <div class="notFound-image-container">
              <img class="notFound-image" src="/images/rotation-rumble-no-card-found.jpg"/>
            </div>
          }
        </div>
      </div>
    </main>
  )
}


export default function Results() {
  const location = useLocation();
  const { results } = location.state || { results: [] };

  return (
    <main>
      <ScrollToTop />
      <div className="grid-container" style={{ gridTemplateColumns: "100%" }}>
        <div className="grid-item">
          <div>
            <h1>Search Results</h1>
            <p>{results.explanation}</p>
            {/* Render the list of results */}
            <ul>
              {results.cards && results.cards.length > 0 ? (
                results.cards.map((card, index) => (
                  <li key={index}>
                    <div>
                      <a href={`card/${card.id}`}>
                        <h2>{card.name}</h2>
                      </a>
                      <p>Set(s): {card.set}</p>
                      <p>Deck(s): {card.deck.join(", ")}</p>
                      <p>Color(s): {card.color.map(capitalize).join(", ")}</p>
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
                  </li>
                ))
              ) : (
                <p>No results found.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
