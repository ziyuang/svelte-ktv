<script lang="typescript">
    import { Singer } from "./common";
    import SingerView from "./SingerView.svelte";

    export let repo: Singer[];
</script>

<div>
    {#each repo as singer}
        <SingerView {singer} />
    {/each}
</div>

