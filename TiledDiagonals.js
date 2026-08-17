const tilingDiagonalsDiv = document.getElementById("TilingDiagonals");
const gradientTransitionDuration = 0.95;
const waitDuration = 0.35;
import * as Utils from "./Utils.js";
const diagonalsSpeed = 125;
const headerDiagonalsColor = "#ab6339";
const descriptionDiagonalsColor = "#3a894e";
function OnDraw() {
    ProgressDiagonals(tilingDiagonalsDiv, headerDiagonalsColor);
    requestAnimationFrame(OnDraw);
}
function ProgressDiagonals(tilingDiagonals, color) {
    let transitionProgress = Utils.GetAnimationProgress(waitDuration, gradientTransitionDuration);
    let interpolatedProgress = Utils.EaseIn(transitionProgress);
    let transitionPercentage = Utils.GetPercentage(interpolatedProgress);
    let timeSinceStarted = Utils.GetTimeSinceStarted();
    let diagonalsOffset = timeSinceStarted * diagonalsSpeed;
    let diagonalsModulate = tilingDiagonals.children[0];
    SetProperty(tilingDiagonals, "--diagonals-offset", diagonalsOffset.toString() + "px");
    SetProperty(diagonalsModulate, "--modulate-color", color);
    SetProperty(diagonalsModulate, "--gradient-end", transitionPercentage);
}
function SetProperty(element, propertyName, propertyValue) {
    element.style.setProperty(propertyName, propertyValue);
}
OnDraw();
