<script lang="typescript">
    import { videoSource } from "./common";

    let videoElement: HTMLVideoElement;
</script>

<video
    src={$videoSource}
    controls
    bind:this={videoElement}
    on:loadeddata={() => {
        if ($videoSource !== "") videoElement.play();
    }}
>
    <track kind="captions" />
</video>

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
