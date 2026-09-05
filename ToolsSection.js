import * as Utils from "./Utils.js";
const toolsSectionRoot = document.getElementById("ToolsSection");
const scrollingTools = document.getElementById("ScrollingTools");
const toolsHeader = document.getElementById("ToolsHeader");
const toolsCollapseButton = document.getElementById("ToolsCollapseButton");
const toolBoxFiltersRoot = document.getElementById("ToolBoxFilters");
const toolsCollapseButtonContainer = document.getElementById("ToolButtonContainer");
var ToolType;
(function (ToolType) {
    ToolType[ToolType["All"] = 0] = "All";
    ToolType[ToolType["GameDev"] = 1] = "GameDev";
    ToolType[ToolType["WebDev"] = 2] = "WebDev";
    ToolType[ToolType["DevTool"] = 3] = "DevTool";
    ToolType[ToolType["Other"] = 4] = "Other";
    ToolType[ToolType["ShowMore"] = 5] = "ShowMore";
})(ToolType || (ToolType = {}));
class ToolInfo {
    filePath = "";
    toolName = "";
    toolTypeList = [];
    constructor(path, name, typeList = []) {
        this.filePath = path;
        this.toolName = name;
        this.toolTypeList = typeList;
    }
}
const toolInfoList = [
    new ToolInfo("cpp.png", "C++", [ToolType.GameDev]), new ToolInfo("csharp.png", "CSharp", [ToolType.GameDev]), new ToolInfo("ts.png", "TypeScript", [ToolType.WebDev]),
    new ToolInfo("godot.png", "Godot", [ToolType.GameDev]), new ToolInfo("css3.png", "CSS", [ToolType.WebDev]), new ToolInfo("git.png", "Git", [ToolType.DevTool]),
    new ToolInfo("html5.png", "HTML", [ToolType.WebDev]), new ToolInfo("js.png", "JavaScript", [ToolType.WebDev]), new ToolInfo("VSCommunity.png", "VS Community", [ToolType.DevTool]),
    new ToolInfo("sdl.png", "SDL", [ToolType.GameDev]), new ToolInfo("VSCode.png", "VSCode", [ToolType.DevTool])
];
const toolTypeFilterNameMap = new Map([
    [ToolType.All, "Vše"],
    [ToolType.GameDev, "Herní vývoj"],
    [ToolType.WebDev, "Webový vývoj"],
    [ToolType.DevTool, "Vývojové programy"],
    [ToolType.Other, "Jiné"]
]);
let previousHeaderWidth = -1;
const toolBoxIconScale = 0.6;
const scrollingToolsOpacityDelay = 2;
const scrollingToolsOpacityAnimationDuration = 1.1;
let areToolsCollapsed = true;
let selectedToolTypeFilter = ToolType.All;
const collapsedRowCount = 2;
function CreateToolInfoBoxes() {
    for (let i = 0; i < toolInfoList.length; i++) {
        let usedToolBox = document.createElement("div");
        usedToolBox.classList.add("DescriptionTextbox", "Tool");
        toolsSectionRoot.appendChild(usedToolBox);
        let toolInfo = toolInfoList[i];
        let fullPath = "./Logos/" + toolInfo.filePath;
        let toolBoxIcon = document.createElement("img");
        toolBoxIcon.width = 0;
        toolBoxIcon.onload = () => { SetToolBoxIconSize(toolBoxIcon, usedToolBox); };
        toolBoxIcon.src = fullPath;
        toolBoxIcon.style.transform = `scale(${toolBoxIconScale})`;
        usedToolBox.appendChild(toolBoxIcon);
        let usedToolBoxDescription = document.createElement("p");
        usedToolBoxDescription.textContent = toolInfo.toolName;
        usedToolBox.appendChild(usedToolBoxDescription);
    }
}
function CreateToolInfoFilterBoxes() {
    for (let toolType of Object.values(ToolType)) {
        let isToolTypeValue = !isNaN(Number(toolType));
        if (!isToolTypeValue)
            continue;
        toolType = toolType;
        let filterResults = GetToolBoxFilterResults(toolType);
        let doesFilterHaveTool = filterResults.length > 0;
        if (!doesFilterHaveTool)
            continue;
        let filterButton = document.createElement("button");
        filterButton.classList.add("DescriptionTextbox", "ToolButton");
        let filterNameStr = toolTypeFilterNameMap.get(toolType);
        filterNameStr += " (" + filterResults.length.toString() + ")";
        filterButton.textContent = filterNameStr;
        filterButton.addEventListener("click", () => { OnFilterClicked(toolType); });
        toolBoxFilterButtons.set(toolType, filterButton);
        toolBoxFiltersRoot.appendChild(filterButton);
    }
}
function OnFilterClicked(filterToolType) {
    selectedToolTypeFilter = filterToolType;
    areToolsCollapsed = true;
    HandleToolBoxesVisibility();
}
let toolBoxFilterButtons = new Map();
function GetToolBoxFilterResults(toolType) {
    let filterResults = [];
    for (let i = 0; i < toolInfoList.length; i++) {
        if (toolType === ToolType.All) {
            filterResults.push(i);
            continue;
        }
        let toolInfo = toolInfoList[i];
        if (toolType === ToolType.Other && toolInfo.toolTypeList.length === 0) {
            filterResults.push(i);
            continue;
        }
        if (toolInfo.toolTypeList.includes(toolType))
            filterResults.push(i);
    }
    return filterResults;
}
function SetToolBoxIconSize(toolBoxIcon, usedToolBox) {
    let aspectRatio = toolBoxIcon.naturalWidth / toolBoxIcon.naturalHeight;
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
const minimumCollapsedToolsCount = 3;
function HandleToolBoxesVisibility() {
    let toolsColumnCount = GetToolsColumnCount();
    let collapsedToolBoxCount = Math.max(toolsColumnCount * collapsedRowCount, minimumCollapsedToolsCount);
    let visibleToolBoxCount = areToolsCollapsed ? collapsedToolBoxCount : toolInfoList.length;
    let collapseButtonText = areToolsCollapsed ? "UKAŽ VÍCE" : "UKAŽ MÉNĚ";
    toolsCollapseButton.textContent = collapseButtonText;
    let toolBoxFilterResults = GetToolBoxFilterResults(selectedToolTypeFilter);
    let possibleVisibleToolsCount = 0;
    let visibleToolsCount = 0;
    for (let i = 0; i < toolInfoList.length; i++) {
        let toolBox = toolsSectionRoot.children[i];
        let isToolBoxVisible = visibleToolsCount < visibleToolBoxCount;
        let isPossiblyVisible = toolBoxFilterResults.includes(i);
        if (!isPossiblyVisible)
            isToolBoxVisible = false;
        let toolBoxDisplayStr = isToolBoxVisible ? "flex" : "none";
        toolBox.style.display = toolBoxDisplayStr;
        let toolBoxIcon = toolBox.children[0];
        if (isPossiblyVisible)
            possibleVisibleToolsCount++;
        if (isToolBoxVisible)
            visibleToolsCount++;
        SetToolBoxIconSize(toolBoxIcon, toolBox);
    }
    let isCollapseButtonVisible = possibleVisibleToolsCount > collapsedToolBoxCount;
    let collapseButtonDisplayStr = isCollapseButtonVisible ? "flex" : "none";
    toolsCollapseButtonContainer.style.display = collapseButtonDisplayStr;
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
    HandleToolBoxesVisibility();
    HandleToolsBoxAnimations(deltaTime);
    HandleToolsButtonsAnimations(deltaTime);
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
const headerLineHeight = 64;
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
    let headerStyle = getComputedStyle(toolsHeader);
    let headerLines = toolsHeader.clientHeight / headerLineHeight;
    for (let i = 0; i < scrollingToolsCount; i++) {
        let imageElement = scrollingTools.children[i];
        if (headerLines > 1) {
            imageElement.style.display = "none";
            continue;
        }
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
        imageElement.style.display = imageOpacity === 0 ? "none" : "inline";
        imageElement.style.opacity = imageOpacity.toString();
    }
}
let previousHoveredBoxIndices = new Set();
let hoverAnimationTimerMap = new Map();
let hoverAnimationStatusMap = new Map();
let toolBoxYOffsetMap = new Map();
const toolBoxOpacityBaseDelay = 2.35;
const toolBoxOpacityRowDelay = 0.4;
const toolBocOpacityAnimationDuration = 0.7;
function GetToolsColumnCount() {
    let rootDocumentStyle = getComputedStyle(document.documentElement);
    let toolsMaxColumnCount = parseInt(rootDocumentStyle.getPropertyValue("--max-tool-section-columns"));
    let toolsSectionWidth = Utils.GetNumericPixels(getComputedStyle(toolsSectionRoot).width);
    let toolBoxWidth = 0;
    for (let i = 0; i < toolsSectionRoot.children.length; i++) {
        let toolBox = toolsSectionRoot.children[i];
        let toolBoxStyle = getComputedStyle(toolBox);
        let isToolBoxVisible = toolBoxStyle.display !== "none";
        if (!isToolBoxVisible)
            continue;
        let toolBoxRect = toolBox.getBoundingClientRect();
        toolBoxWidth = toolBoxRect.width;
    }
    let toolBoxGap = Utils.GetNumericPixels(rootDocumentStyle.getPropertyValue("--tool-gap"));
    let fitColumnsCount = Math.floor(toolsSectionWidth / (toolBoxWidth + toolBoxGap));
    let actualColumnsCount = Math.min(fitColumnsCount, toolsMaxColumnCount);
    return actualColumnsCount;
}
function HandleToolsBoxInteractions() {
    let toolsBoxCount = toolsSectionRoot.children.length;
    let currentHoveredBoxIndices = new Set();
    let toolsColumnCount = GetToolsColumnCount();
    let timeSinceStarted = Utils.GetTimeSinceStarted();
    for (let i = 0; i < toolsBoxCount; i++) {
        let toolBox = toolsSectionRoot.children[i];
        let toolBoxYOffset = toolBoxYOffsetMap.has(i) ? toolBoxYOffsetMap.get(i) : 0;
        let isInToolBox = Utils.IsMouseInBox(toolBox, new Utils.Vec2(0, -toolBoxYOffset));
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
const filterButtonsOpacityAnimationDelay = 2;
const filterButtonsOpacityAnimationDuration = 1.1;
function HandleToolsButtonsAnimations(deltaTime) {
    let timeSinceStarted = Utils.GetTimeSinceStarted();
    let buttonOpacity = Utils.Clamp(Utils.InverseLerp(filterButtonsOpacityAnimationDelay, filterButtonsOpacityAnimationDuration, timeSinceStarted), 0, 1);
    for (let toolType of toolBoxFilterButtons.keys()) {
        let filterButton = toolBoxFilterButtons.get(toolType);
        filterButton.style.opacity = buttonOpacity.toString();
        let isFilterSelected = selectedToolTypeFilter === toolType;
        let backgroundColor = isFilterSelected ? "#293E7C" : "black";
        filterButton.style.backgroundColor = backgroundColor;
    }
}
OnStart();
