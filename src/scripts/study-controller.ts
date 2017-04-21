import IUserInterfaceAdapter from "./typedefs/user-interface-adapter";
import IParticipantDataService from "./typedefs/participant-data-service";

import CountdownTimer from "./countdown-timer";

import ConditionObject from "./typedefs/condition-object";
import TaskObject from "./typedefs/task-object";
import TaskDataObject from "./typedefs/task-data-object";
import TaskIndex from "./typedefs/task-index";
import UserInfoObject from "./typedefs/user-info-object";
import UserInterfacePromptOptions from "./typedefs/user-interface-prompt-options";

interface StudyStateContainer {
	currentTask: TaskObject;
	currentTaskIndex: TaskIndex;
	currentTaskMistakeCount: number;
}
interface UserInterfaceStateContainer {
	progress: boolean[][];
}
export default class StudyController {

	public runStudy(): Promise<any> {
		return new Promise( (resolve, reject) => {
			this.recordParticipantInfo().then( () => {
				this.runStudyTasks().then( () => {
					this.finishStudy();
					resolve();
				});
			});
		}).catch( err => {
			this.userInterfaceAdapter.promptUser({
				text: `Err: ${err}`,
				allowContinue: false,
				allowInput: false,
			})
		});
	}

	public validateAnswer(answer: any): boolean {
		const validate = this.state.currentTask.validationFunction;
		if (validate(answer) === true){
			return true;
		} else {
			this.state.currentTaskMistakeCount += 1;
			return false;
		}
	}

	public screenSizeTooSmall(): void {
		this.pauseCountdown(); // pause countdown forever
		this.userInterfaceAdapter.promptUser({
			text: "Your screen is too small. Please take this study on a different device.",
			allowContinue: false,
			allowInput: false,
		});
	}

	public closeStudyByUser(): void {
		this.participantDataService.setData({
			user_closed_study_early: true,
		});
		this.finishStudy();
	}


	constructor(condition: ConditionObject,
							userInterfaceAdapter: IUserInterfaceAdapter,
							participantDataService: IParticipantDataService){
		this.condition = condition;
		this.userInterfaceState.progress = this.createInitialProgressBarState(this.condition);
		this.userInterfaceAdapter = userInterfaceAdapter;
		this.participantDataService = participantDataService;
		this.timer = new CountdownTimer({
			onCompleteCallback: () => {
				this.closeStudyByTimeout();
			},
			onIntervalCallback: (displayTime: string) => {
				this.userInterfaceAdapter.updateTime(displayTime);
			},
			timerLength: [this.condition.timeout_length_in_seconds, "seconds"]
		});
	}


	private condition: ConditionObject;
	private taskAnswerValidator: Function;
	private userInterfaceAdapter: IUserInterfaceAdapter;
	private participantDataService: IParticipantDataService;
	private timer: CountdownTimer;

	private state: StudyStateContainer = {
		currentTask: null,
		currentTaskIndex: [0,0],
		currentTaskMistakeCount: 0,
	}

	private userInterfaceState: UserInterfaceStateContainer = {
		progress: [[]]
	}

	private createInitialProgressBarState(condition: ConditionObject): boolean[][] {
		let progressBar: boolean[][] = [];
		let tasks = condition.tasks;
		let numSubsections = tasks.length;
		for (let i = 0; i < numSubsections; i++){
			progressBar[i] = [];
			for (let j = 0; j < tasks[i].length; j++){
				progressBar[i].push(false);
			}
		}
		return progressBar;
	}

	private resumeCountdown(): void {
		this.timer.start();
	}

	private pauseCountdown(): void {
		this.timer.stop();
	}

	private closeStudyByTimeout(): void {
		this.participantDataService.setData({
			user_timed_out: true,
		});
		this.finishStudy();
	}

	private recordParticipantInfo(): Promise<any> {
		if (this.condition.participant_external_id_prompt === true){
			const userIdType = this.condition.participant_external_id_type;
			const userIdPrompt: UserInterfacePromptOptions = {
				text: `Please enter your ${userIdType} id:`,
				allowInput: true,
				allowContinue: true,
			};
			return new Promise( (resolve, reject) => {
				this.userInterfaceAdapter.promptUser(userIdPrompt).then( (userInfo: UserInfoObject) => {
					this.participantDataService.setData({
						participant_external_id: userInfo.userId,
					});
					resolve();
				});
			});

		} else {
			this.participantDataService.setData({
				participant_external_id: null,
			});
			return Promise.resolve();
		}
	}
	
	private getTaskAtIndex(index: TaskIndex): TaskObject | null {
		const [i, j] = index;
		try {
			return this.condition.tasks[i][j];
		} catch (e){
			return null;
		}
	}

