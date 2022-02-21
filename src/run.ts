import convertCommand from "./commands/convert";
import versionCommand from "./commands/version";
import { CliArgTypes } from "./types/cli";

export default async function (cmdLineArgs: CliArgTypes): Promise<Error[]> {
  try {
    const commandName = cmdLineArgs.command;
    let errors;
    switch (commandName) {
      case "convert":
        errors = await convertCommand(cmdLineArgs.files);
        return errors;
      case "version":
        await versionCommand();
        return [];
      default:
        console.log(`unknown command: ${commandName}`);
        return [];
    }
  } catch (err) {
    return [err];
  }
}
