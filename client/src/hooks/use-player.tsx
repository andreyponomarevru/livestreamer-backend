import * as React from "react";
import { API_ROOT_URL } from "../config/env";

type State = { audio: HTMLAudioElement | null };

type Player = [State, () => void];

export function useGetStream() {
  const URL = `${API_ROOT_URL}/stream`; // GET
}

function usePlayer(url: string): Player {
  const initialState = { audio: null };

  const togglePlay = () => {
    const audio = new Audio(url);
    console.log(audio);
    audio.play();
    console.log("triggered");
    /*
    if (audio.readyState >= 2) {
      audio.play();
    }*/
  };

  /*audio.addEventListener("loadeddata", () => {
 
  });*/
  /*
  useEffect(() => {
    console.log("----------------------", initialState.audio);
    //if (audio.readyState === 4) {
    //  audio.play();
    //}
  }, [audio.readyState]);
  */
  return [initialState, togglePlay];
}

/*
interface TrackExtendedMetadata {
  [key: string]: any;
}

const { REACT_APP_API_ROOT } = process.env;

type Play = {
  type: "PLAY";
  payload: { audio: HTMLAudioElement };
};
type Pause = { type: "PAUSE" };
type Resume = { type: "RESUME" };
type Stop = { type: "STOP" };

type State = {
  isPlaying: boolean;
  audio: HTMLAudioElement | null;
  streamUrl: string;
};
type Action = Play | Pause | Resume | Stop;

type Player = [State, () => void];

//

function playerReducer(state: State, action: Action) {
  switch (action.type) {
    case "PLAY":
      if (state.audio && state.isPlaying) state.audio.pause();
      else if (state.audio && state.isPlaying) state.audio.play();
      return {
        ...state,
        isPlaying: true,
        audio: action.payload.audio,
      };

    case "PAUSE":
      return { ...state, isPlaying: false };

    case "RESUME":
      return { ...state, isPlaying: true };

    case "STOP":
      return {
        ...state,
        isPlaying: false,
        audio: null,
        playingTrackMeta: undefined,
      };

    default:
      throw new Error();
  }
}

export function usePlayer(streamUrl: string): Player {
  const audio = new Audio(streamUrl);
  audio.loop = false;
  audio.autoplay = true;

  const initialState: State = {
    isPlaying: false,
    audio,
    streamUrl,
  };

  const [state, dispatch] = useReducer(playerReducer, initialState);

  const togglePlay = () => {
    console.log("toggle");

    //const audio = new Audio(streamUrl);

    // if HAVE_ENOUGH_DATA
    //if (audio.readyState === 4) {

    //console.log("dispatch 'play'");
    //}

    console.log(state);
    // If we've clicked on an already playing tracks
    // dispatch({ type: "PAUSE" });
    // If we've clicked on a paused tracks
    // dispatch({ type: "RESUME" });
    // If we've clicked on a new track

    //if (state.audio && state.audio.ended) {
    //  dispatch({ type: "STOP" });
  };

  useEffect(() => {
    console.log(state);
    dispatch({ type: "PLAY", payload: { audio } });
    /
		//if (state.audio && state.isPlaying) state.audio.play();
    //else if (state.audio && !state.isPlaying) {
      
      //state.audio.pause();
    //}
  }, [state.isPlaying state.audio]);

  return [state, togglePlay];
}
*/

export { usePlayer };
