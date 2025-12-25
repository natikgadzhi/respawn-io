export const titleCase = (input: string): string => {
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
    "Vs",
  ];

  const exceptions = ["SwiftUI"];
  const uppers = ["Id", "Tv", "HJ", "Css", "Js", "Json", "Xml", "Rss", "Mdx"];

  const lowersRegex = new RegExp(`\\s(${lowers.join("|")})\\s`, "g");
  const uppersRegex = new RegExp(`\\b(${uppers.join("|")})\\b`, "g");
  const exceptionsRegex = new RegExp(`\\b(${exceptions.join("|")})\\b`, "g");

  // Capitalize each word
  return input
    .replace(/([^\W_]+[^\s-]*) */g, (word) =>
      exceptionsRegex.test(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .replace(lowersRegex, (word) => word.toLowerCase())
    .replace(uppersRegex, (word) => word.toUpperCase());
};
