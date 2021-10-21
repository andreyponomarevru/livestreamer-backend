export async function onUncaughtException(err: Error) {
  console.error(`uncaughtException: ${err.message} \n${err.stack}`);
  process.exit(1);
}

export async function onUnhandledRejection(reason: string, p: unknown) {
  console.error(`UnhandledRejection: ${p}, reason "${reason}"`);
  process.exit(1);
}
