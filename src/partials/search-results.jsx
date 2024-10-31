export default function SearchResults() {
  // TODO handle search request
  const header = "Search results for \"[search]\":";
  const correction = null;
  const correctionType = null;
  const cards = [];

  return (
    <main>
      <div className="grid-container" style={{ gridTemplateColumns: "50% 50%;" }}>
        <div className="gallery-header grid-item" id="display-as">
          <h2>{ header }</h2>
          { correction ? (
            <h3>
              Did you mean <span
                className="fake-link"
                onclick={ `correctedSearch(${correction}, ${correctionType})` }
                >
                { correction }"</span>?
            </h3>
          ) : null }
        </div>

        <div className="grid-item" style= {{ gridColumn: "1 / span 2" }}>
          {/* <%- include('../partials/card-gallery-' + locals.query.as); %> */}
          { (cards.length === 0) ? (
            <div className="notFound-image-container">
              <img className="notFound-image" src="/images/rotation-rumble-no-card-found.jpg"/>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}