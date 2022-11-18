import { writable } from "svelte/store";

const defaultMaxTime = 90;

export const gameTime = writable({
    maxTime: defaultMaxTime, 
    remainingTime: defaultMaxTime,
    percentRemaining: Math.floor((remainingTime / maxTime) * 1000) / 10;
});