import * as Utils from "./Utils.js";
const descriptionImage = document.getElementById("MyImage");
const descriptionTextbox = document.getElementById("DescriptionTextbox");
const textContainer = document.getElementById("TextContainer");
const descriptionAnimationDelay = 1.5;
const descriptionAnimationDuration = 0.925;
function OnStart() {
    requestAnimationFrame(OnDraw);
}
let prevDescriptionSize = Utils.Vec2.Zero();
function OnDraw() {
    let animationProgress = Utils.GetAnimationProgress(descriptionAnimationDelay, descriptionAnimationDuration);
    descriptionImage.style.opacity = animationProgress.toString();
    descriptionTextbox.style.opacity = animationProgress.toString();
    let textboxBounds = descriptionTextbox.getBoundingClientRect();
    let currentDescriptionSize = new Utils.Vec2(textboxBounds.width, textboxBounds.height);
    let descriptionSizeChanged = !prevDescriptionSize.Equals(currentDescriptionSize);
    prevDescriptionSize = currentDescriptionSize;
    if (descriptionSizeChanged)
        FitText();
    requestAnimationFrame(OnDraw);
}
const minimumFontSize = 0;
const maximumFontSize = 100;
const heightThreshold = 1;
const fixTextLoopCount = 100;
const textboxHeightMultiplier = 0.95;
function FitText() {
    let currentMinSize = minimumFontSize;
    let currentMaxSize = maximumFontSize;
    let textboxBounds = descriptionTextbox.getBoundingClientRect();
    textboxBounds.height *= textboxHeightMultiplier;
    for (let i = 0; i < fixTextLoopCount; i++) {
        let fontSize = (currentMinSize + currentMaxSize) / 2;
        textContainer.style.fontSize = fontSize.toString() + "em";
        let containerBounds = textContainer.getBoundingClientRect();
        let heightDiff = Math.abs(textboxBounds.height - containerBounds.height);
        if (containerBounds.height > textboxBounds.height)
            currentMaxSize = fontSize;
        if (containerBounds.height < textboxBounds.height)
            currentMinSize = fontSize;
        if (heightDiff <= heightThreshold)
            return;
    }
}
OnStart();
