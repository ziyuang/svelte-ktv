import { writable, derived } from "svelte/store";
import { Tweened, tweened } from "svelte/motion";

export interface Singer {
    name: string;
    songs: [string, string][]; // (song name, video path)
}

export const videoSource = writable("");

export const panelVisibility = tweened(1, {
    duration: 100,
});
export function createTweening(
    min: number,
    max: number,
    v: Tweened<number> = panelVisibility
) {
    return derived(v, ($v) => (1 - $v) * min + $v * max);
}
