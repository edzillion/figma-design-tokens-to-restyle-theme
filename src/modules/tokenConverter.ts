import { SingleTokenObject, TokenEntry, TokenGroup } from "../types/tokens";
import {
  formatTokenKey,
  convertToNestedTokenObject,
  formatTokenValue,
  isSingleTokenObject,
  simpleObjectMerge,
  formatTokenVariable,
  formatTokenVariablePath,
} from "../utils/objUtils";

const GLOBAL_FLAG = false;

// takes in an array of TokenEntry and returns rendered global keys in ts string
const convertTokens = (tokenCollection: TokenEntry[]): string => {
  const globalKeysObject = tokenCollection.reduce((accum, curr) => {
    if (GLOBAL_FLAG && curr.path[0] !== "global") return accum;

    // todo: temporary!
    if (curr.path[0] === "theme" || curr.path[1] === "theme") return accum;
    const obj = convertToNestedTokenObject(curr);
    // need to drop the 'global' key for merge in global mode
    const mergePath = GLOBAL_FLAG ? curr.path.slice(1) : curr.path;
    const merged = simpleObjectMerge(mergePath, obj, accum);
    return merged;
  }, {});

  const generateGlobalKeysText = (globalKeysObject: object): string => {
    let returnText = "";
    let processText: string;

    const process = (key, obj, firstRunFlag?) => {
      if (!isSingleTokenObject(obj)) {
        processText += firstRunFlag ? "{\n" : formatTokenKey(key) + ": {\n";

        Object.entries(obj).forEach(([key, value]) => process(key, value));
        //if (firstRunFlag) processText += "}\n";
        processText += "},\n";
      } else {
        const token: SingleTokenObject = obj;
        if (token.description) processText += "// " + token.description + "\n";
        processText += firstRunFlag
          ? formatTokenValue(token) + ",\n"
          : formatTokenKey(key) + ": " + formatTokenValue(token) + ",\n";
      }
    };

    Object.entries(globalKeysObject).forEach(([key, value]) => {
      // can't deal with top level keys starting with numbers
      if (!isNaN(Number(key[0]))) {
        console.error("top level keys cannot start with numbers, key:" + key);
        return;
      }
      processText = "";
      if (key.includes(".")) {
        processText = formatTokenVariablePath(key) + " = ";
      } else processText = "const " + formatTokenVariable(key) + " = ";

      process(key, value, true);
      // remove trailing ',\n'
      processText = processText.slice(0, -2);
      returnText += processText + ";\n\n";
    });
    return returnText;
  };

  return generateGlobalKeysText(globalKeysObject);
};

export default convertTokens;
