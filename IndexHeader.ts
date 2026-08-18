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

function OnDraw() {
    let timeSinceStarted: number = Utils.GetTimeSinceStarted();
    let animationProgress: number = Math.min(timeSinceStarted / headerAnimationDuration, 1);
    let interpolatedProgress: number = Utils.EaseInOut(animationProgress, 3);

    let sinceLastColorChangeStarted: number = timeSinceStarted % headerColorChangeDuration;
    let colorChangeProgress: number = sinceLastColorChangeStarted / headerColorChangeDuration;
    let usedColorChangeProgress: number = colorChangeProgress < progressCenter ? colorChangeProgress*2 : (1 - colorChangeProgress) * 2;
    let footerLightness: number = Utils.Lerp(headerLightnessMax, headerLightnessMin, usedColorChangeProgress);
    const footerColor = `hsl(225, 50%, ${footerLightness}%)`;
    let optionsOpacity = Utils.clamp((timeSinceStarted - headerAnimationDuration) / optionsShowDuration, 0, 1);

    canvasContext.fillStyle = footerColor;
    canvasContext.fillRect(0, 0, canvas.width, canvas.height * interpolatedProgress);
    headerOptions.style.opacity = optionsOpacity.toString();
    requestAnimationFrame(OnDraw);
}

OnDraw();