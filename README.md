# Timer App

Timer App is a small JS/HTML App, run locally. It plays a starting sound, a sound in the middle to signal half of the time has run out and an ending sound. It also plays a Jingle if selected in the beginning and pauses your Spotify for the duration of it.
The app was created for Tournaments with timed games.

## Installation

You need Python to run the local server to prevent CORS Errors.

## Usage

To use the Spotify pause and play feature you need to create a Spotify App and get your Client ID, Client Secret and Refresh Token.
You need to add these details to the **credentials.json** (you can use the example file but need to rename it to credentials.json)

```json
{
    "client_id": "YOUR CLIENT ID",
    "client_secret": "YOUR CLIENT SECRET",
    "refresh_token": "YOUR REFRESH TOKEN"
}
```

To start the local server simply use:

```shell
bash start_server.sh
```

After starting the server you can reach the app here:

> <http://localhost>:CONFIGURED PORT(standard is 80)

To edit the timer runtime, you can use the Form Field within the app.
