const startPerformance = performance.now();

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

export function clamp(value: number, min: number, max: number): number {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

export async function GetFileContents(fileDir: string): Promise<string> {
    const usedDirectory: string = "./" + fileDir;
    const response = await fetch(usedDirectory);
    let fileContents = response.text();
    return fileContents;
}

export function GetPercentage(value: number) {
    return (value * 100).toString() + "%";
}