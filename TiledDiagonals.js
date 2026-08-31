const tilingDiagonalsDiv = document.getElementById("TilingDiagonals");
const gradientTransitionDuration = 0.95;
const waitDuration = 0.35;
import * as Utils from "./Utils.js";
const diagonalsSpeed = 125;
const headerDiagonalsColor = "#ab6339";
function OnDraw() {
    ProgressDiagonals(tilingDiagonalsDiv, headerDiagonalsColor);
    HandleIntroductoryTextResizing();
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
const defaultSizeIntroductionWidth = 700;
const minimumIntroductionSize = 0.35;
function HandleIntroductoryTextResizing() {
    let diagonalsBoundsRect = tilingDiagonalsDiv.getBoundingClientRect();
    let intendedScreenWidth = diagonalsBoundsRect.width;
    let introductionSize = Utils.Clamp(intendedScreenWidth / defaultSizeIntroductionWidth, minimumIntroductionSize, 1);
    document.documentElement.style.setProperty("--introduction-text-size", introductionSize.toString());
}
OnDraw();
