import { TokenEntry } from "../types/tokens";
import { isSingleTokenObject, isTokenGroup } from "../utils/objUtils";
import "../types/global";

// takes an array of TokenEntry and returns a
export default function extractTokens(inputData): TokenEntry[] {
  const tokenCollection: TokenEntry[] = [];

  function process(data, parent?) {
    for (const key in data) {
      if (key === "type") continue;
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
        } else if (isTokenGroup(obj)) {
          const groupType = obj.type;
          Object.entries(obj as unknown).forEach(([key, val]) => {
            if (key === "type") return;
            val.type = groupType;
            const p = path.concat(key);
            const entry: TokenEntry = {
              path: p,
              token: val,
            };
            tokenCollection.push(entry);
          });
        } else {
          process(obj, path);
        }
      }
    }
    if (parent) parent.pop();
  }
  process(inputData);
  return tokenCollection;
}
