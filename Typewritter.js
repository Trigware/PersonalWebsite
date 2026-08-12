const introductionDiv = document.getElementById("Introduction");
const glyphShowDuration = 0.05;
const animationDelay = 1.35;
import * as Utils from "./Utils.js";
let originalContentList = [];
let combinedContentLength = 0;
function OnStart() {
    for (let introductionChild of introductionDiv.children) {
        originalContentList.push(introductionChild.textContent);
        combinedContentLength += introductionChild.textContent.length;
    }
    OnDraw();
}
function OnDraw() {
    let timeSinceAnimationStarted = Math.max(Utils.GetTimeSinceStarted() - animationDelay, 0);
    let drawnGlyphCount = Math.floor(timeSinceAnimationStarted / glyphShowDuration);
    let glyphsEncountered = 0;
    if (drawnGlyphCount >= combinedContentLength + 1)
        return;
    for (let i = 0; i < originalContentList.length; i++) {
        let introductionChild = introductionDiv.children[i];
        let originalContent = originalContentList[i];
        let contentLength = drawnGlyphCount - glyphsEncountered;
        let newContent = originalContent.substring(0, contentLength);
        introductionChild.textContent = newContent;
        glyphsEncountered += introductionChild.textContent.length;
    }
    requestAnimationFrame(OnDraw);
}
OnStart();
