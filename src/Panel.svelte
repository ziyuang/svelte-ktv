<script lang="typescript">
    import { writable, Writable, Readable } from "svelte/store";
    import { fade } from "svelte/transition";
    import {
        PanelLocation,
        gVideoElement,
        gLeftPanelVisible,
        gBottomPanelVisible,
        gHelpPanelVisible,
        gRightPanelVisible,
        gRightPanelFoldingTimerId,
        gRightPanelFoldingDisabled,
        getVisibilityTweening,
        deriveTweening,
    } from "./common";

    export let location: PanelLocation;
    export let panelWidth: number;
    export let panelHeight: number;
    export let autoHidePanel = true;

    let panelElem: HTMLElement;
    const containerMargin = 30;

    let panelTop = writable(-1);
    let panelRight = writable(-1);
    let panelBottom = writable(-1);
    let panelLeft = writable(-1);

    let containerTop: number;
    let containerRight: number;
    let containerBottom: number;
    let containerLeft: number;
    const containerWidth = panelWidth + 2 * containerMargin;
    const containerHeight = panelHeight + 2 * containerMargin;

    panelTop.subscribe((value) => {
        containerTop = value - containerMargin;
    });
    panelRight.subscribe((value) => {
        containerRight = value - containerMargin;
    });
    panelBottom.subscribe((value) => {
        containerBottom = value - containerMargin;
    });
    panelLeft.subscribe((value) => {
        containerLeft = value - containerMargin;
    });

    let panelStyle: string;
    let containerStyle: string;
    let locationTweeningStyleName: string;

    const visibility = getVisibilityTweening();
    let panelFoldingTweening: Readable<number>;

    const foldingDelay = 200;

    function blurPanel() {
        if ($gVideoElement) {
            $gVideoElement.focus();
        } else if (panelElem) {
            panelElem.blur();
        }
    }

    let timerId: number;
    let showPanel = (panelVisible: Writable<boolean>) => {
        return () => {
            panelVisible.set(true);
            window.clearTimeout(timerId);
        };
    };
    let hidePanel = (panelVisible: Writable<boolean>) => {
        return () => {
            window.clearTimeout(timerId);
            timerId = window.setTimeout(
                () => panelVisible.set(false),
                foldingDelay
            );
            blurPanel();
        };
    };

    let panelVisible: Writable<boolean>;
    let maxPanelOpacity = 0.8;

    switch (location) {
        case PanelLocation.Bottom:
            $panelBottom = 0;
            panelVisible = gBottomPanelVisible;
            panelFoldingTweening = deriveTweening(
                visibility,
                -containerHeight + containerMargin,
                containerBottom - 1
            );
            locationTweeningStyleName = "bottom";
            containerStyle = `
                left: 0px;
                right: 0px;
                width: 70%;
                min-width: ${containerWidth}px;
                height: ${containerHeight}px;
                margin-left: auto;
                margin-right: auto;
                text-align: center;`;
            panelStyle = `
                width: ${panelWidth}px;
                height: ${panelHeight}px;
                margin-top: ${containerMargin}px;
                margin-bottom: ${containerMargin}px;
                margin-left: auto;
                margin-right: auto;
                border-radius: 5px 5px 0px 0px;`;
            break;
        case PanelLocation.Left:
            $panelTop = 10;
            $panelLeft = 0;
            panelVisible = gLeftPanelVisible;
            panelFoldingTweening = deriveTweening(
                visibility,
                -containerWidth + containerMargin,
                containerLeft - 1
            );
            locationTweeningStyleName = "left";
            containerStyle = `
                top: ${containerTop}px;
                width: ${containerWidth}px;
                height: ${containerHeight}px;`;
            panelStyle = `
                top: ${$panelTop}px;
                margin: ${containerMargin}px;
                max-height: ${containerHeight}px;
                border-radius: 0px 5px 5px 0px;
                overflow-y: auto;`;
            break;
        case PanelLocation.Right:
            $panelTop = 10;
            $panelRight = 0;
            maxPanelOpacity = 0.7;
            panelVisible = gRightPanelVisible;
            panelFoldingTweening = deriveTweening(
                visibility,
                -containerWidth + containerMargin,
                containerRight - 1
            );
            showPanel = (panelVisible: Writable<boolean>) => {
                return () => {
                    gRightPanelFoldingDisabled.set(true);
                    window.clearTimeout($gRightPanelFoldingTimerId);
                    panelVisible.set(true);
                };
            };
            hidePanel = (panelVisible: Writable<boolean>) => {
                return () => {
                    window.clearTimeout($gRightPanelFoldingTimerId);
                    gRightPanelFoldingTimerId.set(
                        window.setTimeout(
                            () => panelVisible.set(false),
                            foldingDelay
                        )
                    );
                    gRightPanelFoldingDisabled.set(false);
                    blurPanel();
                };
            };
            locationTweeningStyleName = "right";
            containerStyle = `
                top: ${containerTop}px;
                right: ${containerRight}px;
                width: ${containerWidth}px;
                height: ${containerHeight}px;`;
            panelStyle = `
                right: ${$panelRight}px;
                top: ${$panelTop}px;
                margin: ${containerMargin}px;
                max-height: ${containerHeight}px;
                border-radius: 5px 0px 0px 5px;
                overflow-y: auto;`;
            break;
        case PanelLocation.Middle:
            panelVisible = gHelpPanelVisible;
            containerStyle = `
                top: 0px;
                right: 0px;
                bottom: 0px;
                left: 0px;
                width: ${containerWidth}px;
                height: ${containerHeight}px;
                margin: auto;
                pointer-events: none;`;
            panelStyle = `
                padding: ${containerMargin}px;
                border-radius: 5px;
                overflow-y: auto;
                display: table;
                background-color: FloralWhite !important;`;
            break;
    }

    const opacityTweening = deriveTweening(visibility, 0, maxPanelOpacity);
    panelVisible.subscribe((value) => visibility.set(+value));

    function noop() {}
</script>

<div
    bind:this={panelElem}
    class="panel-container"
    style={containerStyle +
        (location == PanelLocation.Middle
            ? ""
            : locationTweeningStyleName +
              ":" +
              $panelFoldingTweening +
              "px; ") +
        "opacity: " +
        $opacityTweening +
        ";"}
    on:mouseenter={autoHidePanel ? showPanel(panelVisible) : noop}
    on:mouseleave={autoHidePanel ? hidePanel(panelVisible) : noop}
    transition:fade={{ duration: 100 }}
>
    <div class="panel" style={panelStyle}>
        <slot />
    </div>
</div>

<style lang="scss">
    div.panel-container {
        position: absolute;
        background-color: transparent;
        z-index: 100;
        & div.panel {
            font-family: sans-serif;
            background-color: White;
            border: 1px solid Gray;
            &::-webkit-scrollbar {
                width: 12px;
            }
            // https://stackoverflow.com/a/42115371/688080
            &::-webkit-scrollbar-track {
                border-radius: 5px;
                box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            }
            &::-webkit-scrollbar-thumb {
                border-radius: 5px;
                box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
            }
        }
    }
</style>
