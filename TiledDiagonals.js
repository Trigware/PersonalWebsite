const diagonalsModulateDiv = document.getElementById("DiagonalsModulate");
const tilingDiagonalsDiv = document.getElementById("TilingDiagonals");
const gradientTransitionDuration = 0.95;
const waitDuration = 0.35;
import * as Utils from "./Utils.js";
const diagonalsSpeed = 125;
function OnDraw() {
    let timeSinceStarted = Utils.GetTimeSinceStarted();
    let timeSinceAnimationStarted = timeSinceStarted - waitDuration;
    let transitionProgress = Math.min(timeSinceAnimationStarted / gradientTransitionDuration, 1);
    let interpolatedProgress = Utils.EaseIn(transitionProgress);
    let transitionPercentage = Utils.GetPercentage(interpolatedProgress);
    let diagonalsOffset = timeSinceStarted * diagonalsSpeed;
    SetProperty(tilingDiagonalsDiv, "--diagonals-offset", diagonalsOffset.toString() + "px");
    SetProperty(diagonalsModulateDiv, "--gradient-end", transitionPercentage);
    requestAnimationFrame(OnDraw);
}
function SetProperty(element, propertyName, propertyValue) {
    element.style.setProperty(propertyName, propertyValue);
}
OnDraw();
