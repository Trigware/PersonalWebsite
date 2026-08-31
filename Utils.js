const startPerformance = performance.now();
export class Vec2 {
    x = 0;
    y = 0;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static Zero() {
        return new Vec2(0, 0);
    }
    Plus(x, y) {
        return new Vec2(this.x + x, this.y + y);
    }
    Minus(x, y) {
        return new Vec2(this.x - x, this.y - y);
    }
    IsInsideOf(x, y, w, h) {
        return this.x >= x && this.y >= y && this.x <= w && this.y <= h;
    }
}
export function GetTimeSinceStarted() {
    return (performance.now() - startPerformance) / 1000.0;
}
export function EaseInOut(t, power = 2) {
    if (t < 0.5)
        return Math.pow(2 * t, power) / 2;
    return 1 - Math.pow(2 * (1 - t), power) / 2;
}
export function EaseIn(t, power = 2) {
    return Math.pow(t, power);
}
export function Lerp(a, b, t) {
    return a + (b - a) * t;
}
export async function GetFileContents(fileDir) {
    const usedDirectory = "./" + fileDir;
    const response = await fetch(usedDirectory);
    let fileContents = response.text();
    return fileContents;
}
export function GetPercentage(value) {
    return (value * 100).toString() + "%";
}
export function GetNumericPixels(value) {
    let suffixStartIndex = value.indexOf("px");
    let valueWithoutSuffix = value.substring(0, suffixStartIndex);
    let numericalValue = Number(valueWithoutSuffix);
    return numericalValue;
}
export function Clamp(value, min, max) {
    if (value < min)
        return min;
    if (value > max)
        return max;
    return value;
}
export function GetAnimationProgress(animationDelay, animationDuration) {
    let timeSinceStarted = GetTimeSinceStarted();
    let timeSinceAnimationStarted = Math.max(timeSinceStarted - animationDelay, 0);
    let animationProgress = Math.min(timeSinceAnimationStarted / animationDuration, 1);
    return animationProgress;
}
export function InverseLerp(a, b, v) {
    return (v - a) / b;
}
let mousePos = Vec2.Zero();
document.addEventListener("mousemove", (event) => {
    mousePos.x = event.clientX;
    mousePos.y = event.clientY;
});
export function GetMousePos() { return mousePos; }
export function IsMouseInBox(box, offset = Vec2.Zero()) {
    let boxRect = box.getBoundingClientRect();
    boxRect.x += offset.x;
    boxRect.y += offset.y;
    let mousePos = GetMousePos();
    let mouseBoxOriginDiff = mousePos.Minus(boxRect.left, boxRect.top);
    let isMouseInBox = mouseBoxOriginDiff.IsInsideOf(0, 0, boxRect.width, boxRect.height);
    return isMouseInBox;
}
