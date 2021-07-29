<script lang="typescript">
    import { videoSource } from "./common";

    let currentSource: string;
    let videoElement: HTMLVideoElement;
    const unsubscribe = videoSource.subscribe((value) => {
        currentSource = value;
        if (currentSource !== "") videoElement.play();
    });
</script>

<video src={currentSource} controls bind:this={videoElement}>
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
