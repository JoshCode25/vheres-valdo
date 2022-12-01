import { writable } from "svelte/store";

function createTimer() {

    const timer = writable({
        initialTime: 30,
        score: 0,
        highScore: 15,
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
		incrementTime: (delta) => timer.update(o => {
            o.remainingTime = o.remainingTime + delta;
            o.updateRemainingPercent();
            return o;
        }),
        decrementTime: (delta) => timer.update(o => {
            o.remainingTime = o.remainingTime - delta;
            o.updateRemainingPercent();
            return o;
        }),
		resetTime: () => timer.set(o => {
            o.remainingTime = initialTime
            o.updateRemainingPercent();
            return o;
        }),
        increaseScore: (delta) => timer.update(o => {
            o.score = o.score + delta;
            return o;
        }),
        setHighscore: (score) => timer.update(o => {
            o.highScore = score;
            return o;
        })
	};
}

export const gameTimer = createTimer();