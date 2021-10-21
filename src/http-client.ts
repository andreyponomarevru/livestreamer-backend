import http, { ClientRequest } from "http";

import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

import { API_URL, USERNAME, PASSWORD } from "./config";

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

export async function signIn() {
  await client.post(
    `${API_URL}/sessions`,
    { username: USERNAME, password: PASSWORD },
    { jar, withCredentials: true },
  );
}

export async function signOut() {
  await client.delete(`${API_URL}/sessions`, {
    jar,
    withCredentials: true,
    headers: {
      // Don't include port number in URL
      cookie: await jar.getCookieString("http://mix.ru"),
    },
  });
}

export async function startStream() {
  const httpReq = http.request({
    host: "mix.ru",
    port: 8000,
    path: "/api/v1/stream",
    method: "PUT",
    headers: {
      "content-type": "audio/mpeg",
      "transfer-encoding": "chunked",
      // Don't include port number in URL
      cookie: await jar.getCookieString("http://mix.ru"),
    },
  });

  httpReq.on("response", (res) => {
    console.log(res.statusCode);
    console.log(res.headers);

    res.on("data", async (chunk) => {
      console.log(chunk.toString());
      await signOut();
      process.exit(0);
    });

    res.on("error", async (err) => {
      console.error(`Response error: ${err}`);
      await signOut();
      process.exit(1);
    });
  });

  httpReq.on("error", async (err) => {
    console.error(`Request error: ${err}.`);
    await signOut();
    process.exit(1);
  });

  return httpReq;
}
