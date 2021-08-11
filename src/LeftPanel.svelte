<script lang="typescript">
    import { PanelLocation } from "./common";
    import Panel from "./Panel.svelte";
    import LeftPanelContent from "./LeftPanelContent.svelte";
</script>

<Panel location={PanelLocation.Left} panelWidth={280} panelHeight={800}>
    <LeftPanelContent />
</Panel>
