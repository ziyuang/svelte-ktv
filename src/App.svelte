<script lang="typescript">
    import TopPanel from "./TopPanel.svelte";
    import LeftPanel from "./LeftPanel.svelte";
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
        if (e.code === "Space") togglePause();
    }}
/>

<TopPanel />
<LeftPanel />
<div
    on:click={(e) => {
        if (e.button == 0) togglePause();
    }}
>
    <Player bind:mediaElems />
</div>

<style lang="scss">
    :global(div.panel) {
        position: absolute;
        z-index: 100;
        font-family: sans-serif;
        background-color: white;
        opacity: 0.7;
    }
</style>
