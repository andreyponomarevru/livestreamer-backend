# LiveStreamer HTTP Client

## Requirements
This command-line app requires two environment variables containing your username and password: `BROADCASTER_USERNAME` and `BROADCASTER_PASSWORD`.

## How to use

1. First, log in to the application server: `node build/index.js log-in`
2. Now you can start broadcasting audio. Issue the following command:
   ```shell
   node build/index.js stream
   
   # You can pass additional 'save' option to write the stream to disk while you're streaming:
   node build/index.js stream save
   ```
3. After the stream is finished, log out: `node build/index.js log-out`

   If you have passed the `save` option in step 2, you will find the `.wav` file of the recorded stream in the `recordings` directory.
