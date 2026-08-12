const diagonalsModulateDiv = document.getElementById("DiagonalsModulate") as HTMLDivElement;
const tilingDiagonalsDiv = document.getElementById("TilingDiagonals") as HTMLDivElement;

const gradientTransitionDuration: number = 0.95;
const waitDuration: number = 0.35;

import * as Utils from "./Utils.js"

const diagonalsSpeed: number = 125;

function OnDraw() {
    let timeSinceStarted: number = Utils.GetTimeSinceStarted();
    let timeSinceAnimationStarted: number = timeSinceStarted - waitDuration;
    let transitionProgress: number = Math.min(timeSinceAnimationStarted / gradientTransitionDuration, 1);
    let interpolatedProgress: number = Utils.EaseIn(transitionProgress);
    let transitionPercentage: string = Utils.GetPercentage(interpolatedProgress);

    let diagonalsOffset: number = timeSinceStarted * diagonalsSpeed;
    SetProperty(tilingDiagonalsDiv, "--diagonals-offset", diagonalsOffset.toString() + "px");
    SetProperty(diagonalsModulateDiv, "--gradient-end", transitionPercentage);
    requestAnimationFrame(OnDraw);
}

function SetProperty(element: HTMLElement, propertyName: string, propertyValue: string) {
    element.style.setProperty(propertyName, propertyValue);
}

OnDraw();