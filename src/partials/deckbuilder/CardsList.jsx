import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import Tooltip from "../../components/Tooltip";
import CardWindow from "../../components/CardWindow";

export default function CardsList({ props }) {
  // left side of the Edit Page that shows the available cards

  function filterTable(event) {
    // filters the cards table based on the input value
    const {value} = event.currentTarget;
    
    const table = document.getElementById("card-gallery-table");
    const rows = table.getElementsByTagName("tr");
    for (let i = 1; i < rows.length; i++) {
      const name = rows[i].getElementsByTagName("td")[0].textContent;
      const cardtype = rows[i].getElementsByTagName("td")[1].textContent;
      const costs = rows[i].getElementsByTagName("td")[2].textContent;

      if (name.toLowerCase().includes(value.toLowerCase()) || 
          cardtype.toLowerCase().includes(value.toLowerCase()) || 
          costs.toLowerCase().includes(value.toLowerCase())) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    }
  }

  function openCardWindow(card) {
    // TODO: make tooltip instead

    const newWindow = window.open(
      "",
      "_blank",
      "width=600,height=400,toolbar=no,menubar=no,scrollbars=yes,resizable=yes"
    );
  
    if (newWindow) {
      // Create a container div for the React app in the new window
      const container = newWindow.document.createElement("div");
      container.className = "card-window-parent";
      newWindow.document.body.appendChild(container);

      // Clone and append all <style> elements with the "data-vite-dev-id" attribute
      const styles = document.querySelectorAll('style[data-vite-dev-id]');
      styles.forEach((style) => {
        const clonedStyle = style.cloneNode(true);
        newWindow.document.head.appendChild(clonedStyle);
      });
  
      // Create a React root
      const root = createRoot(container);
  
      // Render the React component into the new window
      root.render(<CardWindow props={{card: card}} />);
  
      // Clean up when the new window is closed
      newWindow.onbeforeunload = () => {
        root.unmount();
      };
    } else {
      console.error("Failed to open new window.");
    }
  };

  return (
    <>
      <div className="all-cards-title">
        <h2>All Cards</h2>
      </div>
      <div className="ui-bar-horizontal">
        <label htmlFor="card-filter">Filter</label>
        <input 
          type="text" 
          id="card-filter" 
          name="card-filter" 
          placeholder="Name or Cardtype"
          onChange={filterTable}
        />
        <Tooltip 
          content="Filter the cards by name or card type" 
          position="right"
        >
          <i className="fa fa-question-circle" />
        </Tooltip>
      </div>
      {props.allCards.length > 0 ? (<table className="card-gallery-table" id="card-gallery-table">
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
            <th>Add to Deck</th>
          </tr>
        </thead>
        <tbody>
          {props.allCards.map((card) => (
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
                <p 
                  onClick={()=> openCardWindow(card)}
                  style={{ cursor: "pointer" }}
                >💬</p>
              </td>
              <td>
                {!props.currentEditDeck.decklist.some(
                  (deckCard) => deckCard.name === card.name
                ) && (
                  <button
                    className="deckbuilder-table-button"
                    onClick={() => {
                      // Add the card to the deck list
                      props.setCurrentEditDeck({
                        ...props.currentEditDeck,
                        decklist: [...props.currentEditDeck.decklist, card],
                      });
                    }}
                  >
                    <i 
                      className="fa fa-plus"
                      style={{ color: "grey", fontSize: "24px" }} 
                    />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>) : <div><h2>Loading the cards list...</h2></div>}
    </>
  );
}