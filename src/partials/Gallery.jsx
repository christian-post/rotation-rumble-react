import { Fragment, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CardImage from "../components/CardImage";
import Tooltip from "../components/Tooltip";
import { capitalize } from "../server/utils";


function GallerySection({ header, cards }) {
  // Collapsible gallery section
  const [open, setOpen] = useState(true);

  return (
    <Fragment>
      <div
        className="card-gallery-divider"
        onClick={() => setOpen(!open)}
        style={{ cursor: "pointer" }}
      >
        <h1>{header}</h1>
        <span>
          <i className={`fa fa-${open ? "minus" : "plus"}`} />
        </span>
      </div>
      {open && (
        <div className="card-gallery">
          {cards.map((card) => (
            <a key={card.id} href={`/card/${card.id}`} target="_blank">
              <CardImage props={{ card: card, sizing: "medium" }} />
            </a>
          ))}
        </div>
      )}
    </Fragment>
  );
}


export default function Gallery(props) {
  let { cards, aggregated, groupBy } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  if (!cards) {
    return (
      <div className="card-gallery">
        <div className="card-gallery-divider">
          <p>No cards</p>
        </div>
      </div>
    );
  }

  const formatAggHeader = (aggId) => {
    if (!aggId) return `No ${capitalize(groupBy)}`;
    if (aggId.includes(",")) return aggId.split(",").map(capitalize).join(", ");
    return capitalize(aggId);
  };

  // Check if there is a null item (no aggregation id)
  const nullItem = aggregated.find((item) => item._id === null);
  if (nullItem) {
    const otherItems = aggregated.filter((item) => item._id !== null);
    aggregated = [...otherItems, nullItem];
  }

  let startIndex = (nullItem) ? nullItem.count : 0; // Initialize startIndex for slicing

  const groupedCards = aggregated.map((agg) => {
    const endIndex = startIndex + agg.count; // Calculate the endIndex for the current group
    const groupCards = cards.slice(startIndex, endIndex); // Slice the cards array
    startIndex = endIndex; // Update startIndex for the next group

    return {
      agg,
      cards: groupCards,
    };
  });

  const handleGroupChange = (e) => {
    // TODO: if in the "results" route, don't navigate, instead sort props.cards
    const selectedGroup = e.target.value;
    const isResultsPage = location.pathname.startsWith("/results");
    const isCardGalleryPage = location.pathname.startsWith("/card-gallery");

    if (isResultsPage) {
      // TODO
    } else if (isCardGalleryPage) {
      navigate(`/card-gallery/${selectedGroup}`);
    }
  };

  return (
    <div className="card-gallery">
      <div className="card-gallery-controls">
        <label htmlFor="group-select">Group cards by:</label>
        <select
          id="group-select"
          value={groupBy}
          onChange={handleGroupChange}
        >
          <option value="cardtype">Card Type</option>
          <option value="type1">Type</option>
          <option value="color">Colors</option>
          <option value="set">Set</option>
          <option value="deck">Decks</option>
        </select>
      </div>
      {aggregated.length > 1 ? (
        <>
          {groupedCards.map(({ agg, cards }) => (
            <GallerySection
              key={agg._id}
              header={
                Array.isArray(agg._id)
                  ? agg._id.map(formatAggHeader).join(", ")
                  : formatAggHeader(agg._id)
              }
              cards={cards}
            />
          ))}
        </>
      ) : (
        cards.map((card) => (
          <a key={card.id} href={`/card/${card.id}`}>
            <CardImage props={{ card: card, sizing: "medium" }} />
          </a>
        ))
      )}
    </div>
  );
}


