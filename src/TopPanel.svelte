<script lang="typescript">
    import {
        gTopPanelVisible,
        getVisibilityTweening,
        deriveTweening,
        gAudioTrack,
        gCurrentPlayingIndex,
        gPlaylist,
    } from "./common";

    function toggleTrack() {
        gAudioTrack.set(1 - $gAudioTrack);
    }

    const visibility = getVisibilityTweening(0);
    const topTweening = deriveTweening(visibility, -20, 0);
    const opacityTweening = deriveTweening(visibility, 0, 0.7);
    gTopPanelVisible.subscribe((value) => visibility.set(+value));
</script>

<div
    class="panel"
    on:mouseenter={() => gTopPanelVisible.set(true)}
    on:mouseleave={() => gTopPanelVisible.set(false)}
    style="top:{$topTweening}px; opacity:{$opacityTweening}"
>
    <table>
        <tr>
            <td>
                <button
                    name="button"
                    disabled={$gCurrentPlayingIndex <= 0}
                    on:click={() => {
                        gCurrentPlayingIndex.set(
                            Math.max($gCurrentPlayingIndex - 1, 0)
                        );
                    }}>⟨</button
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
                    on:click={() => {
                        gCurrentPlayingIndex.set(
                            Math.min(
                                $gCurrentPlayingIndex + 1,
                                $gPlaylist.length - 1
                            )
                        );
                    }}>⟩</button
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
                }
                &:nth-child(1) button,
                &:nth-child(3) button {
                    width: 50px;
                }
                &:nth-child(2) button {
                    width: 70px;
                }
            }
        }
    }
</style>
