export const WS_SERVER_URL = "ws://localhost:5000/stream";

export const REQUEST_OPTIONS = {
  host: "localhost",
  port: 5000,
  path: "/api/v1/stream",
  method: "PUT",
  headers: {
    "content-type": "audio/mpeg",
    "transfer-encoding": "chunked",
  },
};

export const STREAM_AUDIO_CONFIG = {
  encoding: "mp3",
  bitrate: "192k",
};

export const FFMPEG_ARGS = [
  // hide barnner with irrelevant config
  "-hide_banner",
  // to make output even less verbose, output only errors (https://superuser.com/questions/326629/how-can-i-make-ffmpeg-be-quieter-less-verbose)
  "-loglevel",
  "error",
  // capture OS audio output (from pulseaudio)
  "-f",
  "pulse",
  // input device "default"
  "-i",
  "default",
  // output in .mp3
  "-f",
  "mp3",
  // set bitrate (":a" is "for audio")
  "-b:a",
  "192k",
  // pipe instead of saving to disk
  "pipe:1",
];
