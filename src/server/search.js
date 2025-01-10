import { capitalize, escapeRegex, sanitize, levensDist } from "./utils.js";
import dotenv from "dotenv";
import { inspect } from "util";
import { commonWords as findCommonWords } from "./cachedInfo.js";
import fs from "fs";

dotenv.config();


// load the list of common words for spell checking
let commonWords;

try {
  if (!fs.existsSync("data/common_words.json")) {
    await findCommonWords();
  }
  
  fs.readFile("data/common_words.json", "utf-8", function (err, data) {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }
    try {
      const parsedData = JSON.parse(data);
      commonWords = parsedData; // `commonWords` now holds the JSON object
    } catch (parseErr) {
      console.error("Error parsing the JSON:", parseErr);
    }
  });
} catch (error) {
  console.error(error);
}


export function spellCheck(testWord, field) {
  let corrections = [];

  if (commonWords === undefined) {
    console.log("common Words list is undefined")
    return null;
  }
    
  if (
    (!typeof testWord === "string") ||
    (!Object.keys(commonWords).includes(field))
  ) {
    return null;
  } 

  for (let word of commonWords[field]) {
    let dist = levensDist(testWord, word);
    corrections.push([word, dist]);
    if (dist === 0) break;
  }

  if (corrections.length === 0) return null;
  
  // sort by distance in ascending order
  corrections.sort((a, b) => a[1] - b[1]);
  return corrections[0][0];
}


export async function getDecklists(db) {
  // queries the database for all cards and groups them by deck
  const allCards = await db.collection(process.env.COLLECTION)
    .find({ name: /(?:)/i }).toArray();

  if (!allCards) {
    console.log("no results")
    return null;
  }

  const decklists = {};

  // Iterate over each card and populate the decklists object
  allCards.forEach((card) => {
    card.deck.forEach((d) => {
      if (!decklists[d]) {
        // create a new precon list if this decklists isn't in the data yet
        // it contains two empty deck objects and a list with cards, and the
        // two featured captains
        decklists[d] = {
          decks: [],
          cards: [],
          captains: []
        }
      }
      if (card.cardtype === "Captain") {
        decklists[d].captains.push(card);
        // decklists[d].captain = card;
      } else {
        decklists[d].cards.push(card);
      }
    });
  });

  console.log("test")

  // sort the cards in each deck by color and create the "deck" objects
  for (const name in decklists) {
    if (decklists[name].captains.length === 0) {
      console.log(`${name} has no captains`);
      continue
    }

    const captain1Colors = decklists[name].captains[0].color;
    const captain2Colors = decklists[name].captains[1].color;

    const cards1 = decklists[name].cards.filter((card) => 
      card.color.every((color) => captain1Colors.includes(color))
    );
    const cards2 = decklists[name].cards.filter((card) => 
      card.color.every((color) => captain2Colors.includes(color))
    );

    decklists[name].decks.push({
      decklist: cards1,
      id: `precon-${decklists[name].captains[0].id}`,
      name: `${name} - ${decklists[name].captains[0].name}`,
      captain: decklists[name].captains[0]
    });
    decklists[name].decks.push({
      decklist: cards2,
      id: `precon-${decklists[name].captains[1].id}`,
      name: `${name} - ${decklists[name].captains[1].name}`,
      captain: decklists[name].captains[1]
    });
  }

  return decklists;
}

