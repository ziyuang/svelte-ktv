<script lang="typescript">
    import {
        gBottomPanelVisible,
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
    const bottomTweening = deriveTweening(visibility, -30, 0);
    const opacityTweening = deriveTweening(visibility, 0, 0.8);
    gBottomPanelVisible.subscribe((value) => visibility.set(+value));

    let timer = -1;

    function showPanel() {
        gBottomPanelVisible.set(true);
        if (timer >= 0) window.clearTimeout(timer);
    }
    function hidePanel() {
        if (timer >= 0) window.clearTimeout(timer);
        timer = window.setTimeout(() => gBottomPanelVisible.set(false), 150);
    }
</script>

<div
    class="panel-container"
    style="bottom:{$bottomTweening}px; opacity:{$opacityTweening}"
    on:mouseenter={showPanel}
    on:mouseleave={hidePanel}
>
    <div class="panel">
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
                        disabled={$gCurrentPlayingIndex >=
                            $gPlaylist.length - 1}
                        on:click={jumpToNext}>下一首 ⟩</button
                    ></td
                >
            </tr>
        </table>
    </div>
</div>

<style lang="scss">
    div.panel-container {
        position: absolute;
        background-color: transparent;
        left: 0px;
        right: 0px;
        bottom: 0px;
        width: 1366px;
        height: 60px;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        & div.panel {
            position: relative;
            opacity: 0.8;
            left: 0px;
            right: 0px;
            bottom: 0px;
            width: 300px;
            height: 60px;
            margin-left: auto;
            margin-right: auto;
            border-radius: 5px 5px 0px 0px;
            & table {
                height: 100%;
                width: 100%;
                & td {
                    & button {
                        height: 30px;
                        width: 70px;
                    }
                }
            }
        }
    }
</style>
