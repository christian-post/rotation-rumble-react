import { useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { capitalize } from "../server/utils";
import SearchResults from "../partials/SearchResults";


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
