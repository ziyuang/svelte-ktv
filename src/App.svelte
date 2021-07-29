<script lang="typescript">
    import { tweened } from "svelte/motion";
    import { Singer } from "./common";
    import RepoView from "./RepoView.svelte";
    import Player from "./Player.svelte";

    async function getRepo(): Promise<Singer[]> {
        const res = await fetch("/videos");
        return res.json();
    }

    const visibility = tweened(1, {
        duration: 100,
    });

    const xFull = 0;
    const opacityFull = 0.8;
    const xFolded = -249;
    const opacityFolded = 0;
</script>

{#await getRepo() then repo}
    <div
        id="panel"
        on:mouseenter={() => visibility.set(1)}
        on:mouseleave={() => visibility.set(0)}
        style="left:{$visibility * xFull +
            (1 - $visibility) * xFolded}px; opacity:{$visibility * opacityFull +
            (1 - $visibility) * opacityFolded}"
    >
        <RepoView {repo} />
    </div>
    <div>
        <Player />
    </div>
{/await}

<style lang="scss">
    div#panel {
        position: absolute;
        border-radius: 0px 5px 5px 0px;
        width: 250px;
        height: 92vh;
        top: 5px;
        overflow-y: auto;
        z-index: 100;
        font-family: sans-serif;
        background-color: white;
        left: 5px;
        opacity: 0.8;

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
