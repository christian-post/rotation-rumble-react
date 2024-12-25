import { Fragment } from "react";
import CardImage from "../components/CardImage";
import Tooltip from "../components/Tooltip";
import { capitalize } from "../server/utils";


export default function Gallery({ cards, aggregated }) {
  if (!cards) {
    return <>ERROR when loading card gallery</>
  }

  let i = 0; // Start index for slicing

  return (
    <div className="card-gallery">
      {aggregated ? (
        aggregated.map((agg) => (
          <Fragment key={agg._id}>
            <div className="card-gallery-divider">
              <h1>{
                // capitalize Aggregation Field
                // first check if the type is array or string
                (typeof agg == Array) ?
                agg._id.map(capitalize).join(", ") :
                capitalize(agg._id)
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
        ))
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



