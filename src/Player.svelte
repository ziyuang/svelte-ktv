<script lang="typescript">
    import { writable } from "svelte/store";
    import {
        PlayListItem,
        gVideoElement,
        gMediaSource,
        gAudioTrack,
        gPlaylist,
        gCurrentPlayingIndex,
        gHelpPanelVisible,
        showThenHideRightPanel,
        socket,
    } from "./common";

    let videoElem: HTMLVideoElement;
    let audioElems: [HTMLAudioElement, HTMLAudioElement] = [
        undefined,
        undefined,
    ];
    export let mediaElems: HTMLMediaElement[] = [
        videoElem,
        audioElems[0],
        audioElems[1],
    ];

    let videoReady = false;
    let audioReady = [false, false];
    const allReady = writable(false);
    allReady.subscribe((value) => {
        if (value) {
            videoElem.play();
            for (let i = 0; i < audioElems.length; i++) {
                if (audioElems[i]) {
                    audioElems[i].volume = +(i == $gAudioTrack);
                    audioElems[i].play();
                }
            }
            gHelpPanelVisible.set(false);
        }
        mediaElems = [videoElem, audioElems[0], audioElems[1]];
        gVideoElement.set(videoElem);
    });

    gMediaSource.subscribe(() => {
        videoReady = audioReady[0] = audioReady[1] = false;
    });
    gAudioTrack.subscribe((value) => {
        for (let i = 0; i < audioElems.length; i++) {
            if (audioElems[i]) audioElems[i].volume = +(i == value);
        }
    });
    gCurrentPlayingIndex.subscribe((idx) => {
        if (0 <= idx && idx <= $gPlaylist.length - 1)
            gMediaSource.set($gPlaylist[idx].song.source);
    });

    gPlaylist.subscribe((newList) => {
        if (newList.length == 1) {
            gCurrentPlayingIndex.set(0);
        } else if (
            videoElem &&
            videoElem.ended &&
            $gCurrentPlayingIndex == newList.length - 2
        ) {
            gCurrentPlayingIndex.set(newList.length - 1);
        }
    });

    function playNext() {
        gCurrentPlayingIndex.set(
            Math.min($gCurrentPlayingIndex + 1, $gPlaylist.length - 1)
        );
        showThenHideRightPanel();
    }

    // as long as not in App and not contained in LeftPanelContent
    socket.onmessage = function (e: MessageEvent) {
        const playListItem: PlayListItem = JSON.parse(e.data);
        gPlaylist.set([...$gPlaylist, playListItem]);
        showThenHideRightPanel();
    };
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video
    src={$gMediaSource.video}
    type="video/mp4"
    preload="auto"
    bind:this={videoElem}
    on:canplay={() => {
        if ($gMediaSource.video !== "") {
            videoReady = true;
            allReady.set(videoReady && audioReady[0] && audioReady[1]);
        }
    }}
    on:ended={playNext}
/>

{#each [0, 1] as i}
    <audio
        src={$gMediaSource.audio[i]}
        type="audio/mp4"
        preload="auto"
        bind:this={audioElems[i]}
        on:canplay={() => {
            if ($gMediaSource.audio[i] !== "") {
                audioReady[i] = true;
                allReady.set(videoReady && audioReady[0] && audioReady[1]);
            }
        }}
    />
{/each}

<style lang="scss">
    video {
        z-index: -100;
        position: fixed;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        width: 100%;
        height: 100%;
    }
</style>
