<script lang="typescript">
    import { onMount } from "svelte";
    import {
        gLeftPanelVisible,
        gBottomPanelVisible,
        gRightPanelVisible,
        gHelpPanelVisible,
        gAudioTrack,
        gCurrentPlayingIndex,
        gPlaylist,
        showThenHideRightPanel,
        syncMedia,
        gVideoElement,
    } from "./common";
    import BottomPanel from "./BottomPanel.svelte";
    import LeftPanel from "./LeftPanel.svelte";
    import RightPanel from "./RightPanel.svelte";
    import HelpPanel from "./HelpPanel.svelte";
    import Player from "./Player.svelte";

    // let body: HTMLElement;
    let mediaElems: HTMLMediaElement[];
    let cheerElem: HTMLAudioElement;
    let isPaused = false;

    function togglePause() {
        isPaused = !isPaused;
        for (const elem of mediaElems) {
            if (elem) {
                window.setTimeout(() => {
                    {
                        if (isPaused) elem.pause();
                        else elem.play();
                    }
                }, 0);
            }
        }
    }

    function toggleFullscreen() {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
    }

    function handleHotKeys(e: KeyboardEvent) {
        {
            const targetNode: HTMLElement = e.target as HTMLElement;
            if (targetNode.nodeName.toLowerCase() !== "input") {
                const navStep = 10;
                switch (e.code) {
                    case "Space":
                        togglePause();
                        break;
                    case "KeyA":
                        gLeftPanelVisible.set(!$gLeftPanelVisible);
                        break;
                    case "KeyS":
                        gBottomPanelVisible.set(!$gBottomPanelVisible);
                        break;
                    case "KeyD":
                        gRightPanelVisible.set(!$gRightPanelVisible);
                        break;
                    case "KeyW":
                        if (
                            $gLeftPanelVisible &&
                            $gBottomPanelVisible &&
                            $gRightPanelVisible
                        ) {
                            gLeftPanelVisible.set(false);
                            gBottomPanelVisible.set(false);
                            gRightPanelVisible.set(false);
                        } else {
                            gLeftPanelVisible.set(true);
                            gBottomPanelVisible.set(true);
                            gRightPanelVisible.set(true);
                        }
                        break;
                    case "KeyR":
                        for (const elem of mediaElems) {
                            if (elem) {
                                elem.currentTime = 0;
                            }
                        }
                        break;
                    case "KeyQ":
                        if ($gCurrentPlayingIndex > 0) {
                            gCurrentPlayingIndex.set($gCurrentPlayingIndex - 1);
                            showThenHideRightPanel();
                        }
                        break;
                    case "KeyE":
                        if ($gCurrentPlayingIndex < $gPlaylist.length - 1) {
                            gCurrentPlayingIndex.set($gCurrentPlayingIndex + 1);
                            showThenHideRightPanel();
                        }
                        break;
                    case "KeyH":
                        gHelpPanelVisible.set(!$gHelpPanelVisible);
                        break;
                    case "KeyC":
                        cheerElem.play();
                        break;
                    case "ArrowLeft":
                        syncMedia(mediaElems, -navStep);
                        break;
                    case "ArrowRight":
                        syncMedia(mediaElems, navStep);
                        break;
                    case "Comma":
                        if (e.shiftKey)
                            syncMedia(mediaElems, -10 * navStep);
                        break;
                    case "Period":
                        if (e.shiftKey)
                            syncMedia(mediaElems, 10 * navStep);
                        break;
                    case "ArrowDown":
                        syncMedia(mediaElems);
                        break;
                    case "Digit1":
                    case "Numpad1":
                        gAudioTrack.set(0);
                        break;
                    case "Digit2":
                    case "Numpad2":
                        gAudioTrack.set(1);
                        break;
                    case "F11":
                        e.preventDefault();
                        toggleFullscreen();
                        break;
                    case "KeyL":
                        if (e.altKey) toggleFullscreen();
                        break;
                    case "Enter":
                    case "NumpadEnter":
                        if (e.ctrlKey) toggleFullscreen();
                        break;
                }
            }
        }
    }

    let fullscreenTimerId: number;
    function showCursor() {
        if ($gVideoElement) {
            if (document.fullscreenElement) {
                window.clearTimeout(fullscreenTimerId);
                const hideCursorDelay = 3000;
                fullscreenTimerId = window.setTimeout(
                    () => ($gVideoElement.style.cursor = "none"),
                    hideCursorDelay
                );
                console.log(fullscreenTimerId);
            }
            $gVideoElement.style.cursor = "default";
        }
    }

    onMount(() => {
        cheerElem.volume = 0.2;
    });
</script>

<svelte:window
    on:keydown={handleHotKeys}
    on:mousemove={showCursor}
    on:fullscreenchange={showCursor}
/>

<BottomPanel />
<LeftPanel />
<RightPanel />
<HelpPanel />
<div
    on:click={(e) => {
        if (e.button == 0) togglePause();
    }}
>
    <Player bind:mediaElems />
</div>
<audio bind:this={cheerElem} src="/cheer.mp3" type="audio/mp3" />

<style lang="scss">
    :global(body) {
        overflow-x: hidden;
        overflow-y: hidden;
        background-color: floralwhite;
    }
    :global(ul) {
        list-style-type: none;
    }
</style>
