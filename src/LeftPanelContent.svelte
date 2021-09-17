<script lang="typescript">
    import { gSearchString, desktopOrMobile, repoPromise } from "./common";
    import RepoView from "./RepoView.svelte";
    import SongView from "./SongView.svelte";
    import SearchBox from "./SearchBox.svelte";
</script>

{#await repoPromise then repo}
    <div id="simple-panel">
        <SearchBox />
        <div class={"song-container " + $desktopOrMobile}>
            <div
                style={$gSearchString.length == 0
                    ? "display:block;"
                    : "display:none;"}
            >
                <RepoView {repo} />
            </div>
            <div
                style={$gSearchString.length == 0
                    ? "display:none;"
                    : "display:block;"}
            >
                <SongView {repo} />
            </div>
        </div>
    </div>
{/await}

<style lang="scss">
    div#simple-panel {
        display: flex;
        flex-direction: column;
        max-height: 100vh;
        & div.song-container {
            flex-grow: 1;
        }
        & div.desktop {
            margin-top: 50px;
        }
        & div.mobile {
            overflow-y: auto;
        }
    }
</style>
