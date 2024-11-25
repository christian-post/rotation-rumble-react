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
          </div>
        </div>
      </div>
    </main>
  );
}
