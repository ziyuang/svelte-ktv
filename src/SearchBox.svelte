<script lang="typescript">
    import { gSearchString, desktopOrMobile } from "./common";

    let searchBoxElem: HTMLInputElement;

    function blockSpecialChar(e: KeyboardEvent) {
        const blockRegex = /[- \(\)\\/\[\]!$^?.]/i;
        if (blockRegex.test(e.key)) e.preventDefault();
    }
    function updateSearchString() {
        gSearchString.set(searchBoxElem.value);
    }
</script>

<input
    bind:this={searchBoxElem}
    on:keydown={blockSpecialChar}
    on:input={updateSearchString}
    type="search"
    placeholder="搜索"
    class={$desktopOrMobile}
/>

<style lang="scss">
    input[type="search"] {
        height: 25px;
        &.desktop {
            position: fixed;
            margin-top: 15px;
            margin-left: 30px;
            width: 210px;
        }
        &.mobile {
            font-size: 15pt;
            &::placeholder {
                font-size: 15pt;
            }
            margin-top: 25px;
            margin-left: auto;
            margin-right: auto;
            width: 90%;
        }
    }
</style>
