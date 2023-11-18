export const titleCase = (str: React.ReactNode) => {
  const lowers = [
    "A",
    "An",
    "The",
    "And",
    "But",
    "Or",
    "For",
    "Nor",
    "As",
    "At",
    "By",
    "For",
    "From",
    "In",
    "Into",
    "Near",
    "Of",
    "On",
    "Onto",
    "To",
    "With",
  ];

  const uppers = ["Id", "Tv"];

  const lowersRegex = new RegExp("\\s(" + lowers.join("|") + ")\\s", "g");
  const uppersRegex = new RegExp("\\b(" + uppers.join("|") + ")\\b", "g");

  // Capitalize each word
  return str
    .toString()
    .replace(
      /([^\W_]+[^\s-]*) */g,
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .replace(lowersRegex, (word) => word.toLowerCase())
    .replace(uppersRegex, (word) => word.toUpperCase());
};
