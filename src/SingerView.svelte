<script lang="typescript">
    // import "bootstrap";
    // import "bootstrap/dist/css/bootstrap.min.css";
    // import "bootstrap/dist/css/bootstrap.min.css.map";
    import { fade, slide } from "svelte/transition";
    import { Singer, videoSource } from "./common";

    export let singer: Singer;
    let expanded = false;

    function toggle() {
        expanded = !expanded;
    }
</script>

<div class="singer">
    <div class="singer-name" on:click={toggle}>
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
                <li on:click={() => videoSource.set(song[1])}>
                    <div class="song-name">{song[0]}</div>
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
        list-style-type: none;
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
