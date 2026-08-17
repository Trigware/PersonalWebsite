import * as Utils from "./Utils.js";

const descriptionImage = document.getElementById("MyImage") as HTMLImageElement;
const descriptionTextbox = document.getElementById("DescriptionTextbox") as HTMLDivElement;
const textContainer = document.getElementById("TextContainer") as HTMLDivElement;

const descriptionAnimationDelay: number = 1.5
const descriptionAnimationDuration: number = 0.925;

function OnStart() {
    OnDraw();
}

function OnDraw() {
    let animationProgress: number = Utils.GetAnimationProgress(descriptionAnimationDelay, descriptionAnimationDuration);
    descriptionImage.style.opacity = animationProgress.toString();
    descriptionTextbox.style.opacity = animationProgress.toString();
    FitText();
    requestAnimationFrame(OnDraw);
}

const minimumFontSize: number = 0;
const maximumFontSize: number = 100;
const heightThreshold: number = 1;
const fixTextLoopCount: number = 100;
const textboxHeightMultiplier: number = 0.95;

function FitText() {
    let currentMinSize: number = minimumFontSize;
    let currentMaxSize: number = maximumFontSize;
    let textboxBounds: DOMRect = descriptionTextbox.getBoundingClientRect();
    textboxBounds.height *= textboxHeightMultiplier;

    for (let i: number = 0; i < fixTextLoopCount; i++) {
        let fontSize: number = (currentMinSize + currentMaxSize) / 2;
        textContainer.style.fontSize = fontSize.toString() + "em";
        let containerBounds: DOMRect = textContainer.getBoundingClientRect();

        let heightDiff: number = Math.abs(textboxBounds.height - containerBounds.height);
        if (containerBounds.height > textboxBounds.height) currentMaxSize = fontSize;
        if (containerBounds.height < textboxBounds.height) currentMinSize = fontSize;
        if (heightDiff <= heightThreshold) return;
    }
}

OnStart();