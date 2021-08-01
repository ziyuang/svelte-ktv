<script lang="typescript">
    // import DragDropList from "svelte-dragdroplist";
    import { fade, slide } from "svelte/transition";
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
        {#each $gPlaylist as playListItem, idx}
            <li
                in:slide={{ duration: 200 }}
                out:fade={{ duration: 200 }}
                on:click={() => {
                    if (idx < $gCurrentPlayingIndex) {
                        gPlaylist.set([
                            ...$gPlaylist.slice(0, idx),
                            ...$gPlaylist.slice(
                                idx + 1,
                                $gCurrentPlayingIndex + 1
                            ),
                            $gPlaylist[idx],
                            ...$gPlaylist.slice($gCurrentPlayingIndex + 1),
                        ]);
                        gMediaSource.set(
                            $gPlaylist[$gCurrentPlayingIndex].song.source
                        );
                    } else if (idx > $gCurrentPlayingIndex) {
                        gPlaylist.set([
                            ...$gPlaylist.slice(0, $gCurrentPlayingIndex + 1),
                            $gPlaylist[idx],
                            ...$gPlaylist.slice($gCurrentPlayingIndex + 1, idx),
                            ...$gPlaylist.slice(idx + 1),
                        ]);
                        gCurrentPlayingIndex.set($gCurrentPlayingIndex + 1);
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
                        {playListItem.singer + " - " + playListItem.song.name}
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
                                    $gPlaylist[$gCurrentPlayingIndex].song
                                        .source
                                );
                            }
                        }}
                    >
                        <span>╳</span>
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
        max-height: 92vh;
        top: 5px;
        overflow-y: auto;
        right: 0px;
        & ul {
            padding-left: 15px;
            padding-right: 15px;
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
                    & div.playing-icon {
                        width: 30px;
                    }
                    & div.delete-icon {
                        border-radius: 5px;
                        width: 20px;
                        font-size: 6pt;
                        text-align: center;
                        &:hover {
                            font-weight: bold;
                            color: white;
                            background-color: lightsalmon;
                        }
                        & span {
                            display: inline-block;
                            margin-top: 5px;
                        }
                    }
                }
            }
        }
    }
</style>
