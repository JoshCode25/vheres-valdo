import { writable } from "svelte/store";

export const gameTime = writable({
    maxTime: 90, 
    remainingTime: maxTime
});