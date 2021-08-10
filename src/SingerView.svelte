<script lang="typescript">
    import { fade, slide } from "svelte/transition";
    import {
        Singer,
        gPlaylist,
        gCurrentPlayingIndex,
        gVideoElement,
        showThenHideRightPanel,
    } from "./common";

    export let singer: Singer;
    let expanded = false;

    function toggleExpansion() {
        expanded = !expanded;
    }
</script>

<!-- svelte-ignore missing-declaration -->
<div class="singer">
    <div class="singer-name" on:click={toggleExpansion}>
        <div class="singer-name-icon">
            {#if expanded}
                <div transition:fade={{ duration: 200 }}>🎤</div>
            {/if}
        </div>
        <div class="singer-name-text">{singer.name}</div>
    </div>
    {#if expanded}
        <ul transition:slide={{ duration: 50 * singer.songs.length }}>
            {#each singer.songs as song}
                <li
                    on:click={() => {
                        gPlaylist.set([
                            ...$gPlaylist,
                            {
                                id: `${singer.name}-${song.name}`,
                                singer: singer.name,
                                song: song,
                            },
                        ]);
                        if ($gPlaylist.length == 1) {
                            gCurrentPlayingIndex.set(0);
                        } else if (
                            $gVideoElement.ended &&
                            $gCurrentPlayingIndex == $gPlaylist.length - 2
                        ) {
                            gCurrentPlayingIndex.set($gPlaylist.length - 1);
                        }
                        showThenHideRightPanel();
                    }}
                >
                    <div class="song-name">{song.name}</div>
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style lang="scss">
    div.singer-name,
    div.song-name {
        cursor: pointer;
        display: flex;
        &:hover {
            background-color: AliceBlue;
        }
    }

    div.song-name:active {
        background-color: Aqua;
    }

    div.singer {
        width: 90%;
        margin-top: 15px;
        margin-left: 10px;
        margin-bottom: 15px;
        margin-right: 10px;
        div.singer-name-icon {
            width: 30px;
        }
    }

    ul {
        margin-top: 0px;
        li {
            margin-top: 5px;
            margin-bottom: 5px;
            margin-left: 0px;
            padding-left: 5px;
            border-left: 1px solid DarkGray;
        }
    }
</style>
