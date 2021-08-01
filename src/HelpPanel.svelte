<script lang="typescript">
    import { fade } from "svelte/transition";
    import { gHelpPanelVisible } from "./common";
</script>

{#if $gHelpPanelVisible}
    <div class="panel" transition:fade={{ duration: 100 }}>
        <div class="caption">快捷键</div>
        <img src="key-help.svg" alt="key shortcuts" />
    </div>
{/if}

<style lang="scss">
    div.panel {
        background-color: floralwhite;
        border-radius: 5px;
        border: 1px solid darkgray;
        padding: 10px;
        width: 500px;
        height: 300px;
        margin: auto;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        display: table;
        & div.caption {
            width: 50%;
            padding-bottom: 10px;
            margin-bottom: 20px;
            font-size: 25px;
            border-bottom: 1px solid darkgray;
        }
        & img {
            width: 100%;
            height: auto;
            vertical-align: middle;
        }
    }
</style>
