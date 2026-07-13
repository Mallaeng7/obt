"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameTime = getGameTime;
function getGameTime(envTime, sunrise = 8, sunset = 20) {
    const isNight = envTime >= sunset || envTime < sunrise;
    // Format envTime to HH:MM
    const hours = Math.floor(envTime);
    const minutes = Math.floor((envTime - hours) * 60);
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    // In Rust, 1 real minute = ~20 game minutes during day, ~15 game minutes during night (varies by server, standard day is 45m, night is 15m)
    // Let's use standard default: day length 45 mins, night length 15 mins
    const dayLength = 45;
    const nightLength = 15;
    const gameHoursPerDay = (sunset > sunrise) ? (sunset - sunrise) : (24 - sunrise + sunset);
    const gameHoursPerNight = 24 - gameHoursPerDay;
    const realMinsPerGameHourDay = dayLength / gameHoursPerDay;
    const realMinsPerGameHourNight = nightLength / gameHoursPerNight;
    let timeUntilNight = 0;
    let timeUntilDay = 0;
    if (!isNight) {
        const gameHoursLeft = sunset - envTime;
        timeUntilNight = Math.ceil(gameHoursLeft * realMinsPerGameHourDay);
    }
    else {
        let gameHoursLeft = 0;
        if (envTime >= sunset) {
            gameHoursLeft = (24 - envTime) + sunrise;
        }
        else {
            gameHoursLeft = sunrise - envTime;
        }
        timeUntilDay = Math.ceil(gameHoursLeft * realMinsPerGameHourNight);
    }
    return { timeString, isNight, timeUntilNight, timeUntilDay };
}
