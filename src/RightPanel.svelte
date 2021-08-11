<script lang="typescript">
    import { slide } from "svelte/transition";
    import { flip } from "svelte/animate";
    import {
        PanelLocation,
        gMediaSource,
        gCurrentPlayingIndex,
        gPlaylist,
    } from "./common";
    import Panel from "./Panel.svelte";
    const panelWidth = 360;
</script>

<!-- svelte-ignore missing-declaration -->
{#if $gPlaylist.length > 0}
    <Panel location={PanelLocation.Right} {panelWidth} panelHeight={800}>
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
                            style={($gCurrentPlayingIndex === idx
                                ? "font-weight: bold;"
                                : "") +
                                "width: " +
                                (panelWidth - 105) +
                                "px;"}
                        >
                            {`${playListItem.singer} - ${playListItem.song.name}`}
                        </div>
                        <div
                            class={idx < $gCurrentPlayingIndex
                                ? "again-button"
                                : idx === $gCurrentPlayingIndex
                                ? "no-button"
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
    </Panel>
{/if}

<style lang="scss">
    ul {
        padding-left: 15px;
        padding-right: 10px;
        & li {
            margin-top: 5px;
            margin-bottom: 5px;
            &:hover {
                background-color: AliceBlue;
            }
            &.played-item {
                color: DarkGray;
            }
            & div.playlist-item {
                display: flex;
                & div.singer-song-name {
                    cursor: default;
                }
                & div.playing-icon {
                    width: 30px;
                }
                & div.again-button,
                & div.no-button,
                & div.prioritize-button,
                & div.delete-button {
                    cursor: pointer;
                    margin-right: 5px;
                    border-radius: 5px;
                    width: 20px;
                    text-align: center;
                    color: White;
                    &:hover {
                        font-weight: bold;
                    }
                    & span {
                        display: inline-block;
                    }
                }
                & div.prioritize-button,
                & div.again-button {
                    font-size: 12pt;
                    background-color: LightGreen;
                    &:hover {
                        background-color: Green;
                    }
                }
                & div.priority-button span {
                    margin-top: -1px;
                }
                & div.again-button span {
                    margin-top: 1px;
                }
                & div.delete-button {
                    font-size: 6pt;
                    & span {
                        margin-top: 5px;
                    }
                    background-color: Salmon;
                    &:hover {
                        background-color: Red;
                    }
                }
                & div.no-button {
                    pointer-events: none;
                }
            }
        }
    }
</style>
