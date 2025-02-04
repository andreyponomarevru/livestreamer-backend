// eslint-disable-next-line @typescript-eslint/no-require-imports
require("ts-node/register");

// Executed once, after all tests

async function globalTeardown() {
  console.log("[Jest globalTeardown Hook] Stop container");
}

export default globalTeardown;
