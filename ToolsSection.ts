import * as Utils from "./Utils.js";

const toolsSectionRoot = document.getElementById("ToolsSection") as HTMLDivElement;
const scrollingTools = document.getElementById("ScrollingTools") as HTMLDivElement;
const toolsHeader = document.getElementById("ToolsHeader") as HTMLHeadingElement;
const toolsCollapseButton = document.getElementById("ToolsCollapseButton") as HTMLButtonElement;
const toolBoxFiltersRoot = document.getElementById("ToolBoxFilters") as HTMLDivElement;
const toolsCollapseButtonContainer = document.getElementById("ToolButtonContainer") as HTMLDivElement;

enum ToolType {
    All,
    GameDev,
    WebDev,
    DevTool,
    Other,
    ShowMore
}

class ToolInfo {
    public filePath: string = "";
    public toolName: string = "";
    public toolTypeList: ToolType[] = [];

    public constructor(path: string, name: string, typeList: ToolType[] = []) {
        this.filePath = path;
        this.toolName = name;
        this.toolTypeList = typeList;
    }
}

const toolInfoList: ToolInfo[] = [
    new ToolInfo("cpp.png", "C++", [ToolType.GameDev]), new ToolInfo("csharp.png", "CSharp", [ToolType.GameDev]), new ToolInfo("ts.png", "TypeScript", [ToolType.WebDev]),
    new ToolInfo("godot.png", "Godot", [ToolType.GameDev]), new ToolInfo("css3.png", "CSS", [ToolType.WebDev]), new ToolInfo("git.png", "Git", [ToolType.DevTool]),
    new ToolInfo("html5.png", "HTML", [ToolType.WebDev]), new ToolInfo("js.png", "JavaScript", [ToolType.WebDev]), new ToolInfo("VSCommunity.png", "VS Community", [ToolType.DevTool]),
    new ToolInfo("sdl.png", "SDL", [ToolType.GameDev]), new ToolInfo("VSCode.png", "VSCode", [ToolType.DevTool])
];

const toolTypeFilterNameMap = new Map<ToolType, string>([
    [ToolType.All, "Vše"],
    [ToolType.GameDev, "Herní vývoj"],
    [ToolType.WebDev, "Webový vývoj"],
    [ToolType.DevTool, "Vývojové programy"],
    [ToolType.Other, "Jiné"]
]);

let previousHeaderWidth: number = -1;
const toolBoxIconScale: number = 0.6;
const scrollingToolsOpacityDelay: number = 2;
const scrollingToolsOpacityAnimationDuration: number = 1.1;

let areToolsCollapsed: boolean = true;
let selectedToolTypeFilter: ToolType = ToolType.All;
const collapsedRowCount: number = 2;

function CreateToolInfoBoxes() {
    for (let i: number = 0; i < toolInfoList.length; i++) {
        let usedToolBox: HTMLDivElement = document.createElement("div");
        usedToolBox.classList.add("DescriptionTextbox", "Tool");
        toolsSectionRoot.appendChild(usedToolBox);

        let toolInfo: ToolInfo = toolInfoList[i];
        let fullPath: string = "./Logos/" + toolInfo.filePath;
        let toolBoxIcon: HTMLImageElement = document.createElement("img");
        toolBoxIcon.width = 0;
        toolBoxIcon.onload = () => { SetToolBoxIconSize(toolBoxIcon, usedToolBox); };
        
        toolBoxIcon.src = fullPath;
        toolBoxIcon.style.transform = `scale(${toolBoxIconScale})`;
        usedToolBox.appendChild(toolBoxIcon);

        let usedToolBoxDescription: HTMLParagraphElement = document.createElement("p");
        usedToolBoxDescription.textContent = toolInfo.toolName;
        usedToolBox.appendChild(usedToolBoxDescription);
    }
}

