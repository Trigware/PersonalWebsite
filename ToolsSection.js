import * as Utils from "./Utils.js";
const toolsSectionRoot = document.getElementById("ToolsSection");
const scrollingTools = document.getElementById("ScrollingTools");
const toolsHeader = document.getElementById("ToolsHeader");
const logosFilePaths = [
    "cpp.png", "csharp.png", "css3.png",
    "git.png", "godot.png", "html5.png",
    "js.png", "ts.png"
];
let previousHeaderWidth = -1;
function OnStart() {
    for (let i = 0; i < logosFilePaths.length; i++) {
        let usedToolBox = document.createElement("div");
        usedToolBox.classList.add("DescriptionTextbox", "Tool");
        toolsSectionRoot.appendChild(usedToolBox);
    }
    OnDraw();
}
function OnDraw() {
    let headerRect = toolsHeader.getBoundingClientRect();
    if (headerRect.width != previousHeaderWidth)
        OnHeaderChanged();
    previousHeaderWidth = headerRect.width;
    HandleToolsPositions();
    requestAnimationFrame(OnDraw);
}
const toolGapSize = 80;
function OnHeaderChanged() {
    scrollingTools.replaceChildren();
    let imageSizeWithGap = toolsHeader.clientHeight + toolGapSize;
    let imageCount = Math.floor(toolsHeader.clientWidth / imageSizeWithGap);
    for (let i = 0; i < imageCount; i++) {
        let imageElement = document.createElement("img");
        let usedImageIndex = i % logosFilePaths.length;
        let fullPath = "./Logos/" + logosFilePaths[usedImageIndex];
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
        let imageOpacity = Math.min(imageEdgeOpacity, imageCenterOpacity);
        imageElement.style.display = imageEdgeOpacity === 0 ? "none" : "inline";
        imageElement.style.opacity = imageOpacity.toString();
    }
}
OnStart();
