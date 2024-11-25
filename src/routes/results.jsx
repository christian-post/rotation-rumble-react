import { useLocation } from "react-router-dom";



export default function Results() {
  const location = useLocation();
  const { results } = location.state || { results: [] };

  return (
    <main>
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
                    {/* Display card information (customize as needed) */}
                    <h2>{card.name}</h2>
                    <p>Type: {card.type}</p>
                    <p>Description: {card.description}</p>
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
