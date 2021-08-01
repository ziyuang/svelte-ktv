<script lang="typescript">
    // import DragDropList from "svelte-dragdroplist";
    import { fade } from "svelte/transition";
    import {
        gMediaSource,
        gCurrentPlayingIndex,
        gPlaylist,
        getVisibilityTweening,
        deriveTweening,
        gRightPanelVisible,
        gRightPanelFoldingTimerIds,
    } from "./common";

    const visibility = getVisibilityTweening(0);
    const rightTweening = deriveTweening(visibility, -250, 0);
    const opacityTweening = deriveTweening(visibility, 0, 0.7);
    gRightPanelVisible.subscribe((value) => visibility.set(+value));

    function showPanel() {
        gRightPanelVisible.set(true);
        for (const timer of $gRightPanelFoldingTimerIds)
            window.clearTimeout(timer);
    }

    function hidePanel() {
        gRightPanelVisible.set(false);
    }
</script>

<div
    class="panel"
    on:mouseenter={showPanel}
    on:mouseleave={hidePanel}
    style="right:{$rightTweening}px; opacity:{$opacityTweening}"
>
    <ul>
        {#each $gPlaylist as singerAndSong, idx}
            <li
                transition:fade={{ duration: 200 }}
                on:click={() => {
                    // const newSource = singerAndSong[1][1];
                    if (idx < $gCurrentPlayingIndex) {
                        // gCurrentPlayingIndex.set(idx);
                        gPlaylist.set([
                            ...$gPlaylist.slice(0, idx),
                            ...$gPlaylist.slice(
                                idx + 1,
                                $gCurrentPlayingIndex + 1
                            ),
                            $gPlaylist[idx],
                            ...$gPlaylist.slice($gCurrentPlayingIndex + 1),
                        ]);
                    } else if (idx > $gCurrentPlayingIndex) {
                        gPlaylist.set([
                            ...$gPlaylist.slice(0, $gCurrentPlayingIndex + 1),
                            $gPlaylist[idx],
                            ...$gPlaylist.slice($gCurrentPlayingIndex + 1, idx),
                            ...$gPlaylist.slice(idx + 1),
                        ]);
                    }
                }}
                class={idx < $gCurrentPlayingIndex ? "played" : ""}
            >
                <div class="playlist-song">
                    <div class="playing-icon">
                        {#if $gCurrentPlayingIndex === idx}
                            🎵
                        {/if}
                    </div>
                    <div class="singer-song-name">
                        {singerAndSong[0] + " - " + singerAndSong[1][0]}
                    </div>
                    <div
                        class="delete-icon"
                        on:click|stopPropagation={() => {
                            gPlaylist.set([
                                ...$gPlaylist.slice(0, idx),
                                ...$gPlaylist.slice(idx + 1),
                            ]);
                            if (idx < $gCurrentPlayingIndex) {
                                gCurrentPlayingIndex.set(
                                    $gCurrentPlayingIndex - 1
                                );
                            } else if (idx == $gCurrentPlayingIndex) {
                                gMediaSource.set(
                                    $gPlaylist[$gCurrentPlayingIndex][1][1]
                                );
                            }
                        }}
                    >
                        ╳
                    </div>
                </div>
            </li>
        {/each}
    </ul>
</div>

<style lang="scss">
    div.panel {
        border-radius: 5px 0px 0px 5px;
        width: 280px;
        height: 92vh;
        top: 5px;
        overflow-y: auto;
        right: 0px;
        & ul {
            padding-left: 15px;
            & li {
                cursor: pointer;
                list-style-type: none;
                margin-top: 5px;
                margin-bottom: 5px;
                &:hover {
                    background-color: AliceBlue;
                }
                &:active {
                    background-color: Aqua;
                }
                &.played {
                    color: darkgray;
                }
                & div.playlist-song {
                    display: flex;
                    & div.singer-song-name {
                        width: 200px;
                    }
                    & div.playing-icon,
                    & div.delete-icon {
                        width: 30px;
                    }
                    & div.delete-icon {
                        font-size: 8pt;
                        &:hover {
                            font-weight: bold;
                        }
                    }
                }
            }
        }
    }
</style>
