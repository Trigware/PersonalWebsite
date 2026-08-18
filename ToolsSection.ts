import * as Utils from "./Utils.js";

const toolsSectionRoot = document.getElementById("ToolsSection") as HTMLDivElement;
const scrollingTools = document.getElementById("ScrollingTools") as HTMLDivElement;
const toolsHeader = document.getElementById("ToolsHeader") as HTMLHeadingElement;

class ToolInfo {
    public filePath: string = "";
    public toolName: string = "";
    public constructor(path: string, name: string) {
        this.filePath = path;
        this.toolName = name;
    }
}

const toolInfoList: ToolInfo[] = [
    new ToolInfo("cpp.png", "C++"), new ToolInfo("csharp.png", "CSharp"), new ToolInfo("css3.png", "CSS"),
    new ToolInfo("git.png", "Git"), new ToolInfo("godot.png", "Godot"), new ToolInfo("html5.png", "HTML"),
    new ToolInfo("js.png", "JavaScript"), new ToolInfo("ts.png", "TypeScript")
];

let previousHeaderWidth: number = -1;
const toolBoxIconScale: number = 0.6;
const scrollingToolsOpacityDelay: number = 1.6;
const scrollingToolsOpacityAnimationDuration: number = 1.1;

function OnStart() {
    for (let i: number = 0; i < toolInfoList.length; i++) {
        let usedToolBox: HTMLDivElement = document.createElement("div");
        usedToolBox.classList.add("DescriptionTextbox", "Tool");
        toolsSectionRoot.appendChild(usedToolBox);

        let toolInfo: ToolInfo = toolInfoList[i];
        let fullPath: string = "./Logos/" + toolInfo.filePath;
        let toolBoxIcon: HTMLImageElement = document.createElement("img");
        toolBoxIcon.width = 0;
        toolBoxIcon.onload = () => {
            let aspectRatio: number = toolBoxIcon.naturalWidth / toolBoxIcon.naturalHeight;
            toolBoxIcon.width = usedToolBox.clientHeight * aspectRatio;
            toolBoxIcon.height = usedToolBox.clientHeight;
        };
        
        toolBoxIcon.src = fullPath;
        toolBoxIcon.style.transform = `scale(${toolBoxIconScale})`;
        usedToolBox.appendChild(toolBoxIcon);

        let usedToolBoxDescription: HTMLParagraphElement = document.createElement("p");
        usedToolBoxDescription.textContent = toolInfo.toolName;
        usedToolBox.appendChild(usedToolBoxDescription);
    }
    OnDraw();
}

let previousTimeSinceStarted: number = Utils.GetTimeSinceStarted();

function OnDraw() {
    let timeSinceStarted: number = Utils.GetTimeSinceStarted();
    let deltaTime: number = timeSinceStarted - previousTimeSinceStarted;

    let headerRect: DOMRect = toolsHeader.getBoundingClientRect();
    if (headerRect.width != previousHeaderWidth) OnHeaderChanged();
    previousHeaderWidth = headerRect.width;
    HandleToolsPositions();
    HandleToolsBoxInteractions();
    HandleToolsBoxAnimations(deltaTime);

    requestAnimationFrame(OnDraw);
    previousTimeSinceStarted = timeSinceStarted;
}

const toolGapSize: number = 80;

function OnHeaderChanged() {
    scrollingTools.replaceChildren();
    let imageSizeWithGap: number = toolsHeader.clientHeight + toolGapSize;
    let imageCount: number = Math.floor(toolsHeader.clientWidth / imageSizeWithGap);

    for (let i: number = 0; i < imageCount; i++) {
        let imageElement: HTMLImageElement = document.createElement("img");
        let usedImageIndex: number = i % toolInfoList.length;
        let toolInfo: ToolInfo = toolInfoList[usedImageIndex];
        let fullPath: string = "./Logos/" + toolInfo.filePath;

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

    let animationOpacity: number = Utils.Clamp(Utils.InverseLerp(scrollingToolsOpacityDelay, scrollingToolsOpacityAnimationDuration, timeSinceStarted), 0, 1);
    toolsHeader.style.opacity = animationOpacity.toString();

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
        let imageOpacity: number = Math.min(imageEdgeOpacity, imageCenterOpacity, animationOpacity);
        imageElement.style.display = imageEdgeOpacity === 0 ? "none" : "inline";
        imageElement.style.opacity = imageOpacity.toString();
    }
}

