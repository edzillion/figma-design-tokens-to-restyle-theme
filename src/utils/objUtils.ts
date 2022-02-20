import {
  ShadowTokenSingleValue,
  TypographyObject,
} from "../types/propertyTypes";
import { SingleTokenObject } from "../types/tokens";
import { TokenEntry } from "./tokenExtractor";

const dotsAndDashes = new RegExp(/[-.]/g);

import "../types/global";

function isValidVarName(name) {
  try {
    Function("var " + name);
  } catch (e) {
    return false;
  }
  return true;
}

export function isSingleTokenObject(
  object: unknown
): object is SingleTokenObject {
  return typeof object === "object" && "value" in object && "type" in object;
}

export function formatTokenKey(key) {
  if (isValidVarName(key)) return key;
  else return "['" + key + "']";
}

export function formatTokenVariable(key) {
  if (isValidVarName(key)) return key;
  else {
    // replace all dots and dashes with underlines
    key = key.replace(dotsAndDashes, "_");
    // if it starts with a number then just prepend 'var'
    return isNaN(Number(key[0])) ? key : "var" + key;
  }
}

export function formatTokenVariablePath(variablePath) {
  return variablePath
    .split(".")
    .map((pathPart, index) => {
      // variables cannot use ['var'] notation
      if (index === 0) return formatTokenVariable(pathPart);
      return "['" + pathPart + "']";
    })
    .join("");
}

export function formatTokenValue(token: SingleTokenObject): string {
  function process(tokenValue: string): string {
    // slice off {} curly brackets then split into obj path
    const fullPath = tokenValue.slice(1, -1);
    const pathArray = fullPath.split(".");

    // is this variable referencing an object path created using ['var'] notation
    const isSeparatePath =
      globalThis.separateDeclarations.find(
        (path) => path === fullPath || path.startsWith(fullPath + ".")
      ) || false;

    const v = pathArray
      .map((pathPart, index) => {
        // variables cannot use ['var'] notation
        if (index === 0) return formatTokenVariable(pathPart);
        if (isValidVarName(pathPart) && !isSeparatePath) return "." + pathPart;
        else return "['" + pathPart + "']";
      })
      .join("");
    return v;
  }

  if (typeof token.value === "number") {
    return token.value.toString();
  }

  if (typeof token.value === "string") {
    if (token.value.startsWith("{")) return process(token.value);
    else if (!isNaN(Number(token.value))) return token.value;
    return "'" + token.value + "'";
  }

  let returnText = "{\n";
  if (token.type === "typography") {
    const typographyTokenValue = token.value as TypographyObject;
    Object.entries(typographyTokenValue).forEach(([key, value]) => {
      if (typeof value === "string") {
        const objVal = value.startsWith("{")
          ? process(value)
          : "'" + value + "'";
        returnText += key + ": " + objVal + ",\n";
      }
    });
  } else if (token.type === "boxShadow") {
    const boxShadowTokenValue = Array.isArray(token.value)
      ? (token.value as ShadowTokenSingleValue[])
      : (token.value as ShadowTokenSingleValue);

    Object.entries(boxShadowTokenValue).forEach(([key, value]) => {
      if (typeof value === "string") {
        let objVal;
        if (value.startsWith("{")) objVal = process(value);
        else if (!isNaN(Number(token.value))) objVal = token.value;
        else objVal = "'" + value + "'";
        returnText += key + ": " + objVal + ",\n";
      }
    });
  }
  return (returnText += "}\n");
}

export const convertToNestedTokenObject = (entry: TokenEntry): object => {
  function reducer(all, item, index, array) {
    // if we are at the end of the path then attach the token
    if (index === array.length - 1) {
      return { [item]: entry.token };
    }
    return { [item]: all };
  }
  return entry.path.reduceRight(reducer.bind({ entry }), {});
};

// simpleObjectMerge only works for our use case
export function simpleObjectMerge(
  path: string[],
  source: object,
  target: object
): object {
  function process(source, target) {
    if (path.length > 0) {
      const p = path.shift();
      if (target[p]) process(source[p], target[p]);
      else target[p] = source[p];
    }
  }
  process(source, target);
  return target;
}
