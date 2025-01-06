const placeholderMap = {
  "{s}": "/images/symbols/star.png", 
  "{g}": "/images/symbols/money.png",
  "{d}": "/images/symbols/dice.png",
  "{b}": "/images/symbols/bury.png"
};

export default function ReplacePlaceholders(text) {
  // Use a regular expression to find placeholders 
  // and replace them with <img> elements
  return text.split(/(\{.*?\})/).map((segment, index) => {
    if (placeholderMap[segment]) {
      return (
        <img
          key={index}
          src={placeholderMap[segment]}
          alt={segment}
          className="inline-symbol"
        />
      );
    }
    return segment;
  });
}