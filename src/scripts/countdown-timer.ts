import CountdownTimerConfigurationObject from "./typedefs/countdown-timer-configuration-object";

interface TimerState {
	timestampLastUpdate: number;
	remainingTime: number,
	timerRunning: boolean,
	timerInstance: any,
}

export default class CountdownTimer {
	
	public getTime(format?: string): string {
		const miliseconds = this.state.remainingTime;
		const seconds = Math.floor(miliseconds / 1000);
		const minutes = Math.floor(miliseconds / (1000 * 60));

		switch (format){
			case "mm:ss":
			default:
				const displayMinutes = this.toTwoDigitString(minutes);
				const displaySeconds = this.toTwoDigitString(seconds % 60);
				return `${displayMinutes}:${displaySeconds}`;
		}
 	}

	public start(): void {
		this.startTimer();
	}

	public stop(): void {
		this.endTimer();
	}


	constructor(config: CountdownTimerConfigurationObject){
		if(config.onIntervalCallback){
			this.onInterval = config.onIntervalCallback;
		} else {
			this.onInterval = undefined;
		}
		this.timerLengthInMs = this.normalizeTimerLength(config.timerLength);
		this.onComplete = config.onCompleteCallback;
		this.state.remainingTime = this.timerLengthInMs;
	}


	private timerLengthInMs: number;
	private timerInterval: number = 1000; // one second
	private onInterval: Function;
	private onComplete: Function;

	private state: TimerState = {
		timestampLastUpdate: undefined,
		remainingTime: undefined,
		timerRunning: false,
		timerInstance: undefined
	}

	private updateTimer(): void {
		const now: number = this.getCurrentDateInMs();
		const lastUpdate: number = this.state.timestampLastUpdate;
		const timeElapsed = now - lastUpdate;
		console.log(`>Elapsed: ${timeElapsed / 1000}`);
		this.state.timestampLastUpdate = now;
		this.state.remainingTime = this.state.remainingTime - timeElapsed;

		const timeIsUp = this.state.remainingTime < 0;
		if (timeIsUp){
			this.endTimer();
			this.onComplete();
		}
	}

	private startTimer(): void{
		const timerIsNotRunning = this.state.timerRunning === false;
		if(timerIsNotRunning){

			this.state.timerRunning = true;
			this.state.timestampLastUpdate = this.getCurrentDateInMs();

			const timerCallback = () => {
				const timeRemainingAsString: string = this.getTime();
				this.updateTimer();
				this.onInterval(timeRemainingAsString);
			};

			const runTimerUntilNextInterval = (): Promise<any> => {
				const timeUntilNextInterval = this.state.remainingTime % this.timerInterval;
				return new Promise( (resolve, reject) => {
					this.state.timerInstance = setTimeout( () => {
						timerCallback();
						resolve();
					}, timeUntilNextInterval);
				});
			};

			const runTimerOnIntervals = (): void => {
				this.state.timerInstance = setInterval(timerCallback, this.timerInterval);
			};

			runTimerUntilNextInterval().then( runTimerOnIntervals );
		}
	}

	private endTimer(): void{
		const timerIsRunning = this.state.timerRunning === true;
		if(timerIsRunning){
			this.state.timerRunning = false;
			this.updateTimer();
			clearTimeout(this.state.timerInstance);
			clearInterval(this.state.timerInstance);
		}
	}

	// helper methods
	// ------------------
	private toTwoDigitString(number: number): string {
		if ( number <= 9 ){
			return'0' + number;
		} else {
			return number.toString();
		}
	}

	private normalizeTimerLength(timerLength: [number, string]): number{
		let timerLengthInMs: number;
		const inputTime = timerLength[0];
		const inputTimeFormat = timerLength[1];
		switch(inputTimeFormat){
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

	private getCurrentDateInMs(): number {
		return new Date().getTime();
	}

}