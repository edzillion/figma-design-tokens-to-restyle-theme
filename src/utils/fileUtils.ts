import { promises as fs, readFileSync } from "fs";

async function getFiles(path = "./src/") {
  const entries = await fs.readdir(path, { withFileTypes: true });

  // Get files within the current directory and add a path key to the file objects
  const files = entries
    .filter((file) => !file.isDirectory())
    .map((file) => ({ ...file, path: path + file.name }));

  // Get folders within the current directory
  const folders = entries.filter((folder) => folder.isDirectory());

  /*
        Add the found files within the subdirectory to the files array by calling the
        current function itself
      */
  for (const folder of folders)
    files.push(...(await getFiles(`${path}${folder.name}/`)));

  return files;
}

export async function findFile(fileName = "theme.ts"): Promise<string> {
  const files = await getFiles();
  const restyleTokensFilePath = files.find((f) => f.name === fileName).path;
  return restyleTokensFilePath;
}

export function getTokenFileText(path = "./src/data/tokens.json"): string {
  let fileString: string;
  try {
    fileString = JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    console.error(err);
  }
  return fileString;
}
