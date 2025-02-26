import { spawn } from "child_process";

import { FFMPEG_ARGS } from "./config/audio";

const child = spawn("ffmpeg", FFMPEG_ARGS);
// Without piping to process.stderr, ffmpeg silently hangs
// after a few minutes
child.stderr.pipe(process.stderr);

export { child as audioStream };
