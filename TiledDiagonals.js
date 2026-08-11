const diagonalsModulateDiv = document.getElementById("DiagonalsModulate");
const gradientTransitionDuration = 0.95;
const waitDuration = 0.55;
import * as Utils from "./Utils.js";
function OnDraw() {
    let timeSinceStarted = Utils.GetTimeSinceStarted();
    let timeSinceAnimationStarted = timeSinceStarted - waitDuration;
    let transitionProgress = Math.min(timeSinceAnimationStarted / gradientTransitionDuration, 1);
    let interpolatedProgress = Utils.EaseIn(transitionProgress);
    let transitionPercentage = Utils.GetPercentage(transitionProgress);
    console.log(transitionPercentage);
    SetProperty("--gradient-end", transitionPercentage);
    requestAnimationFrame(OnDraw);
}
function SetProperty(propertyName, propertyValue) {
    diagonalsModulateDiv.style.setProperty(propertyName, propertyValue);
}
OnDraw();
