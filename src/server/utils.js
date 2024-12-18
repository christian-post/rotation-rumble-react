
export function sanitize(text, replacement = " ", exceptions = []) {
  if (text === undefined) return "";
  // Build a regex that excludes the characters in the exceptions list
  const exceptionsRegex = exceptions.length
    ? `[^\\w${exceptions.map((char) => `\\${char}`).join("")}]`
    : "\\W_";
  const regex = new RegExp(exceptionsRegex, "g");
  return text.replace(regex, replacement);
}


export function escapeRegex(text) {
  if (text === undefined) return '';
  // helper function
  // https://stackoverflow.com/questions/38421664/fuzzy-searching-with-mongodb
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};


export function capitalize(str) {
  // capitalize the first char of a string
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export function allCombinations(items) {
  // https://code-boxx.com/javascript-permutations-combinations/
  let results = [];
  for (let slots = items.length; slots > 0; slots--) {
    for (let loop = 0; loop < items.length - slots + 1; loop++) {
      let key = results.length;
      results[key] = [];
      for (let i = loop; i < loop + slots; i++) {
        results[key].push(items[i]);
      }
    }
  }
  return results;
}