function CreateToolInfoFilterBoxes() {
    for (let toolType of Object.values(ToolType)) {
        let isToolTypeValue: boolean = !isNaN(Number(toolType));
        if (!isToolTypeValue) continue;

        toolType = toolType as ToolType;
        let filterResults: number[] = GetToolBoxFilterResults(toolType);
        let doesFilterHaveTool: boolean = filterResults.length > 0;
        if (!doesFilterHaveTool) continue;

        let filterButton: HTMLButtonElement = document.createElement("button");
        filterButton.classList.add("DescriptionTextbox", "ToolButton");
        let filterNameStr: string = toolTypeFilterNameMap.get(toolType)!;
        filterNameStr += " (" + filterResults.length.toString() + ")";
        filterButton.textContent = filterNameStr;
        filterButton.addEventListener("click", () => { OnFilterClicked(toolType); });
        toolBoxFilterButtons.set(toolType, filterButton);
        toolBoxFiltersRoot.appendChild(filterButton);
    }
}

function OnFilterClicked(filterToolType: ToolType) {
    selectedToolTypeFilter = filterToolType;
    areToolsCollapsed = true;
    HandleToolBoxesVisibility();
}

let toolBoxFilterButtons = new Map<ToolType, HTMLButtonElement>();

function GetToolBoxFilterResults(toolType: ToolType): number[] {
    let filterResults: number[] = [];
    for (let i: number = 0; i < toolInfoList.length; i++) {
        if (toolType === ToolType.All) { filterResults.push(i); continue; }
        let toolInfo: ToolInfo = toolInfoList[i];
        if (toolType === ToolType.Other && toolInfo.toolTypeList.length === 0) { filterResults.push(i); continue; }
        if (toolInfo.toolTypeList.includes(toolType)) filterResults.push(i);
    }
    return filterResults;
}

function SetToolBoxIconSize(toolBoxIcon: HTMLImageElement, usedToolBox: HTMLDivElement) {
    let aspectRatio: number = toolBoxIcon.naturalWidth / toolBoxIcon.naturalHeight;
    toolBoxIcon.width = usedToolBox.clientHeight * aspectRatio;
    toolBoxIcon.height = usedToolBox.clientHeight;
}

function OnStart() {
    CreateToolInfoBoxes();
    CreateToolInfoFilterBoxes();
    toolsCollapseButton.addEventListener("click", () => { areToolsCollapsed = !areToolsCollapsed; });
    toolBoxFilterButtons.set(ToolType.ShowMore, toolsCollapseButton);
    OnDraw();
    requestAnimationFrame(OnHeaderChanged);
}

const minimumCollapsedToolsCount: number = 3;

function HandleToolBoxesVisibility() {
    let toolsColumnCount: number = GetToolsColumnCount();
    let collapsedToolBoxCount: number = Math.max(toolsColumnCount * collapsedRowCount, minimumCollapsedToolsCount);
    let visibleToolBoxCount: number = areToolsCollapsed ? collapsedToolBoxCount : toolInfoList.length;
    let collapseButtonText: string = areToolsCollapsed ? "UKAŽ VÍCE" : "UKAŽ MÉNĚ";
    toolsCollapseButton.textContent = collapseButtonText;
    let toolBoxFilterResults = GetToolBoxFilterResults(selectedToolTypeFilter);

    let possibleVisibleToolsCount: number = 0;
    let visibleToolsCount: number = 0;
    for (let i = 0; i < toolInfoList.length; i++) {
        let toolBox: HTMLDivElement = toolsSectionRoot.children[i] as HTMLDivElement;
        let isToolBoxVisible: boolean = visibleToolsCount < visibleToolBoxCount;
        let isPossiblyVisible = toolBoxFilterResults.includes(i);
        if (!isPossiblyVisible) isToolBoxVisible = false;
        let toolBoxDisplayStr: string = isToolBoxVisible ? "flex" : "none";
        toolBox.style.display = toolBoxDisplayStr;

        let toolBoxIcon: HTMLImageElement = toolBox.children[0] as HTMLImageElement;
        if (isPossiblyVisible) possibleVisibleToolsCount++;
        if (isToolBoxVisible) visibleToolsCount++;
        SetToolBoxIconSize(toolBoxIcon, toolBox);
    }
    
    let isCollapseButtonVisible: boolean = possibleVisibleToolsCount > collapsedToolBoxCount;
    let collapseButtonDisplayStr: string = isCollapseButtonVisible ? "flex" : "none";
    toolsCollapseButtonContainer.style.display = collapseButtonDisplayStr;
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
    HandleToolBoxesVisibility();
    HandleToolsBoxAnimations(deltaTime);
    HandleToolsButtonsAnimations(deltaTime);

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
const headerLineHeight: number = 64;

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
    let headerStyle: CSSStyleDeclaration = getComputedStyle(toolsHeader);
    let headerLines: number = toolsHeader.clientHeight / headerLineHeight;

    for (let i: number = 0; i < scrollingToolsCount; i++) {
        let imageElement = scrollingTools.children[i] as HTMLImageElement;
        if (headerLines > 1) { imageElement.style.display = "none"; continue; }

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
        imageElement.style.display = imageOpacity === 0 ? "none" : "inline";
        imageElement.style.opacity = imageOpacity.toString();
    }
}

