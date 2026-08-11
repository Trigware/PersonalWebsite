const canvas = document.getElementById("FooterCanvas") as HTMLCanvasElement;
const footerOptions = document.getElementById("FooterOptions") as HTMLDivElement;
const canvasContext = canvas.getContext("2d")!;

import * as Utils from "./Utils.js";

const footerAnimationDuration: number = 0.75;
const footerColorChangeDuration: number = 4.5;
const optionsShowDuration: number = 0.65;

const footerLightnessMax: number = 50;
const footerLightnessMin: number = 25;
const progressCenter: number = 0.5;

function OnDraw() {
    let timeSinceStarted: number = Utils.GetTimeSinceStarted();
    let animationProgress: number = Math.min(timeSinceStarted / footerAnimationDuration, 1);
    let interpolatedProgress: number = Utils.EaseInOut(animationProgress, 3);

    let sinceLastColorChangeStarted: number = timeSinceStarted % footerColorChangeDuration;
    let colorChangeProgress: number = sinceLastColorChangeStarted / footerColorChangeDuration;
    let usedColorChangeProgress: number = colorChangeProgress < progressCenter ? colorChangeProgress*2 : (1 - colorChangeProgress) * 2;
    let footerLightness: number = Utils.Lerp(footerLightnessMax, footerLightnessMin, usedColorChangeProgress);
    const footerColor = `hsl(225, 50%, ${footerLightness}%)`;
    let optionsOpacity = Utils.clamp((timeSinceStarted - footerAnimationDuration) / optionsShowDuration, 0, 1);

    canvasContext.fillStyle = footerColor;
    canvasContext.fillRect(0, 0, canvas.width, canvas.height * interpolatedProgress);
    footerOptions.style.opacity = optionsOpacity.toString();
    requestAnimationFrame(OnDraw);
}

OnDraw();