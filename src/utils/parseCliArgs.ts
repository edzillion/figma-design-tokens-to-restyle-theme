import minimist from "minimist";
import path from "path";
import availableCommands from "../commands/availableCommands";
import { CliArgTypes } from "../types/cli";

// Parses the command-line options received,
// and returns them structured as the command to run and options
export function parseCliArgs(argv: string[]): CliArgTypes {
  // remove optional unix node call
  if (path.basename(argv[0] || "") === "node") {
    argv.splice(0, 1);
  }

  // remove optional windows node call
  if (path.win32.basename(argv[0] || "") === "node.exe") {
    argv.splice(0, 1);
  }

  // remove optional linux text-run call
  if (path.basename(argv[0] || "") === "text-run") {
    argv.splice(0, 1);
  }

  // remove optional Windows CLI call
  // todo: pull this from module name
  if (argv[0] && argv[0].endsWith("figma-to-restyle")) {
    argv.splice(0, 1);
  }

  const result = minimist(argv, { boolean: "offline" });
  const commands = result._ || [];
  delete result._;

  // extract command
  let command = "";
  if (availableCommands().includes(commands[0])) {
    command = commands[0];
    commands.splice(0, 1);
  } else {
    command = "unknown";
  }
  result.command = command;
  result.files = commands;

  return result;
}
