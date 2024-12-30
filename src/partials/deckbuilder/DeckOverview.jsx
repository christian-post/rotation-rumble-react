import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
import { Pie } from "react-chartjs-2";
import CustomTooltip from "../../components/Tooltip";
import CardImage from "../../components/CardImage";
import { download } from "../../utils/common";


function DeckTable({ cards }) {
  // Group cards by their cardtype
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
              <CardImage data={{ card: card, sizing: "medium" }} />
            </a>
          </CustomTooltip>
          
        );
      })}
    </div>
  );
}


function Statistics({ deck }) {
  
  // TODO put colors in own file
  const colormap = [
    'rgb(165, 0, 38)',
    'rgb(188, 22, 38)',
    'rgb(214, 47, 38)',
    'rgb(229, 77, 52)',
    'rgb(244, 109, 67)',
    'rgb(248, 142, 82)',
    'rgb(252, 172, 96)',
    'rgb(253, 198, 120)',
    'rgb(254, 224, 144)',
    'rgb(254, 239, 167)',
    'rgb(254, 254, 192)',
    'rgb(239, 249, 218)',
    'rgb(224, 243, 247)',
    'rgb(196, 229, 240)',
    'rgb(169, 216, 232)',
    'rgb(141, 193, 220)',
    'rgb(116, 173, 209)',
    'rgb(92, 144, 194)',
    'rgb(68, 115, 179)',
    'rgb(58, 83, 163)',
  ];

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
        rows="12" 
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



export default function DeckOverview({ props }) {
  // shows the deck list and deck stats

  const [activeTab, setActiveTab] = useState(0);

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
        Coming Soon...
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