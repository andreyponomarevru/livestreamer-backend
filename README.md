# ChilloutTribe

Web application for broadcasting live audio and chat. Roughly speaking, it is like [Mixlr](https://mixlr.com) but on a smaller scale and  built with minimum tools and resources.
 
- JavaScript/TypeScript as the main programming language
- Node.js as an Application Server
- Node.js CLI App as producing client aka broadcaster
- HTTP for streaming audio (Progressive HTTP Streaming)
- WebSocket for chat and other real-time data

The app involves three parties: **producing client (aka broadcaster)** > **Application Server** > **consuming clients (aka listeners)**

The app comprises three parts:
- command-line HTTP client running on a broadcaster side. It captures the live audio output and streams it to the application server
- application server consisting of HTTP server and WebSocket server. HTTP server writes incoming live audio stream to disk and passes it through the WebSocket to the consuming clients (listeners)
- consuming clients

## Current Development Status

Work In Progress



## App Architecture

![](./doc/architecture.png)



## Database Schema

![](./doc/db-schema.png)


