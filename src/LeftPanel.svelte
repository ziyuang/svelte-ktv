<script lang="typescript">
    import { Singer, PanelLocation } from "./common";
    import Panel from "./Panel.svelte";
    import RepoView from "./RepoView.svelte";

    async function getRepo(): Promise<Singer[]> {
        const res = await fetch("/videos");
        return res.json();
    }
</script>

<!-- svelte-ignore missing-declaration -->
<Panel location={PanelLocation.Left} panelWidth={280} panelHeight={800}>
    {#await getRepo() then repo}
        <RepoView {repo} />
    {/await}
</Panel>
