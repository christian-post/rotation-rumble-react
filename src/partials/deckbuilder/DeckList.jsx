export default function DeckList({ props }) {
  // right side of the Edit Page that shows the deck list
  return (
    <div className="deck-container fixed-top">
      <table className="card-gallery-table" id="my-deck-table">
        <thead>
          <tr>
            <th className="sortable-table-col-head">
              <span>Name</span>
              <span>&#x25BC;</span>
            </th>
            <th className="sortable-table-col-head">
              <span>Card Type</span>
              <span>&#x25BC;</span>
            </th>
            <th className="sortable-table-col-head">
              <span>Colors</span>
              <span>&#x25BC;</span>
            </th>
            <th>Info</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {props.currentEditDeck.decklist.length > 0 ? (
            props.currentEditDeck.decklist.map((card) => (
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
                <td>💬</td>
                <td><button onClick={()=> {
                  // removes the card from the deck list
                  props.setCurrentEditDeck({
                    ...props.currentEditDeck,
                    decklist: props.currentEditDeck.decklist.filter((c) => c !== card)
                  });
                }}>❌</button></td>
              </tr>
            ))
          ) : (
            <>
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  <h3>Your deck is currently empty.</h3>
                </td>
              </tr>
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  <h3>Start by adding cards from the table on the left.</h3>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  )
}