<script lang="typescript">
    import { Singer } from "./common";
    import SingerView from "./SingerView.svelte";

    export let repo: Singer[];

    // type Record = [string, string, string];
    // function flatten(singers: Singer[]): Record[] {
    //     let records: Record[] = [];
    //     for (const singer of repo) {
    //         for (const [songName, songPath] of singer.songs) {
    //             records.push([singer.name, songName, songPath]);
    //         }
    //     }
    //     return records;
    // }
    // const records = flatten(repo);
</script>

<div>
    {#each repo as singer}
        <SingerView {singer} />
    {/each}
</div>

