import { writeFileSync } from "fs";
import beautify from "js-beautify";

import { getTokenFileText } from "../utils/fileUtils";

import extractTokens from "../modules/tokenExtractor";
import convertTokens from "../modules/tokenConverter";
import convertTheme from "../modules/themeConverter";

const fileTopText =
  'import { createTheme } from "@shopify/restyle";\n\n' +
  "type DeepPartial<T> = {\n[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]\n};\n\n";

export default async function convertCommand(
  files: string[]
): Promise<Error[]> {
  const fileText = getTokenFileText(files[0]);

  const tokenCollection = extractTokens(fileText);
  const tokensText = await convertTokens(tokenCollection);
  const themeText = await convertTheme(tokenCollection);

  let outputFileText = fileTopText + tokensText + themeText;

  outputFileText = beautify(outputFileText, { indent_size: 2 });
  const writeFilePath = files[1] || "./out/tokens.ts";
  writeFileSync(writeFilePath, outputFileText);
  return [];
}
