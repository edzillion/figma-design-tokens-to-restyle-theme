import path from "path";
import { main } from "../main";

export default async function convertCommand(
  files: string[]
): Promise<Error[]> {
  await main(files[0], files[1]);
  return [];
}

// function template(filename: string) {
//   return `module.exports = async function (activity) {
//   console.log('This code runs inside the "${filename}" block implementation.')
//   console.log('I found these elements in your document:')
//   console.log(activity.nodes)

//   // capture content from the document
//   // const content = activity.searcher.tagContent('boldtext')
//   // do something with the content
//   // formatter.log(content)
// }
// `;
// }
