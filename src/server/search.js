import { capitalize, escapeRegex, sanitize } from "./utils.js";
import dotenv from "dotenv";

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

  if (req.dmg === 'any' || req.dmg === undefined) {
    req.dmg = /(?:)/i;
    req.dmg_compare_method = '$regex';
  }
  if (req.def === 'any' || req.def === undefined) {
    req.def = /(?:)/i;
    req.def_compare_method = '$regex';
  }

  if (req.dmg_compare_method === '$not') {
    req.dmg = RegExp(req.dmg, 'i');
  }
  if (req.def_compare_method === '$not') {
    req.def = RegExp(req.def, 'i');
  }


  // Würfel
  if (req.dice === 'Irrelevant') {
    req.dice = /(?:)/i;
  }


  // Types
  let typeSearch = sanitize(req.type, '');
  let types = typeSearch.split('\ ');
  if (types.length > 1) {
    req.type = RegExp(types.join('|'), 'i');
  } else {
    req.type = RegExp(escapeRegex(typeSearch));
  }
  console.log(`type: "${req.type}"`)


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
  console.log(`effects: "${effectSearch}"`)


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
    name: RegExp(escapeRegex(req.name), 'i'),
    cardtype: RegExp(escapeRegex(req.cardtype), 'i'),
    color: colors || /(?:)/i,

    dmg: { [req.dmg_compare_method]:  req.dmg },
    def: { [req.def_compare_method]:  req.def },
    
    dice: req.dice || /(?:)/i,
    set: sets,

    $and: [
      { 
        $or: [
            { type1: req.type },
            { type2: req.type }
        ]
      },
      {
        $or: [
          { effect1: tokens },
          { effect2: tokens },
          { effect3: tokens },
          { effect4: tokens },
          { step1: tokens },
          { step2: tokens },
          { step3: tokens },
          { step4: tokens }
        ]
      }
    ]
  }; 

  if (effectSearch) {
    search['$text'] = { $search: effectSearch };
  }

  console.log("Search:\n", search);

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
    } else if (search.name && search.name.trim() !== "") {
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
