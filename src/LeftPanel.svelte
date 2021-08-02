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
    const leftTweening = deriveTweening(visibility, -200, 0);
    const opacityTweening = deriveTweening(visibility, 0, 0.7);
    gLeftPanelVisible.subscribe((value) => visibility.set(+value));

    let timer = -1;

    function showPanel() {
        gLeftPanelVisible.set(true);
        if (timer >= 0) window.clearTimeout(timer);
    }
    function hidePanel() {
        if (timer >= 0) window.clearTimeout(timer);
        timer = window.setTimeout(() => gLeftPanelVisible.set(false), 150);
    }
</script>

<div
    class="panel"
    on:mouseenter={showPanel}
    on:mouseleave={hidePanel}
    style="left:{$leftTweening}px; opacity:{$opacityTweening}"
>
    {#await getRepo() then repo}
        <RepoView {repo} />
    {/await}
</div>

<style lang="scss">
    div.panel {
        opacity: 0.7;
        border-radius: 0px 5px 5px 0px;
        left: 0px;
        width: 230px;
        height: 92vh;
        top: 10px;
        overflow-y: auto;
    }
</style>
