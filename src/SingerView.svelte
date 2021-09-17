<script lang="typescript">
    import { fade, slide } from "svelte/transition";
    import {
        Singer,
        gPlaylist,
        showThenHideRightPanel,
        isMobile,
        desktopOrMobile,
        socket,
    } from "./common";

    export let singer: Singer;

    let expanded = false;
    function toggleExpansion() {
        expanded = !expanded;
    }
</script>

<!-- svelte-ignore missing-declaration -->
<div class={$desktopOrMobile}>
    <div class="singer-name" on:click={toggleExpansion}>
        <div class="singer-name-icon">
            {#if expanded}
                <div transition:fade={{ duration: 200 }}>🎤</div>
            {/if}
        </div>
        <div class="singer-name-text">{singer.name}</div>
    </div>
    {#if expanded}
        <ul
            transition:slide={{ duration: 50 * singer.songs.length }}
            class={$desktopOrMobile}
        >
            {#each singer.songs as song}
                <li
                    class={$desktopOrMobile}
                    on:click={() => {
                        const selectedItem = {
                            id: `${singer.name}-${song.name}`,
                            singer: singer.name,
                            song: song,
                        };
                        if (isMobile) {
                            if (socket.readyState == 1) {
                                socket.send(JSON.stringify(selectedItem));
                            }
                        } else {
                            gPlaylist.set([...$gPlaylist, selectedItem]);
                            showThenHideRightPanel();
                        }
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
        user-select: none;
    }

    div.singer-name {
        margin-top: 15px;
        // margin-bottom: 15px;
    }

    div.desktop {
        margin-left: 10px;
        margin-right: 10px;
        & div.singer-name {
            width: 90%;
            &:hover {
                background-color: AliceBlue;
            }
            & div.singer-name-icon {
                width: 30px;
            }
            & div.song-name:active {
                background-color: Aqua;
            }
        }
    }
    div.mobile {
        & div.singer-name {
            font-size: 25pt;
            width: 75%;
            margin-left: auto;
            margin-right: auto;
            & div.singer-name-icon {
                display: none;
            }
            & div.song-name:active {
                background-color: AliceBlue;
            }
        }
    }

    ul {
        margin-top: 10px;
        &.mobile {
            padding-left: 20px;
        }
        & li {
            margin-top: 5px;
            margin-bottom: 5px;
        }
        & li.desktop {
            margin-left: 0px;
            padding-left: 5px;
            border-left: 1px solid DarkGray;
        }
        & li.mobile {
            width: 75%;
            margin-left: auto;
            margin-right: auto;
            & div.song-name {
                font-size: 18pt;
                color: DimGray;
            }
        }
    }
</style>
