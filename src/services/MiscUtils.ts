export function toMMSS(seconds: number): string {
    var currentTimeStringSeconds = Math.floor(seconds % 60).toString();
    if (currentTimeStringSeconds.length === 1) {
        currentTimeStringSeconds = `0${currentTimeStringSeconds}`;
    }
    const currentTimeStringMinutes = Math.floor(seconds / 60);
    const currentDurationString = `${currentTimeStringMinutes}:${currentTimeStringSeconds}`;
    return currentDurationString;
}