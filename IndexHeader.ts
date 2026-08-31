const canvas = document.getElementById("HeaderCanvas") as HTMLCanvasElement;
const headerOptions = document.getElementById("HeaderOptions") as HTMLDivElement;
const canvasContext = canvas.getContext("2d")!;

import * as Utils from "./Utils.js";

const headerAnimationDuration: number = 0.75;
const headerColorChangeDuration: number = 4.5;
const optionsShowDuration: number = 0.65;

const headerLightnessMax: number = 50;
const headerLightnessMin: number = 25;
const progressCenter: number = 0.5;

const sectionLinkDefaultViewportWidth: number = 650;
const minimumSectionLinkSize = 0.35;

function OnDraw() {
    let timeSinceStarted: number = Utils.GetTimeSinceStarted();
    let animationProgress: number = Math.min(timeSinceStarted / headerAnimationDuration, 1);
    let interpolatedProgress: number = Utils.EaseInOut(animationProgress, 3);

    let sinceLastColorChangeStarted: number = timeSinceStarted % headerColorChangeDuration;
    let colorChangeProgress: number = sinceLastColorChangeStarted / headerColorChangeDuration;
    let usedColorChangeProgress: number = colorChangeProgress < progressCenter ? colorChangeProgress*2 : (1 - colorChangeProgress) * 2;
    let footerLightness: number = Utils.Lerp(headerLightnessMax, headerLightnessMin, usedColorChangeProgress);
    const footerColor: string = `hsl(225, 50%, ${footerLightness}%)`;
    let optionsOpacity: number = Utils.Clamp((timeSinceStarted - headerAnimationDuration) / optionsShowDuration, 0, 1);

    let comparedWidth: number = headerOptions.clientWidth;
    let sectionLinkSize: number = comparedWidth / sectionLinkDefaultViewportWidth;
    let sectionLinkSizeUsed: string = Utils.Clamp(sectionLinkSize, minimumSectionLinkSize, 1).toString();
    document.documentElement.style.setProperty("--section-link-size", sectionLinkSizeUsed.toString());

    canvasContext.fillStyle = footerColor;
    canvasContext.fillRect(0, 0, canvas.width, canvas.height * interpolatedProgress);
    headerOptions.style.opacity = optionsOpacity.toString();
    requestAnimationFrame(OnDraw);
}

OnDraw();