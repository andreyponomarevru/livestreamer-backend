export function isFutureTimestamp(timestamp: string) {
  const tsInFuture = new Date(timestamp).getTime();
  const tsNow = new Date().getTime();
  const diff = tsInFuture - tsNow;
  return diff > 0;
}
