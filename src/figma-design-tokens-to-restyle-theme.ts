import { writeFileSync } from "fs";
import { SingleTokenObject } from "./types/tokens";
import { getTokenFileText } from "./utils/fileUtils";
import {
  simpleObjectMerge,
  convertToNestedTokenObject,
  convertNumericKey,
  isSingleTokenObject,
  formatTokenValue,
} from "./utils/objUtils";
import { getTheme } from "./utils/themeExtractor";

import { process, TokenEntry } from "./utils/tokenExtractor";

const KNOWN_BASE_THEME_KEYS = [
  "colors",
  "spacing",
  "breakpoints",
  "zIndices",
  "borderRadii",
];

const translate = (type) => {
  if (type === "color") return "colors";
  if (type === "typography") return "textVariants";
  else return type;
};

const fileText = getTokenFileText();
const outFile = "";

const main = async () => {
  const tokenCollection: TokenEntry[] = process(fileText);

  const globalKeysObject = tokenCollection.reduce((accum, curr) => {
    if (curr.path[0] !== "global") return accum;
    const obj = convertToNestedTokenObject(curr);
    // need to drop the 'global' key for merge
    const mergePath = curr.path.slice(1);
    return simpleObjectMerge(mergePath, obj, accum);
  }, {});

  const generateGlobalKeysText = (globalKeysObject: object): string => {
    let returnText = "";
    let processText: string;

    const process = (key, obj, firstRunFlag?) => {
      if (!isSingleTokenObject(obj)) {
        if (firstRunFlag) processText += "const " + key + " = {\n";
        else processText += convertNumericKey(key) + ": {\n";
        Object.entries(obj).forEach(([key, value]) => process(key, value));
        if (firstRunFlag) processText += "}\n";
        else processText += "},\n";
      } else {
        const token: SingleTokenObject = obj;
        if (token.description) processText += "// " + token.description + "\n";
        if (firstRunFlag)
          processText +=
            "const " + key + " = " + formatTokenValue(token) + "\n";
        else
          processText +=
            convertNumericKey(key) + ": " + formatTokenValue(token) + ",\n";
      }
    };

    Object.entries(globalKeysObject).forEach(([key, value]) => {
      // can't deal with top level keys starting with numbers
      if (!isNaN(Number(key[0]))) return;
      processText = "";
      process(key, value, true);
      returnText += processText + "\n\n";
    });
    return returnText;
  };

  const globalText =
    'import { createTheme } from "@shopify/restyle"\n\n' +
    "type DeepPartial<T> = {\n[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]\n}\n\n" +
    generateGlobalKeysText(globalKeysObject);

  const themeTokens = tokenCollection.reduce((accum, curr) => {
    if (curr.path[0] === "global") return accum;
    if (!accum[curr.path[0]]) accum[curr.path[0]] = [];
    accum[curr.path[0]].push(curr);
    return accum;
  }, {});

  if (themeTokens["theme"] == null)
    throw Error(
      "Missing main theme. This exporter requires a top-level key named 'theme'"
    );

  const theme = await getTheme();
  const themeTextStems = {};

  let mainThemeText = "export const theme = createTheme({\n";

  // main theme
  themeTokens["theme"].forEach((tokenEntry: TokenEntry) => {
    const restlyeType = translate(tokenEntry.token.type);
    if (
      restlyeType !== "textVariants" &&
      !KNOWN_BASE_THEME_KEYS.includes(restlyeType)
    )
      return;
    if (!themeTextStems[restlyeType]) {
      themeTextStems[restlyeType] = restlyeType + ": {\n";
      // need to delete (overwrite) the key in our restyle theme so we can merge later
      delete theme.theme[restlyeType];
    }
    if (tokenEntry.token.description)
      themeTextStems[restlyeType] +=
        "// " + tokenEntry.token.description + "\n";

    const objectKey = tokenEntry.path
      .slice(1)
      .reduce((accum, curr) => accum + "_" + curr, "")
      .slice(1);

    themeTextStems[restlyeType] +=
      objectKey + ": " + formatTokenValue(tokenEntry.token) + ",\n";
  });

  Object.keys(themeTextStems).forEach((key) => {
    themeTextStems[key] += "},\n";
  });

  const replacer = (key, value) => {
    if (!isNaN(Number(value))) return Number(value);
    return value;
  };

  for (const [key, val] of Object.entries(theme.theme)) {
    themeTextStems[key] = key + ": " + JSON.stringify(val, replacer, 2) + ",\n";
  }

  Object.values(themeTextStems).forEach((element) => {
    mainThemeText += element;
  });

  mainThemeText += "})\n\n\n";

  delete themeTokens["theme"];

  const allSubThemesTextStems = {};

  Object.entries(themeTokens).forEach(([themeName, val]) => {
    if (!allSubThemesTextStems[themeName])
      allSubThemesTextStems[themeName] =
        "export const " + themeName + ": SubTheme = {\n";
    const subThemeTextStems = {};
    themeTokens[themeName].forEach((tokenEntry: TokenEntry) => {
      const restlyeType = translate(tokenEntry.token.type);
      if (
        restlyeType !== "textVariants" &&
        !KNOWN_BASE_THEME_KEYS.includes(restlyeType)
      )
        return;
      if (!subThemeTextStems[restlyeType]) {
        subThemeTextStems[restlyeType] = restlyeType + ": {\n";
      }
      if (tokenEntry.token.description)
        subThemeTextStems[restlyeType] +=
          "// " + tokenEntry.token.description + "\n";

      const objectKey = tokenEntry.path
        .slice(1)
        .reduce((accum, curr) => accum + "_" + curr, "")
        .slice(1);

      subThemeTextStems[restlyeType] +=
        objectKey + ": " + formatTokenValue(tokenEntry.token) + ",\n";
    });

    Object.keys(subThemeTextStems).forEach((key) => {
      subThemeTextStems[key] += "},\n";
      allSubThemesTextStems[themeName] += subThemeTextStems[key];
    });
  });

  let subThemeText = "";
  Object.values(allSubThemesTextStems).forEach((element) => {
    subThemeText += element;
    subThemeText += "}\n\n\n";
  });

  const outputFileText =
    globalText +
    mainThemeText +
    "type Theme = typeof theme;\ntype SubTheme = DeepPartial<Theme>\n\n" +
    subThemeText;
  writeFileSync("./src/results.ts", outputFileText);
  console.log("e");
};

main();
