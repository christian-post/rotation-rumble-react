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


async function testShopApi() {
  const response = await fetch("/api/test-shop/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: "Hello, World"}),  // TODO: just a dummy
  });

  if (!response.ok) {
    console.error("Failed to fetch search results");
    return;
  }
}


export default function Test() {
  const [decklists, setDecklists] = useState({});

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
      console.error("Failed to fetch search results");
      return;
    }

    const responseData = await response.json();
    setDecklists(responseData.decklists)
  }

  return (
    <main>
      <div className="grid-container" style={{ gridTemplateColumns: "100%" }}>
        <div className="grid-item">
          <button onClick={ testShopApi }>Test Shop API</button>
          <Form onSubmit={ handleSubmit } id="test-form1">
            <button type="submit">Show Decklists</button>
          </Form>
        </div>
        <Decklists decklists={decklists}/>
      </div>
    </main>
  );
}