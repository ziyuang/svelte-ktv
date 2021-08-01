<script lang="typescript">
    import {
        Singer,
        getVisibilityTweening,
        deriveTweening,
        gLeftPanelVisible,
    } from "./common";
    import RepoView from "./RepoView.svelte";

    async function getRepo(): Promise<Singer[]> {
        const res = await fetch("/videos");
        return res.json();
    }

    const visibility = getVisibilityTweening();
    const leftTweening = deriveTweening(visibility, -170, 0);
    const opacityTweening = deriveTweening(visibility, 0, 0.7);
    gLeftPanelVisible.subscribe((value) => visibility.set(+value));
</script>

<div
    class="panel"
    on:mouseenter={() => gLeftPanelVisible.set(true)}
    on:mouseleave={() => gLeftPanelVisible.set(false)}
    style="left:{$leftTweening}px; opacity:{$opacityTweening}"
>
    {#await getRepo() then repo}
        <RepoView {repo} />
    {/await}
</div>

<style lang="scss">
    div.panel {
        border-radius: 0px 5px 5px 0px;
        width: 200px;
        height: 92vh;
        top: 5px;
        overflow-y: auto;
        left: 0px;
    }
</style>
