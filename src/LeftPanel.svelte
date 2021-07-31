<script lang="typescript">
    import {
        Singer,
        getDefaultVisibilityTweening,
        createTweening,
    } from "./common";
    import RepoView from "./RepoView.svelte";

    async function getRepo(): Promise<Singer[]> {
        const res = await fetch("/videos");
        return res.json();
    }

    const visibility = getDefaultVisibilityTweening();
    const leftTweening = createTweening(visibility, -230, 0);
    const opacityTweening = createTweening(visibility, 0, 0.7);
</script>

<div
    class="panel"
    on:mouseenter={() => visibility.set(1)}
    on:mouseleave={() => visibility.set(0)}
    style="left:{$leftTweening}px; opacity:{$opacityTweening}"
>
    {#await getRepo() then repo}
        <RepoView {repo} />
    {/await}
</div>

<style lang="scss">
    div.panel {
        border-radius: 0px 5px 5px 0px;
        width: 250px;
        height: 92vh;
        top: 5px;
        overflow-y: auto;
        left: 0px;

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
