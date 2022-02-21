import {
  ShadowTokenSingleValue,
  TypographyObject,
} from "../types/propertyTypes";
import {
  isCompositeTokenType,
  isTokenType,
  SingleTokenObject,
  TokenGroup,
  TokenEntry,
} from "../types/tokens";

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

export function isTokenGroup(object: unknown): object is TokenGroup {
  const groupType = object["type"];
  if (groupType && isTokenType(groupType)) {
    return Object.keys(object).every((key) => {
      if (key === "type") return true;
      // each child should conform to the shape of the stated type
      if (isCompositeTokenType(groupType)) {
        return true;
      } else if (object[key].value && typeof object[key].value === "string")
        return true;
    });
  } else return false;
}

export function formatTokenKey(key) {
  if (isValidVarName(key)) return key;
  else return "['" + key + "']";
}

export function formatTokenVariable(key) {
  if (isValidVarName(key)) return key;
  else {
    // replace all dots and dashes with underlines
    // todo: make the separator & prefix configurable?
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

    // is this variable referencing an object path created using ['var'] notation?
    // linters will throw errors as they cannot tell whether the prop access is valid
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

// convert a TokenEntry so that entry.path [pathPart1][pathPart2][pathPart3] is converted into
// { pathPart1:{ pathPart2:{ pathPart3: entry.token } } } }
export const convertToNestedTokenObject = (entry: TokenEntry): object => {
  function reducer(all, pathPart, index, array) {
    // if we are at the end of the path then attach the token
    if (index === array.length - 1) {
      return { [pathPart]: entry.token };
    }
    return { [pathPart]: all };
  }
  return entry.path.reduceRight(reducer.bind({ entry }), {});
};

// simpleObjectMerge only works for our use case
export function simpleObjectMerge(
  path: string[],
  source: object,
  target: object
): object {
  let index = -1;
  function process(source, target) {
    if (++index < path.length) {
      const p = path[index];
      if (target[p]) process(source[p], target[p]);
      else target[p] = source[p];
    }
  }
  process(source, target);
  return target;
}