export function processSearch(req) {
  // Suche lesbar machen
  let searchExplain = [];
  let attrs = [
    "name", "cardtype", "colors", "dmg", "def", "dice", "type", 
    "effectOrStep", "set", "decks"
  ];

  let aliases = {
    "$eq": "equal to",
    "$gt": "greater than",
    "$lt": "less than",
    "$gte": "greater than or equal to",
    "$lte": "less than or equal to",
    "exact": "is exactly these colors",
    "least-one": "is at least one of these colors",
    "include-all": "includes all of these colors",
    "most": "is at most these colors",
    "{t}": "Treefolk",
    "{bb}": "Bomb",
    "{bn}": "Bones",
    "{by}": "bury",
    "{c}": "Coil",
    "{d}": "Dice",
    "{e}": "Energy",
    "{hs}": "Haste",
    "{ht}": "Heart",
    "{m}": "Money",
    "{s}": "Star",
    "{t}": "Treefolk",
    "{u}": "unblockable"
  };

  // Info Text for search results
  for (let i = 0; i < attrs.length; i++) {
    if (req[attrs[i]]) {
      switch(attrs[i]) {
        case "colors":
          if (req.colors.length) {
            // capitalize and concatenate the color names
            let colorStr = Object.values(req[attrs[i]]).map(capitalize).join(", ");
            searchExplain.push(`the Color ${aliases[req.color_compare]}: ${colorStr}`);
          }
          break;

        case "dice":
          if (req["dice"] === "Yes") {
            searchExplain.push("the card requires die rolls");
          } else if (req["dice"] === "No") {
            searchExplain.push("the card doesn\'t require die rolls");
          }
          break;

        case "dmg":
          if (req.dmg === "any") break;
          searchExplain.push(
            `DMG is ${aliases[req.dmg_compare_method]} ${req[attrs[i]]}`
            );
          break;

        case "def":
          if (req.def === "any") break;
          searchExplain.push(
            `DEF is ${aliases[req.def_compare_method]} ${req[attrs[i]]}`
            );
          break;

        case "effectOrStep":
          searchExplain.push(`the Effects contain "${req[attrs[i]]}"`);
          break;

        case "set":
          if (typeof req.set === "object") {
            searchExplain.push(`the Set is "${req.set.join("\" or \"")}"`);
          } else {
            searchExplain.push(`the Set is "${req.set}"`);
          }
          break;

        case "decks":
          if (typeof req.decks === "object") {
            searchExplain.push(`the card is in "${req.decks.join("\" and \"")}"`);
          } else {
            searchExplain.push(`the card is in "${req.decks}"`);
          }
          break;

        case "name":
          searchExplain.push(`the ${capitalize(attrs[i])} includes "${req[attrs[i]]}"`);
          break;

        default:
          searchExplain.push(`the ${capitalize(attrs[i])} is "${req[attrs[i]]}"`);
      }
    }
  }


  // Input sanitization
  // some values have to be treated differently
  let sanitizedSearch = {
    name: sanitize(req.name),
    cardtype: sanitize(req.cardtype),
    colors: sanitize(req.colors),
    color_compare: sanitize(req.color_compare),
    dmg: sanitize(req.dmg),
    dmg_compare_method: sanitize(req.dmg_compare_method),
    def: sanitize(req.def),
    def_compare_method: sanitize(req.def_compare_method),
    dice: sanitize(req.dice),
    type: sanitize(req.type, ""),
    effectOrStep: sanitize(req.effectOrStep, ""),
    effectOrStep_exact: sanitize(req.effectOrStep_exact),
    effectOrStep_matchall: sanitize(req.effectOrStep_matchall),
    set: sanitize(req.set),
    decks: sanitize(req.decks, " ", ["&"])
  }

  // console.log("\nSanitized Search:")
  // console.log(inspect(sanitizedSearch, {showHidden: false, depth: null, colors: true}));

  // Suche nach Farben
  let colors;
  if (sanitizedSearch.colors.length > 0) {
    if (sanitizedSearch.color_compare === "exact") {
      if (typeof sanitizedSearch.colors === "string") {
        // Single color: Enforce array size and regex match
        colors = {
          $size: 1,
          $elemMatch: { $regex: new RegExp(`^${sanitizedSearch.colors}$`, "i") }
        };
      } else if (Array.isArray(sanitizedSearch.colors)) {
        // Array of colors: Match exact array
        colors = { $eq: sanitizedSearch.colors };
      }
    } else if (sanitizedSearch.color_compare === "least-one") {
      // At least one match (logical OR)
      if (typeof sanitizedSearch.colors === "string") {
        colors = {
          $elemMatch: { $regex: new RegExp(`^${sanitizedSearch.colors}$`, "i") }
        };
      } else if (Array.isArray(sanitizedSearch.colors)) {
        colors = {
          $elemMatch: { $in: sanitizedSearch.colors.map(
            color => new RegExp(`^${color}$`, "i")
          ) }
        };
      }
    } else if (sanitizedSearch.color_compare === "include-all") {
      // All elements must match (logical AND)
      if (typeof sanitizedSearch.colors === "string") {
        colors = { $all: [new RegExp(`^${sanitizedSearch.colors}$`, "i")] };
      } else if (Array.isArray(req.color)) {
        colors = {
          $all: sanitizedSearch.colors.map(color => new RegExp(`^${color}$`, "i"))
        };
      }
    }
  }

  // dmg und def any value

  if (sanitizedSearch.dmg === "any" || sanitizedSearch.dmg === undefined) {
    sanitizedSearch.dmg = null; // Exclude from query
    sanitizedSearch.dmg_compare_method = null;
  } else if (sanitizedSearch.dmg_compare_method === "$not") {
    sanitizedSearch.dmg = RegExp(sanitizedSearch.dmg, "i"); // Use RegExp for $not
  }

  if (sanitizedSearch.def === "any" || sanitizedSearch.def === undefined) {
    sanitizedSearch.def = null; // Exclude from query
    sanitizedSearch.def_compare_method = null;
  } else if (sanitizedSearch.def_compare_method === "$not") {
    sanitizedSearch.def = RegExp(sanitizedSearch.def, "i"); // Use RegExp for $not
  }


  // Würfel
  if (sanitizedSearch.dice === "Irrelevant") {
    sanitizedSearch.dice = /(?:)/i;
  }


  // Types
  let typeSearch = sanitizedSearch.type.trim(); 
  let types = typeSearch.split(/\s+/);

  // If there are multiple types, create a regex with "or" conditions
  if (types.length > 1) {
    sanitizedSearch.type = new RegExp(types.map(escapeRegex).join("|"), "i");
  } else if (typeSearch) {
    sanitizedSearch.type = new RegExp(escapeRegex(typeSearch), "i"); // Single type
  } else {
    sanitizedSearch.type = null; // No valid type provided
  }


  // Effects or Steps
  let effectsSearchStr = sanitizedSearch.effectOrStep.trim();
  let effectSearch;
  if (sanitizedSearch.effectOrStep_exact) {
    // Exact search
    // TODO: können beide checkboxen angeklickt werden?
    effectSearch = `\"${effectsSearchStr}\"`;
  } else if (sanitizedSearch.effectOrStep_matchall) {
    // Match all words
    effectSearch = `\"${effectsSearchStr.replaceAll(" ", "\" \"")}\"`;
  } else {
    effectSearch = effectsSearchStr;
  }

  // Decks
  // let decks be null if the search includes "any" or an empty string
  let decks = sanitizedSearch.decks === "any" || 
    (Array.isArray(sanitizedSearch.decks) && sanitizedSearch.decks.includes("any"))
    ? null 
    : sanitizedSearch.decks;


  // Sets
  let setSearchStr;
  let sets;
  if (typeof sanitizedSearch.set === "string") {
    setSearchStr = sanitizedSearch.set;
  } else {
    // Array
    if (sanitizedSearch.set === undefined) {
      setSearchStr = "";
    } else {
      setSearchStr = `${sanitizedSearch.set.join("|")}`;
    }
  }
  sets = RegExp(setSearchStr, "i");


  // Regex and query formatting
  const search = {};

  if (sanitizedSearch.name) {
    search.name = new RegExp(escapeRegex(sanitizedSearch.name), "i");
  } 
  if (sanitizedSearch.cardtype) {
    search.cardtype = new RegExp(escapeRegex(req.cardtype), "i");
  }
  if (colors) {
    search.color = colors;
  }
  if (sanitizedSearch.dmg && sanitizedSearch.dmg_compare_method) {
    search.dmg = { [sanitizedSearch.dmg_compare_method]: sanitizedSearch.dmg };
  }
  if (sanitizedSearch.def && sanitizedSearch.def_compare_method) {
    search.def = { [sanitizedSearch.def_compare_method]: sanitizedSearch.def };
  }
  if (sanitizedSearch.dice) {
    search.dice = sanitizedSearch.dice;
  }
  if (sets && sets.length > 0) {
    search.set = sets;
  }
  if (decks) {
    search.deck = { $eq: decks };
  }

  // Add $and conditions if present
  if (req.type) {
    search.$and = [{ $or: [{ type1: sanitizedSearch.type }, { type2: sanitizedSearch.type }] }];
  }

  // Add $text if effectSearch is present
  if (effectSearch) {
    search.$text = { $search: effectSearch };
  }
    
  console.log("\nDatabase Query:")
  console.log(inspect(search, {showHidden: false, depth: null, colors: true}));

  return { search, searchExplain };
}


