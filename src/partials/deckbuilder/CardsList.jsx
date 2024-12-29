export default function CardsList({ props }) {
  // left side of the Edit Page that shows the available cards

  function filterTable(event) {
    // filters the table based on the input value
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
          placeholder="Name, Cardtype, or Costs"
          onChange={filterTable}
        />
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
              <span>Costs</span>
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
              <td>{card.costs}</td>
              <td>💬</td>
              <td>
                {!props.deckList.includes(card) && <button onClick={()=> {
                  // adds the card to the deck list
                  props.setDeckList([...props.deckList, card]);
                }}>➕</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>) : <div><h2>Loading the cards list...</h2></div>}
    </>
  );
}