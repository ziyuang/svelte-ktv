import { writable, derived, get } from "svelte/store";
import { tweened, Tweened } from "svelte/motion";

export interface MediaSource {
    video: string;
    audio: [string, string]; // vocal, instrumental
}

export interface Song {
    name: string;
    source: MediaSource;
}

export interface Singer {
    name: string;
    songs: Song[];
}

export interface PlayListItem {
    id: string;
    singer: string;
    song: Song;
}

export enum PanelLocation {
    Bottom,
    Left,
    Middle,
    Right,
}

export const gMediaSource = writable<MediaSource>({
    video: "",
    audio: ["", ""],
});

export const gVideoElement = writable<HTMLVideoElement | undefined>(undefined);
export const gSearchString = writable("");
export const gAudioTrack = writable(1);
export const gPlaylist = writable<PlayListItem[]>([]);
export const gCurrentPlayingIndex = writable(-1);
export const gLeftPanelVisible = writable(false);
export const gBottomPanelVisible = writable(false);
export const gRightPanelVisible = writable(false);
export const gHelpPanelVisible = writable(true);

export const gRightPanelFoldingTimerId = writable<number>(-1);
export const gRightPanelFoldingDisabled = writable(false);
export function showThenHideRightPanel(delay: number = 3000) {
    gRightPanelVisible.set(true);
    const prevTimer = get(gRightPanelFoldingTimerId);
    if (prevTimer >= 0) window.clearTimeout(prevTimer);
    if (!get(gRightPanelFoldingDisabled)) {
        const timer = window.setTimeout(
            () => gRightPanelVisible.set(false),
            delay
        );
        gRightPanelFoldingTimerId.set(timer);
    }
}

export function getVisibilityTweening(defaultVisibility = 0, duration = 100) {
    return tweened(defaultVisibility, { duration: duration });
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

export function syncMedia(
    mediaElems: HTMLMediaElement[],
    offset: number = 0,
    sync: boolean = false
) {
    const refElem = mediaElems[mediaElems.length - 1];
    const refTime = Math.max(
        Math.min(refElem.currentTime + offset, refElem.duration),
        0
    );
    for (let i = 0; i < mediaElems.length; i++) {
        if (sync) mediaElems[i].currentTime = refTime;
        else window.setTimeout(() => (mediaElems[i].currentTime = refTime), 0);
    }
}
