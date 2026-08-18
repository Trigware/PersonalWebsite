import * as Utils from "./Utils.js";
const toolsSectionRoot = document.getElementById("ToolsSection");
const scrollingTools = document.getElementById("ScrollingTools");
const toolsHeader = document.getElementById("ToolsHeader");
class ToolInfo {
    filePath = "";
    toolName = "";
    constructor(path, name) {
        this.filePath = path;
        this.toolName = name;
    }
}
const toolInfoList = [
    new ToolInfo("cpp.png", "C++"), new ToolInfo("csharp.png", "CSharp"), new ToolInfo("css3.png", "CSS"),
    new ToolInfo("git.png", "Git"), new ToolInfo("godot.png", "Godot"), new ToolInfo("html5.png", "HTML"),
    new ToolInfo("js.png", "JavaScript"), new ToolInfo("ts.png", "TypeScript")
];
let previousHeaderWidth = -1;
const toolBoxIconScale = 0.6;
const scrollingToolsOpacityDelay = 1.6;
const scrollingToolsOpacityAnimationDuration = 1.1;
function OnStart() {
    for (let i = 0; i < toolInfoList.length; i++) {
        let usedToolBox = document.createElement("div");
        usedToolBox.classList.add("DescriptionTextbox", "Tool");
        toolsSectionRoot.appendChild(usedToolBox);
        let toolInfo = toolInfoList[i];
        let fullPath = "./Logos/" + toolInfo.filePath;
        let toolBoxIcon = document.createElement("img");
        toolBoxIcon.width = 0;
        toolBoxIcon.onload = () => {
            let aspectRatio = toolBoxIcon.naturalWidth / toolBoxIcon.naturalHeight;
            toolBoxIcon.width = usedToolBox.clientHeight * aspectRatio;
            toolBoxIcon.height = usedToolBox.clientHeight;
        };
        toolBoxIcon.src = fullPath;
        toolBoxIcon.style.transform = `scale(${toolBoxIconScale})`;
        usedToolBox.appendChild(toolBoxIcon);
        let usedToolBoxDescription = document.createElement("p");
        usedToolBoxDescription.textContent = toolInfo.toolName;
        usedToolBox.appendChild(usedToolBoxDescription);
    }
    OnDraw();
}
let previousTimeSinceStarted = Utils.GetTimeSinceStarted();
function OnDraw() {
    let timeSinceStarted = Utils.GetTimeSinceStarted();
    let deltaTime = timeSinceStarted - previousTimeSinceStarted;
    let headerRect = toolsHeader.getBoundingClientRect();
    if (headerRect.width != previousHeaderWidth)
        OnHeaderChanged();
    previousHeaderWidth = headerRect.width;
    HandleToolsPositions();
    HandleToolsBoxInteractions();
    HandleToolsBoxAnimations(deltaTime);
    requestAnimationFrame(OnDraw);
    previousTimeSinceStarted = timeSinceStarted;
}
const toolGapSize = 80;
function OnHeaderChanged() {
    scrollingTools.replaceChildren();
    let imageSizeWithGap = toolsHeader.clientHeight + toolGapSize;
    let imageCount = Math.floor(toolsHeader.clientWidth / imageSizeWithGap);
    for (let i = 0; i < imageCount; i++) {
        let imageElement = document.createElement("img");
        let usedImageIndex = i % toolInfoList.length;
        let toolInfo = toolInfoList[usedImageIndex];
        let fullPath = "./Logos/" + toolInfo.filePath;
        imageElement.src = fullPath;
        imageElement.width = 0;
        imageElement.onload = () => {
            let aspectRatio = imageElement.naturalWidth / imageElement.naturalHeight;
            imageElement.width = toolsHeader.clientHeight;
            imageElement.height = toolsHeader.clientHeight / aspectRatio;
        };
        scrollingTools.appendChild(imageElement);
    }
}
const toolsMoveSpeed = 60;
const toolsImagesScale = 0.85;
const distanceToMaximumEdgeOpacity = 115;
const distanceToMaximumCenterOpacity = 80;
function HandleToolsPositions() {
    let timeSinceStarted = Utils.GetTimeSinceStarted();
    let headerRange = document.createRange();
    headerRange.selectNodeContents(toolsHeader);
    let headerContentWidth = headerRange.getBoundingClientRect().width;
    let scrollingToolsCount = scrollingTools.children.length;
    let imageSizeWithGap = toolsHeader.clientHeight + toolGapSize;
    var remainingScreenSpace = window.innerWidth % imageSizeWithGap;
    imageSizeWithGap += remainingScreenSpace / scrollingToolsCount;
    let animationOpacity = Utils.Clamp(Utils.InverseLerp(scrollingToolsOpacityDelay, scrollingToolsOpacityAnimationDuration, timeSinceStarted), 0, 1);
    toolsHeader.style.opacity = animationOpacity.toString();
    for (let i = 0; i < scrollingToolsCount; i++) {
        let imageElement = scrollingTools.children[i];
        let imagePosX = imageSizeWithGap * i;
        imagePosX += timeSinceStarted * toolsMoveSpeed;
        imagePosX %= toolsHeader.clientWidth;
        imageElement.style.transform = `translateX(${imagePosX}px) scale(${toolsImagesScale})`;
        let distToRightEdge = window.innerWidth - (imagePosX + imageSizeWithGap);
        let distToEdge = Math.min(imagePosX, distToRightEdge);
        let centeredImageX = imagePosX + toolsHeader.clientHeight * toolsImagesScale / 2;
        let imageXToCenterDist = Math.abs(window.innerWidth / 2 - centeredImageX);
        let imageEdgeOpacity = Utils.Clamp(distToEdge / distanceToMaximumEdgeOpacity, 0, 1);
        let imageCenterOpacity = Utils.Clamp(Utils.InverseLerp(headerContentWidth / 2, headerContentWidth / 2 + distanceToMaximumCenterOpacity, imageXToCenterDist), 0, 1);
        let imageOpacity = Math.min(imageEdgeOpacity, imageCenterOpacity, animationOpacity);
        imageElement.style.display = imageEdgeOpacity === 0 ? "none" : "inline";
        imageElement.style.opacity = imageOpacity.toString();
    }
}
let previousHoveredBoxIndices = new Set();
let hoverAnimationTimerMap = new Map();
let hoverAnimationStatusMap = new Map();
let toolBoxYOffsetMap = new Map();
const toolBoxOpacityBaseDelay = 1.8;
const toolBoxOpacityRowDelay = 0.4;
const toolBocOpacityAnimationDuration = 0.7;
function HandleToolsBoxInteractions() {
    let toolsBoxCount = toolsSectionRoot.children.length;
    let currentHoveredBoxIndices = new Set();
    let rootDocumentStyle = getComputedStyle(document.documentElement);
    let toolsColumnCount = parseInt(rootDocumentStyle.getPropertyValue("--tool-section-columns"));
    let timeSinceStarted = Utils.GetTimeSinceStarted();
    for (let i = 0; i < toolsBoxCount; i++) {
        let toolBox = toolsSectionRoot.children[i];
        let toolBoxYOffset = toolBoxYOffsetMap.has(i) ? toolBoxYOffsetMap.get(i) : 0;
        let toolBoxRect = toolBox.getBoundingClientRect();
        toolBoxRect.height -= toolBoxYOffset;
        let mouseBoxOriginDiff = Utils.GetMousePos().Minus(toolBoxRect.left, toolBoxRect.top);
        let isInToolBox = mouseBoxOriginDiff.IsInsideOf(0, 0, toolBoxRect.width, toolBoxRect.height);
        if (isInToolBox)
            currentHoveredBoxIndices.add(i);
        let toolRowNumber = Math.floor(i / toolsColumnCount);
        let toolBoxOpacityDelay = toolBoxOpacityBaseDelay + toolBoxOpacityRowDelay * toolRowNumber;
        let toolBoxOpacity = Utils.Clamp(Utils.InverseLerp(toolBoxOpacityDelay, toolBocOpacityAnimationDuration, timeSinceStarted), 0, 1);
        toolBox.style.opacity = toolBoxOpacity.toString();
    }
    for (let currentIndex of currentHoveredBoxIndices) {
        if (!previousHoveredBoxIndices.has(currentIndex))
            InteractWithToolBox(currentIndex, true);
    }
    for (let previousIndex of previousHoveredBoxIndices) {
        if (!currentHoveredBoxIndices.has(previousIndex))
            InteractWithToolBox(previousIndex, false);
    }
    previousHoveredBoxIndices = currentHoveredBoxIndices;
}
function InteractWithToolBox(boxIndex, didHoverStart) {
    hoverAnimationStatusMap.set(boxIndex, didHoverStart);
}
const hoverAnimationDuration = 0.35;
const finishedAnimationYOffset = -18.5;
function HandleToolsBoxAnimations(deltaTime) {
    for (let boxStatePair of hoverAnimationStatusMap) {
        let toolBoxIndex = boxStatePair[0];
        let toolBoxStatus = boxStatePair[1];
        if (!hoverAnimationTimerMap.has(toolBoxIndex))
            hoverAnimationTimerMap.set(toolBoxIndex, 0);
        let currentBoxAnimationTime = hoverAnimationTimerMap.get(toolBoxIndex);
        let animationProgressMultiplier = toolBoxStatus ? 1 : -1;
        currentBoxAnimationTime += deltaTime * animationProgressMultiplier;
        currentBoxAnimationTime = Utils.Clamp(currentBoxAnimationTime, 0, hoverAnimationDuration);
        hoverAnimationTimerMap.set(toolBoxIndex, currentBoxAnimationTime);
        let animationProgress = currentBoxAnimationTime / hoverAnimationDuration;
        let interpolatedProgress = Utils.EaseInOut(animationProgress);
        let toolBoxAnimationY = finishedAnimationYOffset * interpolatedProgress;
        toolBoxYOffsetMap.set(toolBoxIndex, toolBoxAnimationY);
        let toolBoxDiv = toolsSectionRoot.children[toolBoxIndex];
        toolBoxDiv.style.transform = `translateY(${toolBoxAnimationY}px)`;
    }
}
OnStart();
