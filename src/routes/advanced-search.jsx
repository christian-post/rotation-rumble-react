import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

import Selection from "../components/Selection";



function CardnameField() {
  return (
    <div className="advanced-search-item">
      <label htmlFor="cardname" className="span-bold">Card Name</label>
      <input 
        id="cardname"
        name="name"
        type="text"
        placeholder="Whole or partial name"
      />
    </div>
  )
}


function CardtypeField() {
  return (
    <div className="advanced-search-item">
      <label htmlFor="cardtype" className="span-bold">
        Card Type
      </label>

      <select id="cardtype" name="cardtype">
        <option value="">Any</option>
        <option value="Fighter">Fighter</option>
        <option value="Challenge">Challenge</option>
        <option value="Item">Item</option>
        <option value="Landscape">Landscape</option>
      </select>
    </div>
  )
}


function CardColorsField({ handleSelectionChange }) {
  const colors = [
    { id: 2, value: "green", label: "Green" },
    { id: 3, value: "blue", label: "Blue" },
    { id: 1, value: "red", label: "Red" },
    { id: 4, value: "black", label: "Black" }
  ];

  return (
    <div className="advanced-search-item | color-select">
      <label htmlFor="inlineCheckbox1" className="span-bold">
        Colors
      </label>
      
      <Selection 
        items={colors}
        name=""
        onSelectionChange={handleSelectionChange}
      />

      <div>
        <select name="color_compare" id="color-compare">
          <option value="exact">Exactly these colors</option>
          <option value="least-one">At least one of these colors</option>
          <option value="include-all">Including all of these colors</option>
          <option value="most">At most these colors</option>
        </select>
      </div>
      
    </div>
  );
}


function TypeField() {
  return (
    <div className="advanced-search-item">
      <label htmlFor="type" className="span-bold">Type</label>
      <input id="type" name="type" type="text" placeholder='Type 1 or 2, e.g., "Beast"'/>
    </div>
  );
}


function DamageField() {
  const operators = [
    { value: "$eq", label: "equal to" },
    { value: "$lt", label: "less than" },
    { value: "$gt", label: "greater than" },
    { value: "$lte", label: "less than or equal to" },
    { value: "$gte", label: "greater than or equal to" },
    { value: "$not", label: "not equal to" },
  ];

  const values = [
    { value: "any", label: "any" },
    { value: "", label: "" },
    ...Array.from({ length: 10 }, (_, i) => ({ value: i.toString(), label: i.toString() })),
    { value: "C", label: "C" },
  ];

  return (
    <div className="advanced-search-item">
      <label htmlFor="dmg_compare_method" className="span-bold">DMG</label>
      <select id="dmg_compare_method" name="dmg_compare_method">
        {operators.map((operator) => (
          <option key={operator.value} value={operator.value}>
            {operator.label}
          </option>
        ))}
      </select>
      <select id="dmg_compare" name="dmg" defaultValue="any">
        {values.map((value) => (
          <option key={value.value} value={value.value}>
            {value.label}
          </option>
        ))}
      </select>
    </div>
  );
}


function DefenseField() {
  const operators = [
    { value: "$eq", label: "equal to" },
    { value: "$lt", label: "less than" },
    { value: "$gt", label: "greater than" },
    { value: "$lte", label: "less than or equal to" },
    { value: "$gte", label: "greater than or equal to" },
    { value: "$not", label: "not equal to" },
  ];

  const values = [
    { value: "any", label: "any" },
    { value: "", label: "" },
    ...Array.from({ length: 10 }, (_, i) => ({ value: i.toString(), label: i.toString() })),
  ];

  return (
    <div className="advanced-search-item">
      <label htmlFor="def_compare_method" className="span-bold">DEF</label>
      <select id="def_compare_method" name="def_compare_method">
        {operators.map((operator) => (
          <option key={operator.value} value={operator.value}>
            {operator.label}
          </option>
        ))}
      </select>
      <select id="def_compare" name="def" defaultValue="any">
        {values.map((value) => (
          <option key={value.value} value={value.value}>
            {value.label}
          </option>
        ))}
      </select>
    </div>
  );
}


