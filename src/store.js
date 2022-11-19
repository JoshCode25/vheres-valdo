import { writable, derived } from "svelte/store";

function createTimer() {

    const timer = writable({
        initialTime: 30,
        remainingTime: 30,
        remainingPercent: 100,
        timerHasBeenSet: false,
        timerActive: false,
        updateRemainingPercent() {
            this.remainingPercent = Math.round(this.remainingTime/this.initialTime*100);
        }
    });

	return {
        subscribe: timer.subscribe,
        setTimerActive: () => timer.update(o => {
            o.timerActive = true;
            return o;
        }),
        setTimerInactive: () => timer.update(o => {
            o.timerActive = false;
            return o;
        }),
        setInitialTime: (initialTime) => timer.update(o => {
            o.initialTime = initialTime;
            o.remainingTime = initialTime;
            return o;
        }),
		increment: (delta) => timer.update(o => {
            o.remainingTime = o.remainingTime + delta;
            o.updateRemainingPercent();
            return o;
        }),
        decrement: (delta) => timer.update(o => {
            o.remainingTime = o.remainingTime - delta;
            o.updateRemainingPercent();
            return o;
        }),
		reset: () => timer.set(o => {
            o.remainingTime = initialTime
            o.updateRemainingPercent();
            return o;
        })
	};
}

export const gameTimer = createTimer();