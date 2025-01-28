import React, { useState, useEffect, useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import CustomTooltip from "../../components/Tooltip";
import CardImage from "../../components/CardImage";
import { download } from "../../utils/common";
import colormaps from "../../utils/colormaps";

ChartJS.register(ArcElement, Tooltip, Legend);


function deckToString(deck) {
  return JSON.stringify({
    deckname: deck.name,
    captain: deck.captain.name,
    cards: deck.decklist.map((card) => card.name),
    image: deck.captain.image_url
  });
}


function DeckTable({ cards }) {
  // Group cards by their cardtype and return a sectioned list of cards
  const groupedCards = cards.reduce((acc, card) => {
    acc[card.cardtype] = acc[card.cardtype] || [];
    acc[card.cardtype].push(card);
    return acc;
  }, {});

  return (
    <div id="decklist-body">
      {Object.keys(groupedCards).map((cardtype) => (
        <section key={cardtype} id={`decklist-section-${cardtype}`}>
          <h2>{`${cardtype} (${groupedCards[cardtype].length})`}</h2>
          <ul id={`decklist-ul-${cardtype}`}>
            {groupedCards[cardtype].map((card) => (
              <li key={card.id}>
                {card.name}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};


function CardView({ cards }) {
  return (
    <div className="card-gallery">
      {cards.map((card) => {
        return (
          <CustomTooltip key={card.id} content={card.name}>
            <a href={`/card/${card.id}`} target="_blank" rel="noreferrer">
              <CardImage props={{ card: card, sizing: "medium" }} />
            </a>
          </CustomTooltip>
        );
      })}
    </div>
  );
}


function Statistics({ deck }) {
  // shows the color and cardtype distribution of the deck
  const colormap = colormaps.rainbow;

  const colorCode = {
    red: 'rgb(212, 50, 39)',
    blue: 'rgb(72, 164, 215)',
    black: 'rgb(160, 160, 160)',
    green: 'rgb(76, 147, 89)'
  };

  // charts for cardtype and color
  const cardtypeAcc = deck.decklist.reduce((acc, card) => {
    acc[card.cardtype] = acc[card.cardtype] || 0;
    acc[card.cardtype]++;
    return acc;
  }, {});

  const cardtypeChartData = {
    labels: Object.keys(cardtypeAcc),
    datasets: [
      {
        data: Object.values(cardtypeAcc),
        backgroundColor: [
          colormap[0],
          colormap[5],
          colormap[10],
          colormap[15],
          colormap[19],
        ]
      },
    ],
  };

  const cardtypeChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  let colorAcc = deck.decklist.reduce((acc, card) => {
    card.color.forEach((color) => {
      acc[color] = acc[color] || 0;
      acc[color]++;
    });
    return acc;
  }, {});

  const colorChartData = {
    labels: Object.keys(colorAcc),
    datasets: [
      {
        data: Object.values(colorAcc),
        backgroundColor: Object.keys(colorAcc).map((color) => colorCode[color]),
      },
    ],
  };

  const colorChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "none",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const [showCardtypeChart, setShowCardtypeChart] = useState(false);
  const [showColorChart, setShowColorChart] = useState(false);

  useEffect(() => {
    setShowCardtypeChart(true);
    const timer = setTimeout(() => setShowColorChart(true), 100); // Delay second chart
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="stats-container">
    <div className="stats-element">
      <h2>Color Distribution</h2>
      <Pie data={colorChartData} options={colorChartOptions}/>
    </div>
    <div className="stats-element">
      <h2>Cardtype Distribution</h2>
      <Pie data={cardtypeChartData} options={cardtypeChartOptions}/>
    </div>
    </div>
  )
}


function DeckShare({ deck }) {
  // shows the decklist as a string and allows the user to copy it to clipboard
  const [tooltip, setTooltip] = useState("Copy to Clipboard");

  function copyToClipboard() {
    let str = document.querySelector('#decklistString').value;
    navigator.clipboard.writeText(str);
    setTooltip("Deck Copied!");
  }

  // convert the deck to a string
  let deckString = `[deck="${deck.name}"]\n`;
  deckString += `//Captain\n${deck.captain?.name}\n\n//Deck\n`;
  deckString += deck.decklist.map(
    (card) => `${card.name}`).join("\n");

  return (
    <div className="decklistString-container">
      <textarea
        id="decklistString"
        rows="15" 
        cols="30"
        value={deckString}
        readOnly
      />
      <CustomTooltip content={tooltip} position={"right"}>
        <button
          onClick={copyToClipboard}
          onMouseLeave={()=> setTooltip("Copy to Clipboard")}
        >Copy to Clipboard</button>
      </CustomTooltip>
      <button
        onClick={()=> download(deckString, `${deck.name}.txt`)}
      >
        Save Deck to Text File
      </button>
    </div>
  );
}


function DeckOrder({ deckString, deck }) {
  const [order, setOrder] = useState({ productID: undefined });
  const [urlBroken, setUrlBroken] = useState(false);
  const [animCount, setAnimCount] = useState(0);
  const [status, setStatus] = useState("idle"); // idle, loading, success

  useEffect(() => {
    if (status === "loading") {
      // Waiting animation
      const interval = setInterval(() => {
        setAnimCount((prev) => (prev + 1) % 4);
      }, 600);

      return () => clearInterval(interval);
    }
  }, [status]);

  async function orderDeck() {
    try {
      const response = await fetch("/api/test-shop/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: deckString,
      });
  
      let res;
      try {
        // Parse JSON if response is expected to be JSON
        res = response.ok && response.headers.get("Content-Type")?.includes("application/json")
          ? await response.json()
          : {};
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        res = {};
      }
  
      if (!response.ok) {
        console.error(response.status, response.statusText);
        alert(
          `Error: ${res?.message || "Unknown error"} (${
            res?.code || response.status
          })`
        );
        setUrlBroken(true);
        setStatus("idle");
        return;
      }
  
      if (!res?.id) {
        console.error("Invalid response: Missing `id`");
        alert("The server returned an invalid response. Please try again.");
        setUrlBroken(true);
        setStatus("idle");
        return;
      }
  
      setOrder({
        productID: res.id,
      });
      setStatus("success");
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An unexpected error occurred. Please try again later.");
      setUrlBroken(true);
      setStatus("idle");
    }
  }
  
  const handleGenerateOrder = () => {
    setStatus("loading");
    setUrlBroken(false);
    orderDeck();
  };

  return (
    <div>
      <h2>Deck Order</h2>
      {deck ? (
        <div>
          <p>Deck Name: {deck.name}</p>
          <p>Deck Captain: {deck.captain?.name}</p>
          <br />
            {(deck.decklist.length === 10) ? (<>
              {status === "idle" && (
                <button onClick={handleGenerateOrder}>Generate Order</button>
              )}
              {status === "loading" && (
                <p className="url-waiting-animation">
                  Generating URL, this may take a couple seconds
                  {".".repeat(animCount)}
                </p>
              )}
              {status === "success" && order.productID !== undefined && (
                <a
                  href={`https://beaverlicious.com/?add-to-cart=${order.productID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Put deck into cart
                </a>
              )}
            </>) : (
              <p style={{ color: "red" }}>Warning: Your deck must contain exactly 10 cards to order (not including your Captain)!</p>
            )}
            
            {urlBroken && <p>URL generation failed. Please try again later.</p>}
        </div>
      ) : (
        <p>No deck selected.</p>
      )}
    </div>
  );
}



export default function DeckOverview({ props }) {
  // shows the deck list and deck stats with tabs

  const [activeTab, setActiveTab] = useState(0);
  const memoizedDeck = useMemo(
    () => deckToString(props.currentEditDeck), 
    [props.currentEditDeck]
  );

  const tabs = [
    "🧾 Table View",
    "👀 Card View",
    "📊 Statistics",
    "↪ Share",
    "🛒 Order"
  ]

  const content = [
    (
      <div className="tabcontent">
        <div className="decklist-header">
          <p>{props.currentEditDeck?.name}</p>
        </div>
        <div className="decklist">
          <DeckTable cards={props.currentEditDeck?.decklist} />
          <div className="decklist-leader-container">
            <img
              className="card-image-medium"
              id="leader-image"
              src={props.currentEditDeck?.captain.image_url}
              alt={props.currentEditDeck?.captain.name}
            />
          </div>
        </div>
      </div>
    ),
    (
      <div className="tabcontent">
        <div className="visual-tab-leader-container">
          <div className="wiggle-image">
            <img
              className="card-image-medium"
              id="leader-image"
              src={props.currentEditDeck?.captain.image_url}
              alt={props.currentEditDeck?.captain.name}
            />
            <div className="leader-ribbon-image">
              <img
                src="/images/\sxtEOEYA.png"
              />
            </div>
          </div>
        </div>
        <div className="visual-tab-card-container">
          <CardView cards={props.currentEditDeck?.decklist} />
        </div>
      </div>
    ),
    (
      <div className="tabcontent">
        <Statistics deck={props.currentEditDeck} />
      </div>
    ),
    (
      <div className="tabcontent">
        <DeckShare deck={props.currentEditDeck} />
      </div>
    ),
    (
      <div className="tabcontent">
        <DeckOrder deckString={memoizedDeck} deck={props.currentEditDeck} />
      </div>
    )
  ];


  return (
      <div className="visual-deckstats-body">
        <div className="deckstats-header">
          <button 
            className="standard-button" 
            onClick={()=> props.setMode("edit")}
          >🖊 Edit Deck</button>
          <button 
            className="standard-button"
            onClick={()=> props.setMode("start")}
          >
            🔙 Go Back
          </button>
        </div>
        <div className="tab">
          {tabs.map((tab, index) => (
            <button 
              className="tablinks" 
              onClick={()=> setActiveTab(index)}
              key={index}
            >
              {tab}
            </button>
          ))}
        </div>
        {content[activeTab]}
      </div>
  );
}