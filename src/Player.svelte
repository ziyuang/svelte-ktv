<script lang="typescript">
    import { writable } from "svelte/store";
    import { gblSource, gblTrack } from "./common";

    let videoElem: HTMLVideoElement;
    let audioElems: [HTMLAudioElement, HTMLAudioElement] = [null, null];
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
                    audioElems[i].volume = +(i == $gblTrack);
                    audioElems[i].play();
                }
            }
        }
        mediaElems = [videoElem, audioElems[0], audioElems[1]];
    });

    gblSource.subscribe(() => {
        videoReady = audioReady[0] = audioReady[1] = false;
    });
    gblTrack.subscribe((value) => {
        for (let i = 0; i < audioElems.length; i++) {
            if (audioElems[i]) audioElems[i].volume = +(i == value);
        }
    });
    // on:keydown={(e) => {
    //     console.log(e.code);
    //     if (e.key === " ") togglePause();
    // }}
    // on:click={(e) => {
    //     if (e.button == 0) togglePause();
    // }}
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video
    src={$gblSource.video}
    type="video/mp4"
    preload="auto"
    bind:this={videoElem}
    on:canplay={() => {
        if ($gblSource.video !== "") {
            videoReady = true;
            allReady.set(videoReady && audioReady[0] && audioReady[1]);
        }
    }}
/>

{#each [0, 1] as i}
    <audio
        src={$gblSource.audio[i]}
        type="audio/mp4"
        preload="auto"
        bind:this={audioElems[i]}
        on:canplay={() => {
            if ($gblSource.audio[i] !== "") {
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
