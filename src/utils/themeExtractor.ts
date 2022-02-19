import { readFileSync } from "fs";
import { findFile } from "./fileUtils";

let data: string;

const themeObj: ThemeObj = {};

interface ThemeObj {
  themeName?: string;
  theme?: any;
}

export async function extractRestyleTheme() {
  try {
    const filePath = await findFile();
    data = readFileSync(filePath, "utf8");
  } catch (err) {
    console.error(err);
  }

  const themeNameRegex = new RegExp(/(?<=const).*(?=createTheme)/g);
  if (themeNameRegex.test(data)) {
    themeObj.themeName = data.match(themeNameRegex)[0].trim().split(" ")[0];
  }

  const themeRegex = new RegExp(/createTheme\({[\s\S]*?}\)/gm);
  if (themeRegex.test(data)) {
    let themeBlock = data.match(themeRegex)[0];
    themeBlock = themeBlock.slice(themeBlock.search("{"), -1);

    const destructuringAssignmentsRegex = new RegExp(/(\.\.\.).*/g);
    let jsonStr = themeBlock.replace(
      destructuringAssignmentsRegex,
      function () {
        return "";
      }
    );

    const propertyKeysRegex = new RegExp(/(\w+:)|(\w+ :)/g);
    jsonStr = jsonStr.replace(propertyKeysRegex, function (matchedStr) {
      return '"' + matchedStr.substring(0, matchedStr.length - 1) + '":';
    });

    const propertyValuesRegex = new RegExp(/(?<=:\s).*(?=,)/g);
    jsonStr = jsonStr.replace(propertyValuesRegex, function (matchedStr) {
      if (matchedStr[0] !== "'" && matchedStr[0] !== '"')
        return '"' + matchedStr + '"';
      return matchedStr;
    });

    const trailingCommasRegex = new RegExp(/(,\s*\})/g);
    Array.from(jsonStr.matchAll(trailingCommasRegex))
      .map((match: any) => match.index)
      .sort((a, b) => b - a)
      .forEach((index) => {
        if (jsonStr.charAt(index) === ",") {
          jsonStr = jsonStr.slice(0, index) + jsonStr.slice(index + 1);
        }
      });

    themeObj.theme = JSON.parse(jsonStr);
    return themeObj;
  }
}
