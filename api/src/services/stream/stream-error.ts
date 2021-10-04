type StreamErrorNames = "STREAM_PAUSED";

export class StreamError {
  name: string;

  constructor(name: StreamErrorNames) {
    this.name = name;
  }
}
