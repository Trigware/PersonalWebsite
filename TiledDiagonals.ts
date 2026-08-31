const tilingDiagonalsDiv = document.getElementById("TilingDiagonals") as HTMLDivElement;

const gradientTransitionDuration: number = 0.95;
const waitDuration: number = 0.35;

import * as Utils from "./Utils.js"

const diagonalsSpeed: number = 125;
const headerDiagonalsColor: string = "#ab6339";

function OnDraw() {
    ProgressDiagonals(tilingDiagonalsDiv, headerDiagonalsColor);
    HandleIntroductoryTextResizing();
    requestAnimationFrame(OnDraw);
}

function ProgressDiagonals(tilingDiagonals: HTMLDivElement, color: string) {
    let transitionProgress: number = Utils.GetAnimationProgress(waitDuration, gradientTransitionDuration);
    let interpolatedProgress: number = Utils.EaseIn(transitionProgress);
    let transitionPercentage: string = Utils.GetPercentage(interpolatedProgress);

    let timeSinceStarted: number = Utils.GetTimeSinceStarted();
    let diagonalsOffset: number = timeSinceStarted * diagonalsSpeed;
    let diagonalsModulate: HTMLElement = tilingDiagonals.children[0] as HTMLElement;

    SetProperty(tilingDiagonals, "--diagonals-offset", diagonalsOffset.toString() + "px");
    SetProperty(diagonalsModulate, "--modulate-color", color);
    SetProperty(diagonalsModulate, "--gradient-end", transitionPercentage);
}

function SetProperty(element: HTMLElement, propertyName: string, propertyValue: string) {
    element.style.setProperty(propertyName, propertyValue);
}

const defaultSizeIntroductionWidth: number = 700;
const minimumIntroductionSize: number = 0.35;

function HandleIntroductoryTextResizing() {
    let diagonalsBoundsRect: DOMRect = tilingDiagonalsDiv.getBoundingClientRect();
    let intendedScreenWidth: number = diagonalsBoundsRect.width;
    let introductionSize: number = Utils.Clamp(intendedScreenWidth / defaultSizeIntroductionWidth, minimumIntroductionSize, 1);
    document.documentElement.style.setProperty("--introduction-text-size", introductionSize.toString());
}

OnDraw();