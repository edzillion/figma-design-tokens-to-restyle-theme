import { SingleTokenObject } from "../types/tokens";
import { isSingleTokenObject } from "./objUtils";

export interface TokenEntry {
  path: [string];
  token: SingleTokenObject;
}

const fontKeys = [
  "fontFamilies",
  "fontWeights",
  "lineHeights",
  "fontSizes",
  "letterSpacing",
];

const pathMode = true;

export function process(inputData): TokenEntry[] {
  const tokenCollection: TokenEntry[] = [];

  function extractTokens(data, parent?) {
    for (const key in data) {
      const obj = data[key];
      //const path = parent ? parent + "-" + key : key;
      const path = parent ? parent.concat(key) : [key];
      if (typeof obj === "object") {
        if (isSingleTokenObject(obj)) {
          const entry: TokenEntry = {
            path,
            token: obj,
          };

          tokenCollection.push(entry);
        } else {
          extractTokens(obj, path);
        }
      }
    }
    if (parent) parent.pop();
  }
  extractTokens(inputData);
  return tokenCollection;
}
