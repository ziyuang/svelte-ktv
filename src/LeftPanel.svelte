<script lang="typescript">
    import { Singer, PanelLocation, gSearchString } from "./common";
    import Panel from "./Panel.svelte";
    import RepoView from "./RepoView.svelte";
    import SongView from "./SongView.svelte";

    const repoPromise: Promise<Singer[]> = (async () => {
        const res = await fetch("/videos");
        return res.json();
    })();

    let searchBoxElem: HTMLInputElement;
    function blockSpecialChar(e: KeyboardEvent) {
        const blockRegex = /[- \(\)\\/\[\]!$^?.]/i;
        if (blockRegex.test(e.key)) e.preventDefault();
    }
    function updateSearchString() {
        gSearchString.set(searchBoxElem.value);
    }
</script>

<!-- svelte-ignore missing-declaration -->
<Panel location={PanelLocation.Left} panelWidth={280} panelHeight={800}>
    {#await repoPromise then repo}
        <input
            bind:this={searchBoxElem}
            on:keydown={blockSpecialChar}
            on:input={updateSearchString}
            type="search"
            placeholder="搜索"
        />
        <div
            style={$gSearchString.length == 0
                ? "display:block;"
                : "display:none;"}
        >
            <RepoView {repo} />
        </div>
        <div
            style={$gSearchString.length == 0
                ? "display:none;"
                : "display:block;"}
        >
            <SongView {repo} />
        </div>
    {/await}
</Panel>

<style lang="scss">
    input {
        margin-top: 15px;
        margin-left: 30px;
        width: 210px;
        height: 25px;
    }
</style>
