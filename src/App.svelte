<script lang="typescript">
    import {
        gLeftPanelVisible,
        gTopPanelVisible,
        gRightPanelVisible,
        gAudioTrack,
        gCurrentPlayingIndex,
        gPlaylist,
    } from "./common";
    import TopPanel from "./TopPanel.svelte";
    import LeftPanel from "./LeftPanel.svelte";
    import RightPanel from "./RightPanel.svelte";
    import HelpPanel from "./HelpPanel.svelte";
    import Player from "./Player.svelte";

    let mediaElems: HTMLMediaElement[];
    let isPaused = false;

    function togglePause() {
        isPaused = !isPaused;
        for (const elem of mediaElems) {
            if (elem) {
                if (isPaused) elem.pause();
                else elem.play();
            }
        }
    }
</script>

<svelte:window
    on:keydown={(e) => {
        let refTime = 0;
        const navStep = 10;
        switch (e.code) {
            case "Space":
                togglePause();
                break;
            case "KeyA":
                gLeftPanelVisible.set(!$gLeftPanelVisible);
                break;
            case "KeyW":
                gTopPanelVisible.set(!$gTopPanelVisible);
                break;
            case "KeyD":
                gRightPanelVisible.set(!$gRightPanelVisible);
                break;
            case "KeyS":
                if (
                    $gLeftPanelVisible &&
                    $gTopPanelVisible &&
                    $gRightPanelVisible
                ) {
                    gLeftPanelVisible.set(false);
                    gTopPanelVisible.set(false);
                    gRightPanelVisible.set(false);
                } else {
                    gLeftPanelVisible.set(true);
                    gTopPanelVisible.set(true);
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
                if ($gCurrentPlayingIndex > 0)
                    gCurrentPlayingIndex.set($gCurrentPlayingIndex - 1);
                break;
            case "KeyE":
                if ($gCurrentPlayingIndex < $gPlaylist.length - 1)
                    gCurrentPlayingIndex.set($gCurrentPlayingIndex + 1);
                break;
            case "ArrowLeft":
                refTime = mediaElems[0].currentTime;
                for (const elem of mediaElems) {
                    if (elem) {
                        elem.currentTime = Math.max(refTime - navStep, 0);
                    }
                }
                break;
            case "ArrowRight":
                refTime = mediaElems[0].currentTime;
                for (const elem of mediaElems) {
                    if (elem) {
                        elem.currentTime = Math.min(
                            refTime + navStep,
                            elem.duration
                        );
                    }
                }
                break;
            case "ArrowDown":
                refTime = mediaElems[0].currentTime;
                for (const elem of mediaElems) {
                    if (elem) {
                        elem.currentTime = refTime;
                    }
                }
                break;
            case "Digit1":
                gAudioTrack.set(0);
                break;
            case "Digit2":
                gAudioTrack.set(1);
                break;
        }
    }}
/>

<TopPanel />
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

<style lang="scss">
    :global(body) {
        overflow-x: hidden;
        background-color: floralwhite;
    }
    :global(div.panel) {
        position: absolute;
        z-index: 100;
        font-family: sans-serif;
        background-color: white;
        opacity: 0.7;
        // https://stackoverflow.com/a/42115371/688080
        &::-webkit-scrollbar {
            width: 12px;
        }
        &::-webkit-scrollbar-track {
            border-radius: 5px;
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 5px;
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
        }
    }
</style>
