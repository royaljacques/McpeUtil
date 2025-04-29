export function HourlyChecker(): boolean {
    const now = new Date();
    if (now.getMinutes() === 0 && now.getSeconds() === 0) return true; else return false;
}