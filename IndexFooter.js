const canvas = document.getElementById("FooterCanvas");
const footerOptions = document.getElementById("FooterOptions");
const canvasContext = canvas.getContext("2d");
import * as Utils from "./Utils.js";
const footerAnimationDuration = 0.75;
const footerColorChangeDuration = 4.5;
const optionsShowDuration = 0.65;
const footerLightnessMax = 50;
const footerLightnessMin = 25;
const progressCenter = 0.5;
function OnDraw() {
    let timeSinceStarted = Utils.GetTimeSinceStarted();
    let animationProgress = Math.min(timeSinceStarted / footerAnimationDuration, 1);
    let interpolatedProgress = Utils.EaseInOut(animationProgress, 3);
    let sinceLastColorChangeStarted = timeSinceStarted % footerColorChangeDuration;
    let colorChangeProgress = sinceLastColorChangeStarted / footerColorChangeDuration;
    let usedColorChangeProgress = colorChangeProgress < progressCenter ? colorChangeProgress * 2 : (1 - colorChangeProgress) * 2;
    let footerLightness = Utils.Lerp(footerLightnessMax, footerLightnessMin, usedColorChangeProgress);
    const footerColor = `hsl(225, 50%, ${footerLightness}%)`;
    let optionsOpacity = Utils.clamp((timeSinceStarted - footerAnimationDuration) / optionsShowDuration, 0, 1);
    canvasContext.fillStyle = footerColor;
    canvasContext.fillRect(0, 0, canvas.width, canvas.height * interpolatedProgress);
    footerOptions.style.opacity = optionsOpacity.toString();
    requestAnimationFrame(OnDraw);
}
OnDraw();
