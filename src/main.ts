import { writeFileSync } from "fs";
import beautify from "js-beautify";

import { getTokenFileText } from "./utils/fileUtils";

import { extract, TokenEntry } from "./utils/tokenExtractor";

import convertTheme from "./themeConverter";
import convertTokens from "./convertTokens";

const fileTopText =
  'import { createTheme } from "@shopify/restyle";\n\n' +
  "type DeepPartial<T> = {\n[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]\n};\n\n";

export const main = async (readFilePath, writeFilePath) => {
  const fileText = getTokenFileText(readFilePath);

  const tokenCollection: TokenEntry[] = extract(fileText);

  const tokensText = await convertTokens(tokenCollection);
  const themeText = await convertTheme(tokenCollection);

  let outputFileText = fileTopText + tokensText + themeText;

  outputFileText = beautify(outputFileText, { indent_size: 2 });
  writeFileSync(writeFilePath, outputFileText);
  console.log("done");
};
