import { capitalize, escapeRegex, sanitize } from "./utils.js";
import dotenv from "dotenv";
import { inspect } from "util";

dotenv.config();


export function processSearch(req) {
  // Suche lesbar machen
  let searchExplain = [];
  let attrs = [
    'name', 'cardtype', 'color', 'dmg', 'def', 'dice', 'token', 'type', 
    'effectOrStep', 'set'
  ];

  let aliases = {
    '$eq': 'equal to',
    '$gt': 'greater than',
    '$lt': 'less than',
    '$gte': 'greater than or equal to',
    '$lte': 'less than or equal to',
    'exact': 'is exactly these colors',
    'least-one': 'is at least one of these colors',
    'include-all': 'includes all of these colors',
    'most': 'is at most these colors',
    '{t}': 'Treefolk',
    '{bb}': 'Bomb',
    '{bn}': 'Bones',
    '{by}': 'bury',
    '{c}': 'Coil',
    '{d}': 'Dice',
    '{e}': 'Energy',
    '{hs}': 'Haste',
    '{ht}': 'Heart',
    '{m}': 'Money',
    '{s}': 'Star',
    '{t}': 'Treefolk',
    '{u}': 'unblockable'
  };

  // Info Text for search results
  for (let i = 0; i < attrs.length; i++) {
    if (req[attrs[i]]) {
      switch(attrs[i]) {
        case 'color':
          let colorStr = req[attrs[i]].toString().replaceAll(',', ', ');
          searchExplain.push(`the Color ${aliases[req.color_compare]}: ${colorStr}`);
          break;
        case 'dice':
          if (req['dice'] === 'Yes') {
            searchExplain.push('the card requires die rolls');
          } else if (req['dice'] === 'No') {
            searchExplain.push('the card doesn\'t require die rolls');
          }
          break;
        case 'dmg':
          if (req.dmg === 'any') break;
          searchExplain.push(
            `DMG is ${aliases[req.dmg_compare_method]} ${req[attrs[i]]}`
            );
          break;
        case 'def':
          if (req.def === 'any') break;
          searchExplain.push(
            `DEF is ${aliases[req.def_compare_method]} ${req[attrs[i]]}`
            );
          break;
        case 'token':
          let tokenText;
          if (typeof req.token === 'object') {
            // TODO: logical OR, AND unterscheiden
            tokenText = req.token.map(x => aliases[x]).join(', ');
          } else {
            tokenText = aliases[req.token];
          }
          searchExplain.push(
            `the card interacts with ${tokenText} tokens`
          );
          break;
        case 'effectOrStep':
          searchExplain.push(`the Effects or Steps contain "${req[attrs[i]]}"`);
          break;
        case 'set':
          if (typeof req.set === 'object') {
            searchExplain.push(`the Set is "${req.set.join('" or "')}"`);
            break;
          }

        default:
          searchExplain.push(`the ${capitalize(attrs[i])} is "${req[attrs[i]]}"`);
      }
    }
  }

  // Suche nach Farben
  let colors = '';
  if (req.color) {
    // color ist entweder ein String oder ein Array
    if (typeof req.color === 'string') {
      if (req.color_compare === 'exact' || req.color_compare === 'most') {
        colors = RegExp(`^${req.color}$`, 'i');
      } else if (req.color_compare === 'least-one' || req.color_compare === 'include-all') {
        colors = RegExp(escapeRegex(req.color), 'i');
      }
    } else {
      if (req.color_compare === 'exact') {
        colors = RegExp(`^${req.color.join('/')}$`, 'i');
      } else if (req.color_compare === 'least-one') {
        // logical OR
        colors = RegExp(req.color.join('|'), 'i');
      } else if (req.color_compare === 'include-all') {
        // logical AND
        let searchStr = '';
        req.color.forEach(color => searchStr += `(?=.*${color})`);
        colors = RegExp(searchStr, 'i');
      } else {
        // "most"
        let searchStr = '^(';

        let combo = allCombinations(req.color);
        combo.forEach(comb => {
          searchStr += comb.join('\/') + '|';
        });

        searchStr += ')$';
        colors = RegExp(searchStr, 'i');
      }
    }
  }

  // Suche nach Token
  let tokens = '';
  if (req.token) {
    // color ist entweder ein String oder ein Array
    if (typeof req.token === 'string') {

      if (req.token_compare === 'exact') {
        //  TODO: das ergibt noch keinen Sinn
        tokens = RegExp(req.token, 'i');
      } else if (
          req.token_compare === 'least-one' ||
          req.token_compare === 'include-all'
        ) {
        tokens = RegExp(escapeRegex(req.token), 'i');
      }

    } else {
      if (req.token_compare === 'exact') {
        tokens = RegExp(`^${req.token.join('/')}$`, 'i');
      } else if (req.token_compare === 'least-one') {
        // logical OR
        tokens = RegExp(req.token.join('|'), 'i');
      } else if (req.token_compare === 'include-all') {
        // logical AND
        let searchStr = '';
        req.token.forEach(token => searchStr += `(?=.*${token})`);
        tokens = RegExp(searchStr, 'i');
      }
    }
  } else {
    tokens = /(?:)/i;
  }

  // dmg und def any value
  // TODO: don't change the contents of req; make a new variable for each

  if (req.dmg === "any" || req.dmg === undefined) {
    req.dmg = null; // Exclude from query
    req.dmg_compare_method = null;
  } else if (req.dmg_compare_method === "$not") {
    req.dmg = RegExp(req.dmg, "i"); // Use RegExp for $not
  }

  if (req.def === "any" || req.def === undefined) {
    req.def = null; // Exclude from query
    req.def_compare_method = null;
  } else if (req.def_compare_method === "$not") {
    req.def = RegExp(req.def, "i"); // Use RegExp for $not
  }


  // Würfel
  if (req.dice === 'Irrelevant') {
    req.dice = /(?:)/i;
  }


  // Types
  let typeSearch = sanitize(req.type, "").trim(); 
  let types = typeSearch.split(/\s+/);

  // If there are multiple types, create a regex with "or" conditions
  if (types.length > 1) {
    req.type = new RegExp(types.map(escapeRegex).join("|"), "i"); // Escape each type
  } else if (typeSearch) {
    req.type = new RegExp(escapeRegex(typeSearch), "i"); // Single type
  } else {
    req.type = null; // No valid type provided
  }


  // Effects or Steps
  let effectsSearchStr = sanitize(req.effectOrStep).trim();
  let effectSearch;
  if (req.effectOrStep_exact) {
    // Exact search
    // TODO: können beide checkboxen angeklickt werden?
    effectSearch = `\"${effectsSearchStr}\"`;
  } else if (req.effectOrStep_matchall) {
    // Match all words
    effectSearch = `\"${effectsSearchStr.replaceAll(' ', '\" \"')}\"`;
  } else {
    effectSearch = effectsSearchStr;
  }


  // Set
  let setSearchStr;
  let sets;
  if (typeof req.set === 'string') {
    setSearchStr = req.set;
  } else {
    // Array
    if (req.set === undefined) {
      setSearchStr = '';
    } else {
      setSearchStr = `${req.set.join('|')}`;
    }
  }
  sets = RegExp(setSearchStr, 'i');


  // Regex and query formatting
  const search = {
    name: req.name ? new RegExp(escapeRegex(req.name), "i") : undefined,
    cardtype: req.cardtype ? new RegExp(escapeRegex(req.cardtype), "i") : undefined,
    color: colors && colors.length > 0 ? colors : undefined,
    dmg: req.dmg && req.dmg_compare_method 
      ? { [req.dmg_compare_method]: req.dmg }
      : undefined,
    def: req.def && req.def_compare_method 
      ? { [req.def_compare_method]: req.def }
      : undefined,
    dice: req.dice ? req.dice : undefined,
    set: sets && sets.length > 0 ? sets : undefined,
    $and: [
      req.type ? { $or: [{ type1: req.type }, { type2: req.type }] } : undefined
    ].filter(Boolean), // Remove undefined entries from the $and array
    ...(effectSearch ? { $text: { $search: effectSearch } } : {})
  };
  
  // Remove undefined fields from the `search` object
  Object.keys(search).forEach((key) => {
    if (search[key] === undefined || (Array.isArray(search[key]) && search[key].length === 0)) {
      delete search[key];
    }
  });
  
  console.log("\nDatabase Query:")
  console.log(inspect(search, {showHidden: false, depth: null, colors: true}));

  return { search, searchExplain };
}


export async function sendAdvancedSearch(
    db, search, effectSearch, searchExplain
  ) {
  const found = await db.collection(process.env.COLLECTION).find(search).toArray();
  let header;
  let correction = null;
  let correctionType = null;

  if (found.length === 1) {
    header = `This card matched your search`;
  } else if (found.length > 1) {
    header = `These ${found.length} cards matched your search`;
  } else {
    header = "No cards matched your search";

    if (effectSearch) {
      correction = spellCheck(effectSearch, "effects");
      correctionType = "effectOrStep";
    } else if (typeof search.name === "string" && search.name.trim() !== "") {
      correction = spellCheck(utils.sanitize(search.name), "names");
      correctionType = "name";
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
