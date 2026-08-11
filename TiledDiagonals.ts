const diagonalsModulateDiv = document.getElementById("DiagonalsModulate") as HTMLDivElement;

const gradientTransitionDuration: number = 0.95;
const waitDuration: number = 0.35;

import * as Utils from "./Utils.js"

function OnDraw() {
    let timeSinceStarted: number = Utils.GetTimeSinceStarted();
    let timeSinceAnimationStarted: number = timeSinceStarted - waitDuration;
    let transitionProgress: number = Math.min(timeSinceAnimationStarted / gradientTransitionDuration, 1);
    let interpolatedProgress: number = Utils.EaseIn(transitionProgress);
    let transitionPercentage: string = Utils.GetPercentage(transitionProgress);
    console.log(transitionPercentage);
    SetProperty("--gradient-end", transitionPercentage);
    requestAnimationFrame(OnDraw);
}

function SetProperty(propertyName: string, propertyValue: string) {
    diagonalsModulateDiv.style.setProperty(propertyName, propertyValue);
}

OnDraw();