function DiceField() {
  return (
    <div className="advanced-search-item | dice-select">
      <label htmlFor="DiceYes" className="span-bold">Dice?</label>
      <div id="DiceYes">
        <input type="radio" name="dice" id="inlineRadio1" value="Yes"/>
        <label htmlFor="inlineRadio1">Yes</label>
      </div>
      <div>
        <input type="radio" name="dice" id="inlineRadio2" value="No"/>
        <label htmlFor="inlineRadio2">No</label>
      </div>
      <div>
        <input type="radio" name="dice" id="inlineRadio3" value="Irrelevant"/>
        <label htmlFor="inlineRadio3">Irrelevant</label>
      </div>
    </div>
  );
}


function EffectsField() {
  return (
    <div className="advanced-search-item">
      <label htmlFor="effectOrStep" className="span-bold">Effects or Steps</label>
      <input 
        id="effectOrStep"
        name="effectOrStep"
        type="text"
        placeholder='Any words in the text, e.g., "Destroy".'
      />
      
      <input
        type="checkbox"
        id="effectOrStep-matchall"
        name="effectOrStep_matchall"
        value="true"
      />
      <label htmlFor="effectOrStep-matchall">Match all words</label>

      <input type="checkbox" id="effectOrStep-exact" name="effectOrStep_exact" value="true"/>
      <label htmlFor="effectOrStep-exact">Exact search</label>
    </div>
  );
}


function SetsField() {
  // TODO get names from database
  const sets = ["Core Set",];
  return (
    <div className="advanced-search-item">
      <label htmlFor="set" className="span-bold">Set(s)</label>
      <select id="set" name="set" multiple>
        <option value="">All</option>
        {sets.map(set => <option key={set} value={set}>{set}</option>)}
      </select>
    </div>
  );
}


function DecksField() {
  // TODO get names from database
  const decks = [
    "Bolts & Bones",
    "Bows & Blades",
    "Clubs & Critters",
    "Goblins & Glaciers",
    "Howls & Horrors",
    "Sakura & Shuriken",
    "Tales & Tussle",
    "Trash & Tiaras", 
  ];
  return (
    <div className="advanced-search-item">
      <label htmlFor="decks" className="span-bold">Deck(s)</label>
      <select id="decks" name="decks" multiple>
        <option value="any">Any</option>
        {decks.map(deck => <option key={deck} value={deck}>{deck}</option>)}
      </select>
    </div>
  );
}


export default function AdvancedSearch() {
  const navigate = useNavigate();

  const [colorFormData, setFormData] = useState({
    colors: []
  });


  const handleColorSelection = (selectedValues) => {
    setFormData((prevData) => ({
      ...prevData,
      colors: selectedValues,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    let data = new FormData(event.target);

    const dataObj = {};
    for (const [key, value] of data.entries()) {
      if (dataObj[key]) {
        // If the key already exists, convert it to an array or append to the existing array
        if (Array.isArray(dataObj[key])) {
          dataObj[key].push(value);
        } else {
          dataObj[key] = [dataObj[key], value];
        }
      } else {
        // Otherwise, add the value as is
        dataObj[key] = value;
      }
    }

    dataObj.colors = colorFormData.colors;

    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataObj),
    });

    if (!response.ok) {
      console.error("Failed to fetch search results");
      return;
    }

    const resultData = await response.json();

    // Navigate to results page with the fetched data
    navigate("/results", { state: { results: resultData } });
  };

  return (
    <main>
      <div className="grid-container" style={{ gridTemplateColumns: "100%" }}>
        <div className="grid-item">
          {/* Intercept the form submission with onSubmit */}
          <form onSubmit={handleSubmit} className="advanced-search">
            <CardnameField />
            <CardtypeField />
            <CardColorsField 
              handleSelectionChange={handleColorSelection}
              />
            <TypeField />
            <DamageField />
            <DefenseField />
            <DiceField />
            <EffectsField />
            <DecksField />
            <SetsField />
            <input type="submit" value="Search with these values." />
          </form>
        </div>
      </div>
    </main>
  );
}