/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Duplex, DuplexOptions } from "stream";

export class InOutStream extends Duplex {
  constructor(options?: DuplexOptions) {
    super(options);
  }

  _read(size: number) {
    // console.log(`${__filename} [_read] ${new Date().toISOString()}`);
  }
}
