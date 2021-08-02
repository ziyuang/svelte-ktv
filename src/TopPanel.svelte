<script lang="typescript">
    import {
        gTopPanelVisible,
        getVisibilityTweening,
        deriveTweening,
        gAudioTrack,
        gCurrentPlayingIndex,
        gPlaylist,
        showThenHideRightPanel,
    } from "./common";

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

    const visibility = getVisibilityTweening(0);
    const topTweening = deriveTweening(visibility, -20, 0);
    const opacityTweening = deriveTweening(visibility, 0, 0.7);
    gTopPanelVisible.subscribe((value) => visibility.set(+value));

    let timer = -1;

    function showPanel() {
        gTopPanelVisible.set(true);
        if (timer >= 0) window.clearTimeout(timer);
    }
    function hidePanel() {
        if (timer >= 0) window.clearTimeout(timer);
        timer = window.setTimeout(() => gTopPanelVisible.set(false), 100);
    }
</script>

<div
    class="panel"
    on:mouseenter={showPanel}
    on:mouseleave={hidePanel}
    style="top:{$topTweening}px; opacity:{$opacityTweening}"
>
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
</div>

<style lang="scss">
    div.panel {
        border-radius: 0px 0px 5px 5px;
        left: 0px;
        right: 0px;
        top: 0px;
        width: 300px;
        height: 50px;
        margin-left: auto;
        margin-right: auto;
        & table {
            height: 100%;
            width: 100%;
            & td {
                text-align: center;
                & button {
                    height: 30px;
                    width: 70px;
                }
            }
        }
    }
</style>
