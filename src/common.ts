import { writable, derived } from "svelte/store";
import { tweened, Tweened } from "svelte/motion";

export interface Track {
    video: string;
    audio: [string, string]; // vocal, instrumental
}

export type SongEntry = [string, Track];

export interface Singer {
    name: string;
    songs: SongEntry[];
}

export const gblSource = writable<Track>({
    video: "",
    audio: ["", ""],
});

export const gblTrack = writable(1);

export function getDefaultVisibilityTweening(defaultVisibility = 1) {
    return tweened(defaultVisibility, { duration: 100 });
}
export function createTweening(
    visibility: Tweened<number>,
    min: number,
    max: number
) {
    return derived(
        visibility,
        ($visibility) => (1 - $visibility) * min + $visibility * max
    );
}