	private getFirstTask(): TaskObject {
		const taskIndex: TaskIndex = this.state.currentTaskIndex;
		const task: TaskObject = this.getTaskAtIndex(taskIndex);
		this.state.currentTask = task;
		this.state.currentTaskMistakeCount = 0;
		return task;
	}

	private getNextTask(): TaskObject | null {
		const nextTaskIndex: TaskIndex | null = this.getNextTaskIndex(this.state.currentTaskIndex);
		const noNextTask = nextTaskIndex === null;
		if (noNextTask) {
			return null;
		} else {
			const task: TaskObject = this.getTaskAtIndex(nextTaskIndex);
			this.state.currentTaskIndex = nextTaskIndex;
			this.state.currentTask = task;
			this.state.currentTaskMistakeCount = 0;
			return task;
		}
	}

	private updateUserInterface(): Promise<any> {
		// create progressObject from last completed task
		const lastCompletedTaskIndex = this.getPrevTaskIndex(this.state.currentTaskIndex);
		if (lastCompletedTaskIndex !== null){
			const [i,j] = lastCompletedTaskIndex;
			this.userInterfaceState.progress[i][j] = true;
		}
		return this.userInterfaceAdapter.setDisplay({
			progress: this.userInterfaceState.progress,
		});
	}

	private getNextTaskIndex(index: TaskIndex): TaskIndex | null {
		const currSubsection = index[0];
		const currTask = index[1];
		const finalSubsection: number = this.condition.tasks.length - 1;
		const finalTaskInSubsection: number = this.condition.tasks[currSubsection].length - 1;

		if (currTask >= finalTaskInSubsection){
			if (currSubsection >= finalSubsection){
				// that was the last task
				return null;
			} else {
				// move to next subsection
				return [currSubsection + 1, 0];
			}
		} else {
			// move to next task in subsection
			return [currSubsection, currTask + 1];
		}
	}

	private getPrevTaskIndex(index: TaskIndex): TaskIndex | null {
		const currSubsection = index[0];
		const currTask = index[1];
		const firstSubsection: number = 0;
		const firstTaskInSubsection: number = 0;

		if (currTask <= firstTaskInSubsection){
			if (currSubsection <= firstSubsection){
				// that was the last task
				return null;
			} else {
				// move to last task in prev subsection
				const prevSubsectionIndex = currSubsection - 1;
				const lastTaskInPrevSubsectionIndex = this.condition.tasks[prevSubsectionIndex].length - 1;
				return [prevSubsectionIndex, lastTaskInPrevSubsectionIndex];
			}
		} else {
			// move to next task in subsection
			return [currSubsection, currTask - 1];
		}
	}

	private storeTaskData(taskData: TaskDataObject){
		this.participantDataService.addTaskData(taskData);
	}

	private runStudyTasks(): Promise<any> {
		return new Promise( (resolve, reject) => {
			const showNextTask = (task: TaskObject) => {
				this.resumeCountdown();
				this.runTask(task).then( (taskData: TaskDataObject) => {
					this.pauseCountdown();
					this.storeTaskData(taskData);
					const nextTask = this.getNextTask();
					const allTasksComplete = nextTask === null;
					if (allTasksComplete){
						resolve();
					} else {
						showNextTask(nextTask);
					}
				});
			}
			const firstTask = this.getFirstTask();
			showNextTask(firstTask);
		});
	}

	private runTask(task: TaskObject): Promise<TaskDataObject> {
		return this.updateUserInterface().then( () => {
			const startTime: Date = new Date();
			let endTime: Date;
			return new Promise( (resolve, reject) => {
				this.userInterfaceAdapter.runTask(task).then((answer) => {
					endTime = new Date();
					const taskData: TaskDataObject = {
						answer: answer,
						timeElapsed: endTime.getTime() - startTime.getTime(),
						numMistakes: this.state.currentTaskMistakeCount,
						task: task,
						taskIndex: this.state.currentTaskIndex,
					};
					resolve(taskData);
				});
			});
		})
	}

	private getValidationID(): string {
		function randString(): string{
			let text = "";
			const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for(let i=0; i < 5; i++){
			    text += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			return text;
		}
		return `${randString()}-${this.condition.condition_id}`;
	}

	private finishStudy(): void {
		const validationID: string = this.getValidationID();
		this.participantDataService.setData({
			validation_id: validationID,
			condition: this.condition,
			// TODO: set timestart/timeEnd
		});
		this.participantDataService.endDataCollection();
		this.updateUserInterface().then( () => {
			this.userInterfaceAdapter.promptUser({
				text: `The study is over. Here is your validation ID: ${validationID}`,
				allowContinue: false,
				allowInput: false,
			});
		});
	}

}