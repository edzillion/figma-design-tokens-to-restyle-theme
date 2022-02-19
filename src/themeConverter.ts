import { formatTokenValue } from "./utils/objUtils";
import { extractRestyleTheme } from "./utils/themeExtractor";
import { TokenEntry } from "./utils/tokenExtractor";

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

export default async (tokenCollection): Promise<string> => {
  const themeTokens = tokenCollection.reduce((accum, curr) => {
    if (curr.path[0] === "global") return accum;
    if (!accum[curr.path[0]]) accum[curr.path[0]] = [];
    accum[curr.path[0]].push(curr);
    return accum;
  }, {});

  if (themeTokens["theme"] == null) {
    console.error(
      "Missing main theme. The theme conversion requires a top-level key named 'theme'"
    );
    return "";
  }
  // throw Error(
  //   "Missing main theme. This exporter requires a top-level key named 'theme'"
  // );

  const theme = await extractRestyleTheme();
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

  mainThemeText += "});\n\n\n";

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
    subThemeText += "};\n\n\n";
  });

  const typeDeclarationsText =
    "type Theme = typeof theme;\ntype SubTheme = DeepPartial<Theme>;\n\n";

  return mainThemeText + typeDeclarationsText + subThemeText;
};
