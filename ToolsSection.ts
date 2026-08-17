import * as Utils from "./Utils.js";

const toolsSectionRoot = document.getElementById("ToolsSection") as HTMLDivElement;
const scrollingTools = document.getElementById("ScrollingTools") as HTMLDivElement;
const toolsHeader = document.getElementById("ToolsHeader") as HTMLHeadingElement;

const logosFilePaths: string[] = [
    "cpp.png", "csharp.png", "css3.png",
    "git.png", "godot.png", "html5.png",
    "js.png", "ts.png"
];

let previousHeaderWidth: number = -1;

function OnStart() {
    for (let i: number = 0; i < logosFilePaths.length; i++) {
        let usedToolBox = document.createElement("div");
        usedToolBox.classList.add("DescriptionTextbox", "Tool");
        toolsSectionRoot.appendChild(usedToolBox);
    }
    OnDraw();
}

function OnDraw() {
    let headerRect: DOMRect = toolsHeader.getBoundingClientRect();
    if (headerRect.width != previousHeaderWidth) OnHeaderChanged();
    previousHeaderWidth = headerRect.width;
    HandleToolsPositions();

    requestAnimationFrame(OnDraw);
}

const toolGapSize: number = 80;

function OnHeaderChanged() {
    scrollingTools.replaceChildren();
    let imageSizeWithGap: number = toolsHeader.clientHeight + toolGapSize;
    let imageCount: number = Math.floor(toolsHeader.clientWidth / imageSizeWithGap);

    for (let i: number = 0; i < imageCount; i++) {
        let imageElement: HTMLImageElement = document.createElement("img");
        let usedImageIndex: number = i % logosFilePaths.length;
        let fullPath: string = "./Logos/" + logosFilePaths[usedImageIndex];

        imageElement.src = fullPath;
        imageElement.width = 0;
        imageElement.onload = () => {
            let aspectRatio: number = imageElement.naturalWidth / imageElement.naturalHeight;
            imageElement.width = toolsHeader.clientHeight;
            imageElement.height = toolsHeader.clientHeight / aspectRatio;
        };
        scrollingTools.appendChild(imageElement);
    }
    
}

const toolsMoveSpeed: number = 60;
const toolsImagesScale: number = 0.85;
const distanceToMaximumEdgeOpacity: number = 115;
const distanceToMaximumCenterOpacity: number = 80;

function HandleToolsPositions() {
    let timeSinceStarted = Utils.GetTimeSinceStarted();
    let headerRange: Range = document.createRange();
    headerRange.selectNodeContents(toolsHeader);
    let headerContentWidth: number = headerRange.getBoundingClientRect().width;
    let scrollingToolsCount: number = scrollingTools.children.length;
    let imageSizeWithGap: number = toolsHeader.clientHeight + toolGapSize;
    var remainingScreenSpace: number = window.innerWidth % imageSizeWithGap;
    imageSizeWithGap += remainingScreenSpace / scrollingToolsCount;

    for (let i: number = 0; i < scrollingToolsCount; i++) {
        let imageElement = scrollingTools.children[i] as HTMLImageElement;
        let imagePosX: number = imageSizeWithGap * i;
        imagePosX += timeSinceStarted * toolsMoveSpeed;
        imagePosX %= toolsHeader.clientWidth;
        imageElement.style.transform = `translateX(${imagePosX}px) scale(${toolsImagesScale})`;
        
        let distToRightEdge: number = window.innerWidth - (imagePosX + imageSizeWithGap);
        let distToEdge: number = Math.min(imagePosX, distToRightEdge);
        let centeredImageX: number = imagePosX + toolsHeader.clientHeight * toolsImagesScale / 2;
        let imageXToCenterDist: number = Math.abs(window.innerWidth / 2 - centeredImageX);

        let imageEdgeOpacity: number = Utils.Clamp(distToEdge / distanceToMaximumEdgeOpacity, 0, 1);
        let imageCenterOpacity: number = Utils.Clamp(Utils.InverseLerp(headerContentWidth / 2, headerContentWidth / 2 + distanceToMaximumCenterOpacity, imageXToCenterDist), 0, 1);
        let imageOpacity: number = Math.min(imageEdgeOpacity, imageCenterOpacity);
        imageElement.style.display = imageEdgeOpacity === 0 ? "none" : "inline";
        imageElement.style.opacity = imageOpacity.toString();
    }
}

OnStart();