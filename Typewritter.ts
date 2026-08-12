const introductionDiv = document.getElementById("Introduction") as HTMLDivElement;
const glyphShowDuration: number = 0.05;
const animationDelay: number = 1.35;

import * as Utils from "./Utils.js"

let originalContentList: string[] = [];
let combinedContentLength: number = 0;

function OnStart() {
    for (let introductionChild of introductionDiv.children) {
        originalContentList.push(introductionChild.textContent);
        combinedContentLength += introductionChild.textContent.length;
    }
    OnDraw();
}

function OnDraw() {
    let timeSinceAnimationStarted: number = Math.max(Utils.GetTimeSinceStarted() - animationDelay, 0);
    let drawnGlyphCount: number = Math.floor(timeSinceAnimationStarted / glyphShowDuration);
    let glyphsEncountered: number = 0;
    if (drawnGlyphCount >= combinedContentLength + 1) return;

    for (let i: number = 0; i < originalContentList.length; i++) {
        let introductionChild: Element = introductionDiv.children[i];
        let originalContent: string = originalContentList[i];
        let contentLength: number = drawnGlyphCount - glyphsEncountered;
        let newContent: string = originalContent.substring(0, contentLength);

        introductionChild.textContent = newContent;
        glyphsEncountered += introductionChild.textContent.length;
    }

    requestAnimationFrame(OnDraw);
}

OnStart();