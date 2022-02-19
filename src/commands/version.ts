export default (async function versionCommand() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { version } = require("../../package.json");
  console.log(`DesignTokensToRestyle v${version}`);
});
