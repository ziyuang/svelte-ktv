<script lang="typescript">
    import { PanelLocation, gHelpPanelVisible } from "./common";
    import Panel from "./Panel.svelte";
</script>

<!-- svelte-ignore missing-declaration -->
{#if $gHelpPanelVisible}
    <Panel location={PanelLocation.Middle} panelWidth={500} panelHeight={500}>
        <div class="caption">快捷键</div>
        <img class="key-help" src="key-help.svg" alt="key shortcuts" />
    </Panel>
    <img class="arrows" src="arrows.svg" alt="key shortcuts" />
{/if}

<style lang="scss">
    div.caption {
        width: 50%;
        padding-bottom: 10px;
        margin-bottom: 20px;
        font-size: 25px;
        border-bottom: 1px solid darkgray;
    }
    img.key-help {
        width: auto;
        height: 100%;
        vertical-align: middle;
    }
    img.arrows {
        position: absolute;
        top: 65%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 70%;
    }
</style>
