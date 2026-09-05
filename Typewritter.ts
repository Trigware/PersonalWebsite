const introductionDiv = document.getElementById("Introduction") as HTMLDivElement;
const introductionBreak = document.getElementById("IntroductionBreak") as HTMLBRElement;

const glyphShowDuration: number = 0.05;
const animationDelay: number = 1.35;

import * as Utils from "./Utils.js"

let originalContentList: string[] = [];
let combinedContentLength: number = 0;
let introductionFullWidth: number = 0;
let maximumElementHeight: number = 0;
let totalElementHeight: number = 0;

function OnStart() {
    for (let introductionChild of introductionDiv.children) {
        originalContentList.push(introductionChild.textContent);
        combinedContentLength += introductionChild.textContent.length;
    }
    OnDraw();
}

let previousContent: string = "";

function OnDraw() {
    ProgressTypewritter();
    HandleIntroductionPositioning();
    requestAnimationFrame(OnDraw);
}

let previousWindowSize: Utils.Vec2 = Utils.Vec2.Zero();

function ProgressTypewritter() {
    let timeSinceAnimationStarted: number = Math.max(Utils.GetTimeSinceStarted() - animationDelay, 0);
    let drawnGlyphCount: number = Math.floor(timeSinceAnimationStarted / glyphShowDuration);
    let glyphsEncountered: number = 0;
    let currentWindowSize: Utils.Vec2 = new Utils.Vec2(window.innerWidth, window.innerHeight);
    let windowSizeChanged: boolean = !currentWindowSize.Equals(previousWindowSize);
    previousWindowSize = currentWindowSize;
    
    let typewritterFinished: boolean = previousContent.length >= combinedContentLength;
    previousContent = "";
    let introductionStoredWidth: number = 0;
    maximumElementHeight = totalElementHeight = 0;

    for (let i: number = 0; i < originalContentList.length; i++) {
        let introductionChild: Element = introductionDiv.children[i];
        let originalContent: string = originalContentList[i];
        let contentLength: number = drawnGlyphCount - glyphsEncountered;
        let newContent: string = originalContent.substring(0, contentLength);
        
        if (!typewritterFinished) introductionChild.textContent = originalContent;
        let introductionRect: DOMRect = introductionChild.getBoundingClientRect();
        introductionStoredWidth += introductionRect.width;
        maximumElementHeight = Math.max(maximumElementHeight, introductionRect.height);
        totalElementHeight += introductionRect.height;
        if (!typewritterFinished) introductionChild.textContent = newContent;

        glyphsEncountered += introductionChild.textContent.length;
        previousContent += newContent;
    }

    if (windowSizeChanged || !typewritterFinished) introductionFullWidth = introductionStoredWidth;
}

const introductionYPercentageOffset: number = 10;
const introductionBreakRequirement: number = 1.35;

function HandleIntroductionPositioning() {
    let viewportWidth: number = window.innerWidth;
    let scaledIntroductionWidth: number = introductionFullWidth * introductionBreakRequirement;
    let fitsInOneLine: boolean = viewportWidth > scaledIntroductionWidth;
    introductionBreak.style.display = fitsInOneLine ? "none" : "inline";

    let fullHeight: number = introductionDiv.clientHeight;
    let introductionTrueHeight: number = fitsInOneLine ? maximumElementHeight : totalElementHeight;
    let introductionOffset: number = (fullHeight - introductionTrueHeight) / 2;
    introductionDiv.style.transform = `translateY(calc(${introductionYPercentageOffset}% + ${introductionOffset}px))`;
}

OnStart();