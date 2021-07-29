import { writable } from "svelte/store";

export const videoSource = writable("");
export interface Singer {
    name: string;
    songs: [string, string][]; // (song name, video path)
}
