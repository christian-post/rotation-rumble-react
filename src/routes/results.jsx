import { useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";


export default function Results() {
  const location = useLocation();
  const { results } = location.state || { results: [] };

  return (
    <main>
      < ScrollToTop />
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
                      <h2>{card.name}</h2>
                      <p>Set(s): {card.set}</p>
                      <p>Deck(s): {card.deck.join(", ")}</p>
                      <p>Color(s): {card.color.join(", ")}</p>
                      {card.effect1 && <p>Effect 1: {card.effect1}</p>}
                      {card.effect2 && <p>Effect 2: {card.effect2}</p>}
                      {card.effect3 && <p>Effect 3: {card.effect3}</p>}
                      {card.effect4 && <p>Effect 4: {card.effect4}</p>}
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
