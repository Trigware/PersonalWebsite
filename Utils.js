const startPerformance = performance.now();
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
export function clamp(value, min, max) {
    if (value < min)
        return min;
    if (value > max)
        return max;
    return value;
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