export async function sendSimpleSearch(db, search) {
  const found = await db.collection(process.env.COLLECTION)
    .find(search)
    .toArray();

  let header;

  if (found.length === 1) {
    header = `This card matched your search`;
  } else if (found.length > 1) {
    header = `These ${found.length} cards matched your search`;
  } else {
    header = "No cards matched your search";
  }

  header += ` where the name includes \"${search.name.source}\".`

  return {
    explanation: header,
    cards: found,
    // correction: correction,
    // correctionType: correctionType,
    query: { as: "images" },
  };
}


export async function sendAdvancedSearch(
    db, search, effectSearch, searchExplain
  ) {
  const found = await db.collection(process.env.COLLECTION)
    .find(search)
    .toArray();

  let header;
  let correction = null;
  let correctionType = null;

  if (found.length === 1) {
    header = `This card matched your search`;
  } else if (found.length > 1) {
    header = `These ${found.length} cards matched your search`;
  } else {
    header = "No cards matched your search";

    // find similar words if no results were found
    for (const [fieldName, value] of Object.entries(search)) {
      if (value) {
        let check = spellCheck(value.toString(), fieldName);
        if (check) {
          correction = check;
          correctionType = fieldName;
          break; // Exit the loop early
        }
      }
    }

    // handle the type and efect search differently
    // TODO: seems convoluted
    if (search.$and && search.$and[0]?.$or) {
      let check = spellCheck(
        search.$and[0].$or[0].type1.source, "type1");
      if (check) {
        correction = check;
        correctionType = "type1";
      }
    }

    if (search.$text?.$search) {
      let check = spellCheck(search.$text.$search, "effect1");
      if (check) {
        correction = check;
        correctionType = "effectOrStep";
      }
    }
  }

  if (searchExplain.length > 0) {
    header += " where " + searchExplain.join(", and where ");
  }
  header += ".";

  return {
    explanation: header,
    cards: found,
    correction: correction,
    correctionType: correctionType,
    query: { as: "images" },
  };
}
