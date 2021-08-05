<script lang="typescript">
    import {
        PanelLocation,
        gAudioTrack,
        gCurrentPlayingIndex,
        gPlaylist,
        showThenHideRightPanel,
    } from "./common";
    import Panel from "./Panel.svelte";

    function toggleTrack() {
        gAudioTrack.set(1 - $gAudioTrack);
    }

    function jumpToPrevious() {
        if ($gCurrentPlayingIndex > 0) {
            gCurrentPlayingIndex.set($gCurrentPlayingIndex - 1);
            showThenHideRightPanel();
        }
    }

    function jumpToNext() {
        if ($gCurrentPlayingIndex < $gPlaylist.length - 1) {
            gCurrentPlayingIndex.set($gCurrentPlayingIndex + 1);
            showThenHideRightPanel();
        }
    }
</script>

<!-- svelte-ignore missing-declaration -->
<Panel location={PanelLocation.Bottom} panelWidth={300} panelHeight={60}>
    <table>
        <tr>
            <td>
                <button
                    name="button"
                    disabled={$gCurrentPlayingIndex <= 0}
                    on:click={jumpToPrevious}>⟨ 上一首</button
                ></td
            >
            <td
                ><button name="button" on:click={toggleTrack}
                    >{$gAudioTrack == 0 ? "放伴奏" : "放原唱"}</button
                ></td
            >
            <td
                ><button
                    name="button"
                    disabled={$gCurrentPlayingIndex >= $gPlaylist.length - 1}
                    on:click={jumpToNext}>下一首 ⟩</button
                ></td
            >
        </tr>
    </table>
</Panel>

<style lang="scss">
    table {
        height: 100%;
        width: 100%;
        & td {
            & button {
                height: 30px;
                width: 70px;
            }
        }
    }
</style>
