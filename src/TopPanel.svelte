<script lang="typescript">
    import {
        getDefaultVisibilityTweening,
        createTweening,
        gblTrack,
    } from "./common";

    function toggleTrack() {
        gblTrack.set(1 - $gblTrack);
    }

    const visibility = getDefaultVisibilityTweening(0);
    const topTweening = createTweening(visibility, -30, 0);
    const opacityTweening = createTweening(visibility, 0, 0.8);
</script>

<div
    class="panel"
    on:mouseenter={() => visibility.set(1)}
    on:mouseleave={() => visibility.set(0)}
    style="top:{$topTweening}px; opacity:{$opacityTweening}"
>
    <table>
        <tr>
            <td> <button name="button">⟨</button></td>
            <td
                ><button name="button" on:click={toggleTrack}
                    >{$gblTrack == 0 ? "到伴奏" : "到原唱"}</button
                ></td
            >
            <td><button name="button">⟩</button></td>
        </tr>
    </table>
</div>

<style lang="scss">
    div.panel {
        border-radius: 0px 0px 5px 5px;
        left: 0px;
        right: 0px;
        top: 0px;
        width: 300px;
        height: 50px;
        margin-left: auto;
        margin-right: auto;
        & table {
            height: 100%;
            width: 100%;
            & td {
                text-align: center;
                & button {
                    height: 30px;
                }
                &:nth-child(1) button,
                &:nth-child(3) button {
                    width: 50px;
                }
                &:nth-child(2) button {
                    width: 70px;
                }
            }
        }
    }
</style>
