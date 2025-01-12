import { useState, useEffect } from "react";


export default function DeckList({ props }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [sortedCards, setSortedCards] = useState([]);

  useEffect(() => {
      const sortData = () => {
        const sorted = [...props.currentEditDeck.decklist].sort((a, b) => {
          if (sortConfig.key) {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
  
            if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        });
        setSortedCards(sorted);
      };
  
      sortData();
    }, [props.currentEditDeck.decklist, sortConfig]);
  
    const requestSort = (key) => {
      let direction = "asc";
      if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
      setSortConfig({ key, direction });
    };

  // right side of the Edit Page that shows the deck list
  return (
    <div className="deck-container fixed-top">
      <div className="deck-header">
        <h2>My Deck</h2>
      </div>
      {props.currentEditDeck.decklist.length > 0 ? (
        <table className="card-gallery-table" id="my-deck-table">
          <thead>
            <tr>
              <th
                className="sortable-table-col-head"
                onClick={() => requestSort("name")}
              >
                <div>
                  <span>Name</span>
                  <i
                    className={`sort-button fa ${
                      sortConfig.key === "name"
                        ? `fa-sort-${sortConfig.direction}`
                        : "fa-sort"
                    }`}
                    style={{ fontSize: "24px" }}
                  />
                </div>
              </th>
              <th
                className="sortable-table-col-head"
                onClick={() => requestSort("cardtype")}
              >
                <div>
                  <span>Card Type</span>
                  <i
                    className={`sort-button fa ${
                      sortConfig.key === "cardtype"
                        ? `fa-sort-${sortConfig.direction}`
                        : "fa-sort"
                    }`}
                    style={{ fontSize: "24px" }}
                  />
                </div>
              </th>
              <th
                className="sortable-table-col-head"
                onClick={() => requestSort("color")}
              >
                <div>
                  <span>Colors</span>
                  <i
                    className={`sort-button fa ${
                      sortConfig.key === "color"
                        ? `fa-sort-${sortConfig.direction}`
                        : "fa-sort"
                    }`}
                    style={{ fontSize: "24px" }}
                  />
                </div>
              </th>
              <th>Info</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {sortedCards.map((card) => (
              <tr key={card.name}>
                <td>{card.name}</td>
                <td>{card.cardtype}</td>
                <td>
                  {card.color.map((color) => (
                    <span
                      key={color}
                      className="color-circle"
                      style={{ backgroundColor: color }}
                      aria-label={`Color: ${color}`}
                    >
                      {color[0]}
                    </span>
                  ))}
                </td>
                <td>
                  <p onClick={() => openCardWindow(card)} style={{ cursor: "pointer" }}>
                    💬
                  </p>
                </td>
                <td>
                  <button
                    className="deckbuilder-table-button"
                    onClick={() => {
                      props.setCurrentEditDeck({
                        ...props.currentEditDeck,
                        decklist: props.currentEditDeck.decklist.filter(
                          (c) => c !== card
                        ),
                      });
                    }}
                  >
                    <i
                      className="fa fa-times"
                      style={{ color: "red", fontSize: "24px" }}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h3>Your deck is currently empty.</h3>
          <h3>Start by adding cards from the table on the left.</h3>
        </div>
      )}
    </div>
  );
}