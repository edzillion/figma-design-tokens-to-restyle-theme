import { endChildProcesses } from "end-child-processes";
import run from "./run";
import { parseCliArgs } from "./utils/parseCliArgs";

async function main() {
  const cliArgs = parseCliArgs(process.argv);
  const errors: Error[] = await run(cliArgs);
  for (const err of errors) {
    console.log(err.stack);
  }
  endChildProcesses();
  process.exit(errors.length);
}
main();
