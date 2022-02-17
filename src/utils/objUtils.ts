import {
  ShadowTokenSingleValue,
  TypographyObject,
} from "../types/propertyTypes";
import { SingleTokenObject } from "../types/tokens";
import { TokenEntry } from "./tokenExtractor";

export function isSingleTokenObject(
  object: unknown
): object is SingleTokenObject {
  return typeof object === "object" && "value" in object && "type" in object;
}

export function convertNumericKey(key) {
  if (isNaN(Number(key[0]))) return key;
  else return "['" + key + "']";
}

export function formatTokenValue(token: SingleTokenObject): string {
  function process(tokenValue: string): string {
    let variablePath = tokenValue.slice(1, -1);
    variablePath = variablePath
      .split(".")
      .map((pathPart) => {
        if (isNaN(Number(pathPart[0]))) return "." + pathPart;
        else return "['" + pathPart + "']";
      })
      .join("")
      .slice(1);
    return variablePath;
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

  // drop the top key 'global', from the conversion
  const clonedPath = JSON.parse(JSON.stringify(entry.path.slice(1)));
  return clonedPath.reduceRight(reducer.bind({ entry }), {});
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
