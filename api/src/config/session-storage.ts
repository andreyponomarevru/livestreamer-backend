import session from "express-session";
import redisSession from "connect-redis";

import {
  REDIS_PORT,
  REDIST_HOST,
  AUTH_COOKIE_SECRET,
  COOKIE_NAME,
  REDIS_COOKIE_EXPIRATION_TTL,
  NODE_ENV,
  EXPRESS_SESSION_COOKIE_MAXAGE,
} from "./env";
import * as redis from "./redis";

const RedisStore = redisSession(session);

export const sess = {
  store: new RedisStore({
    host: "localhost",
    // Doc: https://github.com/tj/connect-redis
    // From doc:
    //
    // "If the session cookie has a `expires` date, `connect-redis`
    // will use it as the TTL."
    // Otherwise, it will expire the session using the `ttl` option (default:
    // 86400 seconds or one day).
    //
    // Note: The TTL is reset every time a user interacts with the server. You
    // can disable this behavior in *some* instances by using `disableTouch`.
    //
    // Note: `express-session` does not update `expires` until the end of the request life cycle. Calling `session.save()` manually beforehand will have the previous value.
    client: redis.connectDB().nodeRedis,
    // The ttl is used to create an expiration date. If you do not want to expire your cookie, check out https://stackoverflow.com/a/35127487/13156302
    // ttl: REDIS_COOKIE_EXPIRATION_TTL,
  }),
  saveUninitialized: false,
  resave: false,
  secret: AUTH_COOKIE_SECRET,
  name: COOKIE_NAME,
  cookie: {
    httpOnly: true,
    sameSite: true,
    maxAge: EXPRESS_SESSION_COOKIE_MAXAGE, // time in ms
    // Adds 'Secure' flag to cookie. Don't use it in development, or
    // you'll need to have HTTPS enabled on your dev server. More on this:
    // https://stackoverflow.com/questions/40324121/express-session-secure-true
    // http://expressjs.com/en/resources/middleware/session.html
    secure: NODE_ENV === "prod",
  },
};