let previousHoveredBoxIndices = new Set<number>();
let hoverAnimationTimerMap = new Map<number, number>();
let hoverAnimationStatusMap = new Map<number, boolean>();
let toolBoxYOffsetMap = new Map<number, number>();

const toolBoxOpacityBaseDelay: number = 1.8;
const toolBoxOpacityRowDelay: number = 0.4;
const toolBocOpacityAnimationDuration: number = 0.7;

function HandleToolsBoxInteractions() {
    let toolsBoxCount: number = toolsSectionRoot.children.length;
    let currentHoveredBoxIndices = new Set<number>();
    let rootDocumentStyle: CSSStyleDeclaration = getComputedStyle(document.documentElement);
    let toolsColumnCount: number = parseInt(rootDocumentStyle.getPropertyValue("--tool-section-columns"));
    let timeSinceStarted: number = Utils.GetTimeSinceStarted();

    for (let i: number = 0; i < toolsBoxCount; i++) {
        let toolBox: HTMLDivElement = toolsSectionRoot.children[i] as HTMLDivElement;
        let toolBoxYOffset: number = toolBoxYOffsetMap.has(i) ? toolBoxYOffsetMap.get(i)! : 0;
        let toolBoxRect: DOMRect = toolBox.getBoundingClientRect();
        toolBoxRect.height -= toolBoxYOffset;

        let mouseBoxOriginDiff: Utils.Vec2 = Utils.GetMousePos().Minus(toolBoxRect.left, toolBoxRect.top);
        let isInToolBox: boolean = mouseBoxOriginDiff.IsInsideOf(0, 0, toolBoxRect.width, toolBoxRect.height);
        if (isInToolBox) currentHoveredBoxIndices.add(i);

        let toolRowNumber: number = Math.floor(i / toolsColumnCount);
        let toolBoxOpacityDelay: number = toolBoxOpacityBaseDelay + toolBoxOpacityRowDelay * toolRowNumber;
        let toolBoxOpacity: number = Utils.Clamp(Utils.InverseLerp(toolBoxOpacityDelay, toolBocOpacityAnimationDuration, timeSinceStarted), 0, 1);
        toolBox.style.opacity = toolBoxOpacity.toString();
    }

    for (let currentIndex of currentHoveredBoxIndices) { if (!previousHoveredBoxIndices.has(currentIndex)) InteractWithToolBox(currentIndex, true); }
    for (let previousIndex of previousHoveredBoxIndices) { if (!currentHoveredBoxIndices.has(previousIndex)) InteractWithToolBox(previousIndex, false); }

    previousHoveredBoxIndices = currentHoveredBoxIndices;
}

function InteractWithToolBox(boxIndex: number, didHoverStart: boolean) {
    hoverAnimationStatusMap.set(boxIndex, didHoverStart);
}

const hoverAnimationDuration: number = 0.35;
const finishedAnimationYOffset: number = -18.5;

function HandleToolsBoxAnimations(deltaTime: number) {
    for (let boxStatePair of hoverAnimationStatusMap) {
        let toolBoxIndex: number = boxStatePair[0];
        let toolBoxStatus: boolean = boxStatePair[1];

        if (!hoverAnimationTimerMap.has(toolBoxIndex)) hoverAnimationTimerMap.set(toolBoxIndex, 0);
        let currentBoxAnimationTime: number = hoverAnimationTimerMap.get(toolBoxIndex)!;
        let animationProgressMultiplier: number = toolBoxStatus ? 1 : -1;
        currentBoxAnimationTime += deltaTime * animationProgressMultiplier;
        currentBoxAnimationTime = Utils.Clamp(currentBoxAnimationTime, 0, hoverAnimationDuration);
        hoverAnimationTimerMap.set(toolBoxIndex, currentBoxAnimationTime);

        let animationProgress: number = currentBoxAnimationTime / hoverAnimationDuration;
        let interpolatedProgress: number = Utils.EaseInOut(animationProgress);
        let toolBoxAnimationY: number = finishedAnimationYOffset * interpolatedProgress;
        toolBoxYOffsetMap.set(toolBoxIndex, toolBoxAnimationY);
        let toolBoxDiv: HTMLDivElement = toolsSectionRoot.children[toolBoxIndex] as HTMLDivElement;
        toolBoxDiv.style.transform = `translateY(${toolBoxAnimationY}px)`;
    }
}

OnStart();