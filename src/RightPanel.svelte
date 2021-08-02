<script lang="typescript">
    import { slide } from "svelte/transition";
    import { flip } from "svelte/animate";
    import {
        gMediaSource,
        gCurrentPlayingIndex,
        gPlaylist,
        getVisibilityTweening,
        deriveTweening,
        gRightPanelVisible,
        gRightPanelFoldingTimerId,
        gRightPanelFoldingDisabled,
    } from "./common";

    const visibility = getVisibilityTweening(0);
    const rightTweening = deriveTweening(visibility, -250, 0);
    const opacityTweening = deriveTweening(visibility, 0, 0.8);
    gRightPanelVisible.subscribe((value) => visibility.set(+value));

    function showPanel() {
        gRightPanelFoldingDisabled.set(true);
        if ($gRightPanelFoldingTimerId >= 0)
            window.clearTimeout($gRightPanelFoldingTimerId);
        gRightPanelVisible.set(true);
    }
    function hidePanel() {
        if ($gRightPanelFoldingTimerId >= 0)
            window.clearTimeout($gRightPanelFoldingTimerId);
        gRightPanelFoldingTimerId.set(
            window.setTimeout(() => gRightPanelVisible.set(false), 150)
        );
        gRightPanelFoldingDisabled.set(false);
    }
</script>

<div
    class="panel-container"
    on:mouseenter={showPanel}
    on:mouseleave={hidePanel}
    style="right:{$rightTweening}px; opacity:{$opacityTweening}"
>
    {#if $gPlaylist.length > 0}
        <div class="panel">
            <ul>
                {#each $gPlaylist as playListItem, idx (playListItem.id)}
                    <li
                        class={idx < $gCurrentPlayingIndex ? "played-item" : ""}
                        transition:slide
                        animate:flip={{ duration: (d) => 30 * Math.sqrt(d) }}
                    >
                        <div class="playlist-item">
                            <div class="playing-icon">
                                {#if $gCurrentPlayingIndex === idx}
                                    🎵
                                {/if}
                            </div>
                            <div
                                class="singer-song-name"
                                style={$gCurrentPlayingIndex === idx
                                    ? "font-weight: bold;"
                                    : ""}
                            >
                                {`${playListItem.singer} - ${playListItem.song.name}`}
                            </div>
                            <div
                                class={idx === $gCurrentPlayingIndex
                                    ? "prioritize-button-disabled"
                                    : "prioritize-button"}
                                title={idx < $gCurrentPlayingIndex
                                    ? "再唱"
                                    : idx > $gCurrentPlayingIndex
                                    ? "优先"
                                    : ""}
                                on:click|stopPropagation={() => {
                                    if (idx < $gCurrentPlayingIndex) {
                                        gPlaylist.set([
                                            ...$gPlaylist.slice(0, idx),
                                            ...$gPlaylist.slice(
                                                idx + 1,
                                                $gCurrentPlayingIndex + 1
                                            ),
                                            $gPlaylist[idx],
                                            ...$gPlaylist.slice(
                                                $gCurrentPlayingIndex + 1
                                            ),
                                        ]);
                                        gCurrentPlayingIndex.set(
                                            $gCurrentPlayingIndex - 1
                                        );
                                    } else if (idx > $gCurrentPlayingIndex) {
                                        gPlaylist.set([
                                            ...$gPlaylist.slice(
                                                0,
                                                $gCurrentPlayingIndex + 1
                                            ),
                                            $gPlaylist[idx],
                                            ...$gPlaylist.slice(
                                                $gCurrentPlayingIndex + 1,
                                                idx
                                            ),
                                            ...$gPlaylist.slice(idx + 1),
                                        ]);
                                    }
                                }}
                            >
                                <span>
                                    {#if idx < $gCurrentPlayingIndex}
                                        ↺
                                    {:else if idx > $gCurrentPlayingIndex}
                                        ↑
                                    {/if}
                                </span>
                            </div>
                            <div
                                class="delete-button"
                                title="删除"
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
                                            $gPlaylist[$gCurrentPlayingIndex]
                                                .song.source
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
    {/if}
</div>

<style lang="scss">
    div.panel-container {
        background-color: transparent;
        position: absolute;
        width: 330px;
        height: 92vh;
        top: 10px;
        right: 0px;
        & div.panel {
            opacity: 0.8;
            border-radius: 5px 0px 0px 5px;
            max-height: 92vh;
            overflow-y: auto;
            & ul {
                padding-left: 15px;
                padding-right: 15px;
                & li {
                    list-style-type: none;
                    margin-top: 5px;
                    margin-bottom: 5px;
                    &:hover {
                        background-color: AliceBlue;
                    }
                    &.played-item {
                        color: darkgray;
                    }
                    & div.playlist-item {
                        display: flex;
                        & div.singer-song-name {
                            width: 225px;
                            cursor: default;
                        }
                        & div.playing-icon {
                            width: 30px;
                        }
                        & div.prioritize-button,
                        & div.prioritize-button-disabled,
                        & div.delete-button {
                            cursor: pointer;
                            border-radius: 5px;
                            width: 20px;
                            text-align: center;
                            color: white;
                            &:hover {
                                font-weight: bold;
                            }
                            & span {
                                display: inline-block;
                            }
                        }
                        & div.delete-button {
                            font-size: 6pt;
                            & span {
                                margin-top: 5px;
                            }
                            background-color: salmon;
                            &:hover {
                                background-color: red;
                            }
                        }
                        & div.prioritize-button {
                            font-size: 12pt;
                            & span {
                                margin-top: -1px;
                            }
                            background-color: lightgreen;
                            &:hover {
                                background-color: green;
                            }
                        }
                        & div.prioritize-button-disabled {
                            pointer-events: none;
                        }
                        & div.prioritize-button,
                        & div.prioritize-button-disabled {
                            margin-right: 5px;
                        }
                    }
                }
            }
        }
    }
</style>
