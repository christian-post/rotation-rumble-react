import { Fragment } from "react";
import CardImage from "../components/CardImage";
import Tooltip from "../components/Tooltip";
import { capitalize } from "../server/utils";


export default function Gallery(props) {
  let { cards, aggregated, groupBy } = props;

  if (!cards) {
    return (
      <div className="card-gallery">
        <div className="card-gallery-divider">
          <p>No cards</p>
        </div>
      </div>
    )
  }

  let i = 0; // Start index for slicing

  const formatAggHeader = function(aggId) {
    if (!aggId) return `No ${capitalize(groupBy)}`;
    return capitalize(aggId);
  }

  // check if there is a null item (no aggregation id)
  const nullItem = aggregated.find(item => item._id === null);
  if (nullItem) {
    const otherItems = aggregated.filter(item => item._id !== null);
    aggregated = [...otherItems, nullItem];
  }

  return (
    <div className="card-gallery">
      {(aggregated.length > 1) ? (
        <>
          <div className="card-gallery-divider">
            <h2>{`All cards, grouped by: ${capitalize(groupBy)}`}</h2>
          </div>
          {aggregated.map((agg) => (
            <Fragment key={agg._id}>
              <div className="card-gallery-divider">
                <h1>{
                  // capitalize Aggregation Field
                  // first check if the type is array or string
                  (typeof agg == Array) ?
                  agg._id.map(formatAggHeader).join(", ") :
                  formatAggHeader(agg._id)
                }</h1>
              </div>
              <div className="card-gallery">
                {cards.slice(i, i + agg.count).map((card) => {
                  i++;
                  return (
                    <Tooltip key={card.id} content={card.name}>
                      <a href={`/card/${card.id}`}>
                        <CardImage data={{ card: card, sizing: "medium" }} />
                      </a>
                    </Tooltip>
                    
                  );
                })}
              </div>
            </Fragment>
          ))}
        </>
      ) : (
        cards.map((card) => (
          <a key={card.id} href={`/card/${card.id}`}>
            <CardImage data={{ card: card, sizing: "medium" }} />
          </a>
        ))
      )}
    </div>
  );
}



