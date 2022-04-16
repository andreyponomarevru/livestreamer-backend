export function encodeNextPageCursor(
  recordTimestamp: string,
  recordId: number,
): string {
  const cursor = `${recordTimestamp},${recordId}`;
  return Buffer.from(cursor).toString("base64");
}

export function decodeNextPageCursor(cursor?: string): {
  timestampCursor?: string;
  idCursor?: number;
} {
  let timestampCursor: string | undefined;
  let idCursor: number | undefined;

  if (cursor === "") throw new Error("Empty string is not allowed");
  if (cursor) {
    const decoded = Buffer.from(cursor, "base64").toString("ascii").split(",");
    if (decoded.length !== 2) throw new Error("Invalid cursor format");
    timestampCursor = decoded[0];
    idCursor = parseInt(decoded[1]);
  }

  return {
    timestampCursor,
    idCursor,
  };
}
