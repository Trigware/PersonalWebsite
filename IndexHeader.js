const canvas = document.getElementById("HeaderCanvas");
const headerOptions = document.getElementById("HeaderOptions");
const canvasContext = canvas.getContext("2d");
import * as Utils from "./Utils.js";
const headerAnimationDuration = 0.75;
const headerColorChangeDuration = 4.5;
const optionsShowDuration = 0.65;
const headerLightnessMax = 50;
const headerLightnessMin = 25;
const progressCenter = 0.5;
function OnDraw() {
    let timeSinceStarted = Utils.GetTimeSinceStarted();
    let animationProgress = Math.min(timeSinceStarted / headerAnimationDuration, 1);
    let interpolatedProgress = Utils.EaseInOut(animationProgress, 3);
    let sinceLastColorChangeStarted = timeSinceStarted % headerColorChangeDuration;
    let colorChangeProgress = sinceLastColorChangeStarted / headerColorChangeDuration;
    let usedColorChangeProgress = colorChangeProgress < progressCenter ? colorChangeProgress * 2 : (1 - colorChangeProgress) * 2;
    let footerLightness = Utils.Lerp(headerLightnessMax, headerLightnessMin, usedColorChangeProgress);
    const footerColor = `hsl(225, 50%, ${footerLightness}%)`;
    let optionsOpacity = Utils.clamp((timeSinceStarted - headerAnimationDuration) / optionsShowDuration, 0, 1);
    canvasContext.fillStyle = footerColor;
    canvasContext.fillRect(0, 0, canvas.width, canvas.height * interpolatedProgress);
    headerOptions.style.opacity = optionsOpacity.toString();
    requestAnimationFrame(OnDraw);
}
OnDraw();
