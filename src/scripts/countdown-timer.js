"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CountdownTimer {
    constructor(config) {
        this.timerInterval = 1000; // one second
        this.state = {
            timestampLastUpdate: undefined,
            remainingTime: undefined,
            timerRunning: false,
            timerInstance: undefined
        };
        if (config.onIntervalCallback) {
            this.onInterval = config.onIntervalCallback;
        }
        else {
            this.onInterval = undefined;
        }
        this.timerLengthInMs = this.normalizeTimerLength(config.timerLength);
        this.onComplete = config.onCompleteCallback;
        this.state.remainingTime = this.timerLengthInMs;
    }
    getTime(format) {
        const miliseconds = this.state.remainingTime;
        const seconds = Math.floor(miliseconds / 1000);
        const minutes = Math.floor(miliseconds / (1000 * 60));
        switch (format) {
            case "mm:ss":
            default:
                const displayMinutes = this.toTwoDigitString(minutes);
                const displaySeconds = this.toTwoDigitString(seconds % 60);
                return `${displayMinutes}:${displaySeconds}`;
        }
    }
    start() {
        this.startTimer();
    }
    stop() {
        this.endTimer();
    }
    updateTimer() {
        const now = this.getCurrentDateInMs();
        const lastUpdate = this.state.timestampLastUpdate;
        const timeElapsed = now - lastUpdate;
        console.log(`>Elapsed: ${timeElapsed / 1000}`);
        this.state.timestampLastUpdate = now;
        this.state.remainingTime = this.state.remainingTime - timeElapsed;
        const timeIsUp = this.state.remainingTime < 0;
        if (timeIsUp) {
            this.endTimer();
            this.onComplete();
        }
    }
    startTimer() {
        const timerIsNotRunning = this.state.timerRunning === false;
        if (timerIsNotRunning) {
            this.state.timerRunning = true;
            this.state.timestampLastUpdate = this.getCurrentDateInMs();
            const timerCallback = () => {
                const timeRemainingAsString = this.getTime();
                this.updateTimer();
                this.onInterval(timeRemainingAsString);
            };
            const runTimerUntilNextInterval = () => {
                const timeUntilNextInterval = this.state.remainingTime % this.timerInterval;
                return new Promise((resolve, reject) => {
                    this.state.timerInstance = setTimeout(() => {
                        timerCallback();
                        resolve();
                    }, timeUntilNextInterval);
                });
            };
            const runTimerOnIntervals = () => {
                this.state.timerInstance = setInterval(timerCallback, this.timerInterval);
            };
            runTimerUntilNextInterval().then(runTimerOnIntervals);
        }
    }
    endTimer() {
        const timerIsRunning = this.state.timerRunning === true;
        if (timerIsRunning) {
            this.state.timerRunning = false;
            this.updateTimer();
            clearTimeout(this.state.timerInstance);
            clearInterval(this.state.timerInstance);
        }
    }
    // helper methods
    // ------------------
    toTwoDigitString(number) {
        if (number <= 9) {
            return '0' + number;
        }
        else {
            return number.toString();
        }
    }
    normalizeTimerLength(timerLength) {
        let timerLengthInMs;
        const inputTime = timerLength[0];
        const inputTimeFormat = timerLength[1];
        switch (inputTimeFormat) {
            case "seconds":
            case "s":
                timerLengthInMs = inputTime * 1000;
                break;
            case "minutes":
            case "m":
                timerLengthInMs = inputTime * 1000 * 60;
                break;
            default:
                throw new Error("Incorrect arguments passed to TimerLength");
        }
        return timerLengthInMs;
    }
    getCurrentDateInMs() {
        return new Date().getTime();
    }
}
exports.default = CountdownTimer;
