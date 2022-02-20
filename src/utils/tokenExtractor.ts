import { SingleTokenObject } from "../types/tokens";
import { isSingleTokenObject } from "./objUtils";
import "../types/global";
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

export function extract(inputData): TokenEntry[] {
  const tokenCollection: TokenEntry[] = [];

  function extractTokens(data, parent?) {
    for (const key in data) {
      const obj = data[key];
      const path = parent ? parent.concat(key) : [key];
      if (typeof obj === "object") {
        if (isSingleTokenObject(obj)) {
          if (typeof obj.value === "string" && obj.value.startsWith("{")) {
            const i = obj.value.indexOf(".");
            if (i !== -1) {
              const pathCompare = obj.value.slice(1, i);
              // if the token value starts with the same path token path, then we
              // have an object referecing itself.
              if (path[0] === pathCompare) {
                const p = path[0] + "." + path[1];
                path[0] = p;
                globalThis.separateDeclarations.push(p);
                path.splice(1, 1);
              }
            }
          }
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
