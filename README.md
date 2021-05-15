# Aelita 

Web application for broadcasting live audio and chat. It's an attempt to recreate [Mixlr](https://mixlr.com) functionality but on a smaller scale and with minimum tools and resources: 
* JavaScript/TypeScript as the programming language
* Node.js as an application server
* HTTP and WebSockets for real-time data transfer

The app involves three parties: producing client (aka broadcaster) > Application Server > consuming clients (aka listeners)

The app comprises three parts:
- command-line HTTP client running on a broadcaster side. It captures the live audio output and streams it to the application server
- application server consisting of HTTP server and WebSocket server. HTTP server writes incoming live audio stream to disk and passes it through the WebSocket to the consuming clients (listeners)
- consuming clients
