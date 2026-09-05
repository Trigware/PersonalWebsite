const introductionDiv = document.getElementById("Introduction");
const introductionBreak = document.getElementById("IntroductionBreak");
const glyphShowDuration = 0.05;
const animationDelay = 1.35;
import * as Utils from "./Utils.js";
let originalContentList = [];
let combinedContentLength = 0;
let introductionFullWidth = 0;
let maximumElementHeight = 0;
let totalElementHeight = 0;
function OnStart() {
    for (let introductionChild of introductionDiv.children) {
        originalContentList.push(introductionChild.textContent);
        combinedContentLength += introductionChild.textContent.length;
    }
    OnDraw();
}
let previousContent = "";
function OnDraw() {
    ProgressTypewritter();
    HandleIntroductionPositioning();
    requestAnimationFrame(OnDraw);
}
let previousWindowSize = Utils.Vec2.Zero();
function ProgressTypewritter() {
    let timeSinceAnimationStarted = Math.max(Utils.GetTimeSinceStarted() - animationDelay, 0);
    let drawnGlyphCount = Math.floor(timeSinceAnimationStarted / glyphShowDuration);
    let glyphsEncountered = 0;
    let currentWindowSize = new Utils.Vec2(window.innerWidth, window.innerHeight);
    let windowSizeChanged = !currentWindowSize.Equals(previousWindowSize);
    previousWindowSize = currentWindowSize;
    let typewritterFinished = previousContent.length >= combinedContentLength;
    previousContent = "";
    let introductionStoredWidth = 0;
    maximumElementHeight = totalElementHeight = 0;
    for (let i = 0; i < originalContentList.length; i++) {
        let introductionChild = introductionDiv.children[i];
        let originalContent = originalContentList[i];
        let contentLength = drawnGlyphCount - glyphsEncountered;
        let newContent = originalContent.substring(0, contentLength);
        if (!typewritterFinished)
            introductionChild.textContent = originalContent;
        let introductionRect = introductionChild.getBoundingClientRect();
        introductionStoredWidth += introductionRect.width;
        maximumElementHeight = Math.max(maximumElementHeight, introductionRect.height);
        totalElementHeight += introductionRect.height;
        if (!typewritterFinished)
            introductionChild.textContent = newContent;
        glyphsEncountered += introductionChild.textContent.length;
        previousContent += newContent;
    }
    if (windowSizeChanged || !typewritterFinished)
        introductionFullWidth = introductionStoredWidth;
}
const introductionYPercentageOffset = 10;
const introductionBreakRequirement = 1.35;
function HandleIntroductionPositioning() {
    let viewportWidth = window.innerWidth;
    let scaledIntroductionWidth = introductionFullWidth * introductionBreakRequirement;
    let fitsInOneLine = viewportWidth > scaledIntroductionWidth;
    introductionBreak.style.display = fitsInOneLine ? "none" : "inline";
    let fullHeight = introductionDiv.clientHeight;
    let introductionTrueHeight = fitsInOneLine ? maximumElementHeight : totalElementHeight;
    let introductionOffset = (fullHeight - introductionTrueHeight) / 2;
    introductionDiv.style.transform = `translateY(calc(${introductionYPercentageOffset}% + ${introductionOffset}px))`;
}
OnStart();
