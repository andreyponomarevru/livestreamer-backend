import { Duplex, DuplexOptions } from "stream";

export class InOutStream extends Duplex {
  constructor(options?: DuplexOptions) {
    super(options);
  }

  _read(size: number) {}

  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null | undefined) => void,
  ) {
    callback();
  }
}
