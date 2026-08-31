const startPerformance = performance.now();

export class Vec2 {
    public x: number = 0;
    public y: number = 0;

    constructor(x: number, y: number) {
        this.x = x; this.y = y;
    }

    public static Zero() {
        return new Vec2(0, 0);
    }

    public Plus(x: number, y: number): Vec2 {
        return new Vec2(this.x + x, this.y + y);
    }

    public Minus(x: number, y: number): Vec2 {
        return new Vec2(this.x - x, this.y - y);
    }

    public IsInsideOf(x: number, y: number, w: number, h: number): boolean {
        return this.x >= x && this.y >= y && this.x <= w && this.y <= h;
    }
}

export function GetTimeSinceStarted(): number {
    return (performance.now() - startPerformance) / 1000.0;
}

export function EaseInOut(t: number, power: number = 2): number {
    if (t < 0.5) return Math.pow(2 * t, power) / 2;
    return 1 - Math.pow(2 * (1 - t), power) / 2;
}

export function EaseIn(t: number, power: number = 2): number {
    return Math.pow(t, power);
}

export function Lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

export async function GetFileContents(fileDir: string): Promise<string> {
    const usedDirectory: string = "./" + fileDir;
    const response = await fetch(usedDirectory);
    let fileContents = response.text();
    return fileContents;
}

export function GetPercentage(value: number): string {
    return (value * 100).toString() + "%";
}

export function GetNumericPixels(value: string): number {
    let suffixStartIndex: number = value.indexOf("px");
    let valueWithoutSuffix: string = value.substring(0, suffixStartIndex);
    let numericalValue: number = Number(valueWithoutSuffix);
    return numericalValue;
}

export function Clamp(value: number, min: number, max: number): number {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

export function GetAnimationProgress(animationDelay: number, animationDuration: number): number {
    let timeSinceStarted: number = GetTimeSinceStarted();
    let timeSinceAnimationStarted: number = Math.max(timeSinceStarted - animationDelay, 0);
    let animationProgress: number = Math.min(timeSinceAnimationStarted / animationDuration, 1);
    return animationProgress;
}

export function InverseLerp(a: number, b: number, v: number): number {
    return (v - a) / b;
}

let mousePos: Vec2 = Vec2.Zero();

document.addEventListener("mousemove", (event) => {
    mousePos.x = event.clientX;
    mousePos.y = event.clientY;
});

export function GetMousePos(): Vec2 { return mousePos; }

export function IsMouseInBox(box: HTMLElement, offset: Vec2 = Vec2.Zero()) {
    let boxRect: DOMRect = box.getBoundingClientRect();
    boxRect.x += offset.x; boxRect.y += offset.y;
    let mousePos: Vec2 = GetMousePos();
    let mouseBoxOriginDiff: Vec2 = mousePos.Minus(boxRect.left, boxRect.top);
    let isMouseInBox: boolean = mouseBoxOriginDiff.IsInsideOf(0, 0, boxRect.width, boxRect.height);
    return isMouseInBox;
}