import { useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { capitalize } from "../server/utils";
import SearchResults from "../partials/SearchResults";


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


// export default function ResultsNew() {
//   const location = useLocation();
//   const { results } = location.state || { results: [] };

//   return (
//     <main>
//       <div class="grid-container" style="grid-template-columns: 50% 50%;">
//         <div class="gallery-header grid-item" id="display-as">
//           <h2>Search results for [...]</h2>
//           {results.correction && (
//             // show search correction if necessary
//             <h3>
//               Did you mean <span
//                 className="fake-link"
//                 onClick={() => correctedSearch(results)}
//                 >
//                 {results.correction}</span>?
//             </h3>
//           )}
//         </div>
//         <div class="grid-item" style="grid-column: 1 / span 2">
//           {/* <%- include('../partials/card-gallery-' + locals.query.as); %> */}
//           {!results.cards.length && 
//             <div class="notFound-image-container">
//               <img class="notFound-image" src="/images/rotation-rumble-no-card-found.jpg"/>
//             </div>
//           }
//         </div>
//       </div>
//     </main>
//   )
// }


export default function Results() {
  const location = useLocation();
  const { results } = location.state || { results: [] };

  console.log(results)

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
