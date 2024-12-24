import { ReactNode, isValidElement, cloneElement, Children } from "react";

function hasNestedNodes(node: ReactNode): boolean {
  // Check if it's an array
  if (Array.isArray(node)) {
    return true;
  }

  // Check if it's a React element and has children
  if (isValidElement(node)) {
    return Children.count(node.props.children) > 0;
  }

  // If it's just a string or number, it doesn't have nested nodes
  if (typeof node === "string" || typeof node === "number") {
    return false;
  }

  return false;
}

export const titleCase = (input: ReactNode): ReactNode => {
  // If it's an array, process each element
  if (Array.isArray(input)) {
    return input.map((child) => titleCase(child));
  }

  // If it's a React element with children, process its children
  if (isValidElement(input) && hasNestedNodes(input)) {
    // return cloneElement(input, {
    //   children: titleCase(input.props.children),
    // });
    return cloneElement(input, {
      // @ts-ignore
      children: titleCase(input.props.children),
    });
  }

  // If it's a React element without children, return it unchanged
  if (isValidElement(input)) {
    return input;
  }

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
  const uppers = ["Id", "Tv", "HJ", "Css", "Js", "Json", "Xml", "Rss"];

  const lowersRegex = new RegExp(`\\s(${lowers.join("|")})\\s`, "g");
  const uppersRegex = new RegExp(`\\b(${uppers.join("|")})\\b`, "g");
  const exceptionsRegex = new RegExp(`\\b(${exceptions.join("|")})\\b`, "g");

  // Capitalize each word
  return input
    .toString()
    .replace(/([^\W_]+[^\s-]*) */g, (word) =>
      exceptionsRegex.test(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .replace(lowersRegex, (word) => word.toLowerCase())
    .replace(uppersRegex, (word) => word.toUpperCase());
};
