import { useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { capitalize } from "../server/utils";
import SearchResults from "../partials/SearchResults";


const placeholderMap = {
  "{s}": "/images/symbols/star.png", 
  "{g}": "/images/symbols/money.png",
  "{d}": "/images/symbols/dice.png",
  "{b}": "/images/symbols/bury.png"
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

export default function Results() {
  const location = useLocation();
  const { results } = location.state || { results: [] };

  return (
    <main>
      <ScrollToTop />
      <div className="grid-container" style={{ gridTemplateColumns: "100%" }}>
        <div className="grid-item">
          < SearchResults results={results} />
        </div>
      </div>
    </main>
  );
}
