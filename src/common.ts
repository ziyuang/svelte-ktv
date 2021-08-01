import { writable, derived } from "svelte/store";
import { tweened, Tweened } from "svelte/motion";

export interface MediaSource {
    video: string;
    audio: [string, string]; // vocal, instrumental
}

// export type Song = [string, MediaSource]; // [song name, source]

export interface Song {
    name: string;
    source: MediaSource;
}

export interface Singer {
    name: string;
    songs: Song[];
}

export interface PlayListItem {
    singer: string;
    song: Song;
}

export const gMediaSource = writable<MediaSource>({
    video: "",
    audio: ["", ""],
});
export const gAudioTrack = writable(1);
export const gPlaylist = writable<PlayListItem[]>([]);
export const gCurrentPlayingIndex = writable(-1);
export const gLeftPanelVisible = writable(true);
export const gTopPanelVisible = writable(false);
export const gRightPanelVisible = writable(false);
export const gHelpPanelVisible = writable(true);

export const gRightPanelFoldingTimerIds = writable<number[]>([]);

export function getVisibilityTweening(defaultVisibility = 1) {
    return tweened(defaultVisibility, { duration: 100 });
}
export function deriveTweening(
    visibility: Tweened<number>,
    min: number,
    max: number
) {
    return derived(
        visibility,
        ($visibility) => (1 - $visibility) * min + $visibility * max
    );
}