let previousHoveredBoxIndices = new Set<number>();
let hoverAnimationTimerMap = new Map<number, number>();
let hoverAnimationStatusMap = new Map<number, boolean>();
let toolBoxYOffsetMap = new Map<number, number>();

const toolBoxOpacityBaseDelay: number = 2.35;
const toolBoxOpacityRowDelay: number = 0.4;
const toolBocOpacityAnimationDuration: number = 0.7;

function GetToolsColumnCount(): number {
    let rootDocumentStyle: CSSStyleDeclaration = getComputedStyle(document.documentElement);
    let toolsMaxColumnCount: number = parseInt(rootDocumentStyle.getPropertyValue("--max-tool-section-columns"));

    let toolsSectionWidth: number = Utils.GetNumericPixels(getComputedStyle(toolsSectionRoot).width);
    let toolBoxWidth: number = 0;
    for (let i = 0; i < toolsSectionRoot.children.length; i++) {
        let toolBox: HTMLDivElement = toolsSectionRoot.children[i] as HTMLDivElement;
        let toolBoxStyle: CSSStyleDeclaration = getComputedStyle(toolBox);
        let isToolBoxVisible: boolean = toolBoxStyle.display !== "none";
        if (!isToolBoxVisible) continue;

        let toolBoxRect: DOMRect = toolBox.getBoundingClientRect();
        toolBoxWidth = toolBoxRect.width;
    }

    let toolBoxGap: number = Utils.GetNumericPixels(rootDocumentStyle.getPropertyValue("--tool-gap"));
    let fitColumnsCount: number = Math.floor(toolsSectionWidth / (toolBoxWidth + toolBoxGap));
    let actualColumnsCount: number = Math.min(fitColumnsCount, toolsMaxColumnCount);

    return actualColumnsCount;
}

function HandleToolsBoxInteractions() {
    let toolsBoxCount: number = toolsSectionRoot.children.length;
    let currentHoveredBoxIndices = new Set<number>();
    let toolsColumnCount: number = GetToolsColumnCount();
    let timeSinceStarted: number = Utils.GetTimeSinceStarted();

    for (let i: number = 0; i < toolsBoxCount; i++) {
        let toolBox: HTMLDivElement = toolsSectionRoot.children[i] as HTMLDivElement;
        let toolBoxYOffset: number = toolBoxYOffsetMap.has(i) ? toolBoxYOffsetMap.get(i)! : 0;
        let isInToolBox: boolean = Utils.IsMouseInBox(toolBox, new Utils.Vec2(0, -toolBoxYOffset));
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

const filterButtonsOpacityAnimationDelay: number = 2;
const filterButtonsOpacityAnimationDuration: number = 1.1;

function HandleToolsButtonsAnimations(deltaTime: number) {
    let timeSinceStarted = Utils.GetTimeSinceStarted();
    let buttonOpacity: number = Utils.Clamp(Utils.InverseLerp(
        filterButtonsOpacityAnimationDelay, filterButtonsOpacityAnimationDuration, timeSinceStarted), 0, 1);

    for (let toolType of toolBoxFilterButtons.keys()) {
        let filterButton: HTMLButtonElement = toolBoxFilterButtons.get(toolType)!;
        filterButton.style.opacity = buttonOpacity.toString();
        let isFilterSelected: boolean = selectedToolTypeFilter === toolType;
        let backgroundColor = isFilterSelected ? "#293E7C" : "black";
        filterButton.style.backgroundColor = backgroundColor;
    }
}

OnStart();