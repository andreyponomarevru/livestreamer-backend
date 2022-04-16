# LiveStreamer HTTP Client

The app consists of two parts: 
* child process capturing all OS audio
* HTTP client, sending the captured audio to the server in real-time. 

To authenticate to the application server, the client uses regular cookie authentication.



## Requirements

This command-line app requires two environment variables containing your username and password: `BROADCASTER_USERNAME` and `BROADCASTER_PASSWORD`.

## How to use

1. First, log in to the application server: `node build/index.js login:prod`
2. Now you can start broadcasting audio. Issue the following command:
   ```shell
   node build/index.js stream:prod
   
   # You can pass additional 'save' option to write the stream to disk while you're streaming:
   node build/index.js stream:prod save
   ```
3. After the stream is finished, log out: `node build/index.js logout:prod`

   If you have passed the `save` option in step 2, you will find the `.wav` file of the recorded stream in the `recordings` directory.
