<script lang="typescript">
    import { derived } from "svelte/store";
    import {
        Singer,
        PlayListItem,
        gSearchString,
        gPlaylist,
        showThenHideRightPanel,
        desktopOrMobile,
    } from "./common";

    export let repo: Singer[];

    type SongInfo = [string, PlayListItem];
    let allSongs: SongInfo[] = [];
    for (const singer of repo) {
        for (const song of singer.songs) {
            allSongs.push([
                `${singer.name} - ${song.name}`,
                {
                    id: `${singer.name}-${song.name}`,
                    singer: singer.name,
                    song: song,
                },
            ]);
        }
    }

    const filteredSongs = derived(gSearchString, ($gSearchString) => {
        const searchRegex = new RegExp(
            $gSearchString ? $gSearchString.replace("*", ".+") : "DUMMY",
            "i"
        );
        const filtered = $gSearchString
            ? allSongs.filter((songInfo) => searchRegex.test(songInfo[0]))
            : allSongs;
        return filtered;
    });
</script>

<div>
    <ul>
        {#each $filteredSongs as songInfo (songInfo[0])}
            <li
                class={$desktopOrMobile}
                on:click={() => {
                    gPlaylist.set([
                        ...$gPlaylist,
                        {
                            id: songInfo[1].id,
                            singer: songInfo[1].singer,
                            song: songInfo[1].song,
                        },
                    ]);
                    showThenHideRightPanel();
                }}
            >
                {songInfo[0]}
            </li>
        {/each}
    </ul>
</div>

<style lang="scss">
    div {
        top: 30px;
    }
    ul {
        margin-left: -20px;
        & li {
            margin-top: 5px;
            margin-bottom: 5px;
            padding-top: 3px;
            padding-bottom: 3px;
            padding-left: 12px;
            width: 80%;
            cursor: pointer;
            &.desktop {
                &:hover {
                    background-color: AliceBlue;
                }
                &:active {
                    background-color: Aqua;
                }
            }
            &.mobile {
                font-size: 18pt;
                &:active {
                    background-color: AliceBlue;
                }
            }
        }
    }
</style>
