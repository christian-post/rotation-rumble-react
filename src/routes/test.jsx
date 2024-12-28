import { 
  Form, 
  useNavigate, 
  useLocation
} from "react-router-dom";
import React, { useEffect, useState } from "react";


const Decklists = ({ decklists }) => {
  if (!decklists) {
    return <p>Loading decklists...</p>;
  }

  return (
    <div>
      {Object.entries(decklists).map(([deck, cards]) => (
        <div key={deck} style={{ marginBottom: "20px" }}>
          <h2>{deck}</h2>
          <ul>
            {cards.map((card) => (
              <li key={card.id}>
                <a href={`/card/${card.id}`}>{card.name}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};


const OrderDisplay = ({ order }) => {
  // displays the order
  if (!order) {
    return (
      <div>
        <p>Awaiting your order...</p>
      </div>
    );
  }

  return (
    <div>
      <a href={order.url}>Put deck into cart</a>
    </div>
  );
}


export default function Test() {
  const [decklists, setDecklists] = useState({});
  const [order, displayOrder] = useState({});

  async function handleSubmit(event) {
    //  function for the test button
    event.preventDefault();

    const response = await fetch("/api/test/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Hello, World"}),  // TODO: just a dummy
    });

    if (!response.ok) {
      console.error("Failed to fetch search results.");
      return;
    }

    const responseData = await response.json();
    setDecklists(responseData.decklists)
  }


  async function testDeckOrder() {
    const response = await fetch("/api/test-shop/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
  
    const res = await response.json()
  
    if (!response.ok) {
      console.error(response.status, response.statusText);
      alert(`Error: ${res.message} (${res.code})`);
      return;
    }
  
    const productId = res.id;
  
    const cartUrl = `https://beaverlicious.com/?add-to-cart=${productId}`;

    displayOrder({
      url: cartUrl
    });
  
    // alert(`Deck submitted successfully! Go to https://beaverlicious.com/ to check your order.`);
  }


  return (
    <main>
      <div className="grid-container" style={{ gridTemplateColumns: "100%" }}>
        <div className="grid-item">
          <button onClick={ testDeckOrder }>Test Shop API</button>
          <Form onSubmit={ handleSubmit } id="test-form1">
            <button type="submit">Show Decklists</button>
          </Form>
        </div>
        <Decklists decklists={decklists}/>
        <OrderDisplay order={order}/>
      </div>
    </main>
  );
}