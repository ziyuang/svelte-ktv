<script lang="typescript">
    import TopPanel from "./TopPanel.svelte";
    import LeftPanel from "./LeftPanel.svelte";
    import Player from "./Player.svelte";
</script>

<TopPanel />
<LeftPanel />
<Player />

<style lang="scss">
    :global(div.panel) {
        position: absolute;
        z-index: 100;
        font-family: sans-serif;
        background-color: white;
        opacity: 0.8;
    }
</style>
