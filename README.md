# LiveStreamer

* [About](#about)
* [Stack](#stack)
* [Backend](#backend)
* [Frontend](#frontend)
* [App Architecture](#app-architecture)
* [CI/CD, deployment]
* [How it works (high-level overview)](#how-it-works-high-level-overview)
* [How it works (low-level overview)](#how-it-works-low-level-overview)
* [Current Development Status](#current-development-status)



# About

Web application for broadcasting live audio and chatting. Conceptually, it is similar to [Mixlr](http://mixlr.com) but on a smaller scale.

Suppose you're a dj and you want to broadcast your mix live. All you need to do is to start up [this command-line app](https://github.com/ponomarevandrey/live-streamer-source-client) on your local machine — it captures the live audio output and streams it to the application server, which in turn broadcasts the audio to all connected listeners.



## Stack

* **backend:** TypeScript, Node.js (Express.js), PostgreSQL (raw SQL, without ORM), Redis
* **frontend:** React.js, SASS

Deployed with Docker using GitHub Actions.



## Backend

Here's a quick overview of features implemented in application server's API:

* cookie session authentication
* registration confirmation (by email)
* forgotten password recovery (by email)
* soft account deletion
* RBAC authorization
* caching of SQL queries (using Redis)
* rate-limiting
* cursor pagination
* chat (over HTTP + WebSocket)



## Frontend

Some screenshots (just to give you an idea of how the app looks in different states):

<img src="./doc/ui-screenshots/01.png" width="40%">

<img src="./doc/ui-screenshots/02.png" width="40%">

<img src="./doc/ui-screenshots/03.png" width="40%">

<img src="./doc/ui-screenshots/04.png" width="40%">

<img src="./doc/ui-screenshots/05.png" width="40%">

<img src="./doc/ui-screenshots/06.png" width="40%">



## App Architecture

```
                                                        chat over WebSocket + HTTP
            auido stream over HTTPS/1.1           audio stream over HTTP WebSocket
 BROADCASTER -----------------------> || APP SERVER ---------------------------> LISTENERS
(HTTP client)       mp3, 128kbps      ||                   mp3, 128kbps        (React Client)
                                      ||
                              Nginx as reverse proxy
                          translating HTTPS/1.1 to HTTP/2
```

![](./doc/architecture.png)

> There is only one difference between development and production environment — the presence of `client` container:
>
> * in the dev environment, React app runs in a separate `client` container and is served by `webpack-dev-server`
> * in production, I don't use the `client` container but serve the React app directly with Nginx instead i.e. I put all Webpack output into the `nginx` container



## CI/CD, deployment

Reverse proxy, frontend and backend are all deployed independently. 

Reverse proxy is located in [separate repo](https://github.com/ponomarevandrey/simple-cloud-nginx).

Frontend and backend as well as all database containers are all located in this repo.

The CI/CD pipeline is implemented using GitHub Actions. Here is the workflow logic. On every push:
1. run tests
2. build and upload images to DockerHub
3. pull images from DockerHub to app server
4. start the app using Docker Compose




## Database Schema

![](./doc/db-schema.png)



## How it works (high-level overview)

The app involves three parties: **source client (aka broadcaster)**, **Application Server** and **consuming client (aka listener(s))**:

* **source HTTP client (aka broadcaster)** (the app and its documentation are in the [separate repo](https://github.com/ponomarevandrey/live-streamer-source-client)) — it captures the audio output from OS and streams it to the app server using regular progressive HTTP streaming
* **application server** (this repo) — serves as audio streaming and chat server. It provides REST API used by both Source Client app and React.js client app. App server takes the incoming audio stream and passes it through to listeners.
* **consuming clients (aka listeners)**. React.js client-side app.



## How it works (low-level overview)

The application server is implemented as REST API and provides two main features of the app: audio broadcasting and chat.

0. To start streaming, the broadcaster should start the command line [Source Client app](https://github.com/ponomarevandrey/live-streamer-source-client) and log in to the application server. Authentication is implemented using a cookie session (stored in Redis).
1. When the broadcaster starts streaming, the Source Client app sends chunked audio stream in PUT request to `/stream` endpoint. Application server stores all live stream data (listener count, likes, etc.) in Redis.
2. Application server detects the start of the stream and sends a notification to the frontend over WebSocket.
3. On the client side, React receives WebSocket notification and switches into "LIVE" mode, displaying the stream status, timer, number of listeners online, and other data. When the user clicks the 'play' button, React fetches live audio using `GET /stream`.
4. During the stream, listeners can "like" the broadcast showing that they like the music by clicking the 'heart' button. After clicking, the button becomes inactive for 10 seconds. The API endpoint allowing to "like" the broadcast is rate limited, so if the client attempts to trick the app by sending multiple "like" requests directly to the API endpoint, Nginx will ban the client's IP for some time.
5. After the broadcast is finished, all stream data is saved from Redis to PostgreSQL. By default, the finished stream is hidden — it is not visible to listeners; only the user with broadcaster's permissions can log in and publish (make visible to everyone) the finished broadcasts. Broadcaster can also edit/update title, description, links, and other metadata of past broadcasts.
6. Broadcaster can schedule new broadcasts (this feature is currently supported only by API; React client doesn't provide an interface for this). To do this, the client should send the scheduled broadcast's title and start/end date, and time

All chat functionality, notifications as well as other real-time features are implemented over WebSocket + HTTP. Technically it is possible to implement everything solely over WebSocket, but it would end up in a pretty chaotic and unreliable client-server communication. So, to make the interaction more organized, I utilize both WebSocket and HTTP. For instance, this is how I implemented the chat:

1.  Client sends a chat message to REST API
2.  API saves the message to the database and returns 200 response to the sender.
3.  Then API broadcasts the saved message to all connected clients (except sender) over WebSocket.

    Thus we get the benefits of REST architecture and Websocket protocol at the same time. While WebSocket allows us to do everything in real-time, REST provides the structure and order in client-server communication.


## Current Development Status

* all of the essential features of the app server are implemented; the code needs some refactoring, but I decided not to touch anything until I write more unit tests
* yep, there are very few tests written overall; I'm currently working to fix this
* also, at the moment of writing, React client uses only a fraction of the existing API
