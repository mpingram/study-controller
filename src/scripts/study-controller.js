"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const countdown_timer_1 = require("./countdown-timer");
class StudyController {
    constructor(condition, userInterfaceAdapter, participantDataService) {
        this.state = {
            currentTask: null,
            currentTaskIndex: [0, 0],
            currentTaskMistakeCount: 0,
        };
        this.userInterfaceState = {
            progress: [[]]
        };
        this.condition = condition;
        this.userInterfaceState.progress = this.createInitialProgressBarState(this.condition);
        this.userInterfaceAdapter = userInterfaceAdapter;
        this.participantDataService = participantDataService;
        this.timer = new countdown_timer_1.default({
            onCompleteCallback: () => {
                this.closeStudyByTimeout();
            },
            onIntervalCallback: (displayTime) => {
                this.userInterfaceAdapter.updateTime(displayTime);
            },
            timerLength: [this.condition.timeout_length_in_seconds, "seconds"]
        });
    }
    runStudy() {
        return new Promise((resolve, reject) => {
            this.recordParticipantInfo().then(() => {
                this.runStudyTasks().then(() => {
                    this.finishStudy();
                    resolve();
                });
            });
        }).catch(err => {
            this.userInterfaceAdapter.promptUser({
                text: `Err: ${err}`,
                allowContinue: false,
                allowInput: false,
            });
        });
    }
    validateAnswer(answer) {
        const validate = this.state.currentTask.validationFunction;
        if (validate(answer) === true) {
            return true;
        }
        else {
            this.state.currentTaskMistakeCount += 1;
            return false;
        }
    }
    screenSizeTooSmall() {
        this.pauseCountdown(); // pause countdown forever
        this.userInterfaceAdapter.promptUser({
            text: "Your screen is too small. Please take this study on a different device.",
            allowContinue: false,
            allowInput: false,
        });
    }
    closeStudyByUser() {
        this.participantDataService.setData({
            user_closed_study_early: true,
        });
        this.finishStudy();
    }
    createInitialProgressBarState(condition) {
        let progressBar = [];
        let tasks = condition.tasks;
        let numSubsections = tasks.length;
        for (let i = 0; i < numSubsections; i++) {
            progressBar[i] = [];
            for (let j = 0; j < tasks[i].length; j++) {
                progressBar[i].push(false);
            }
        }
        return progressBar;
    }
    resumeCountdown() {
        this.timer.start();
    }
    pauseCountdown() {
        this.timer.stop();
    }
    closeStudyByTimeout() {
        this.participantDataService.setData({
            user_timed_out: true,
        });
        this.finishStudy();
    }
    recordParticipantInfo() {
        if (this.condition.participant_external_id_prompt === true) {
            const userIdType = this.condition.participant_external_id_type;
            const userIdPrompt = {
                text: `Please enter your ${userIdType} id:`,
                allowInput: true,
                allowContinue: true,
            };
            return new Promise((resolve, reject) => {
                this.userInterfaceAdapter.promptUser(userIdPrompt).then((userInfo) => {
                    this.participantDataService.setData({
                        participant_external_id: userInfo.userId,
                    });
                    resolve();
                });
            });
        }
        else {
            this.participantDataService.setData({
                participant_external_id: null,
            });
            return Promise.resolve();
        }
    }
    getTaskAtIndex(index) {
        const [i, j] = index;
        try {
            return this.condition.tasks[i][j];
        }
        catch (e) {
            return null;
        }
    }
    getFirstTask() {
        const taskIndex = this.state.currentTaskIndex;
        const task = this.getTaskAtIndex(taskIndex);
        this.state.currentTask = task;
        this.state.currentTaskMistakeCount = 0;
        return task;
    }
    getNextTask() {
        const nextTaskIndex = this.getNextTaskIndex(this.state.currentTaskIndex);
        const noNextTask = nextTaskIndex === null;
        if (noNextTask) {
            return null;
        }
        else {
            const task = this.getTaskAtIndex(nextTaskIndex);
            this.state.currentTaskIndex = nextTaskIndex;
            this.state.currentTask = task;
            this.state.currentTaskMistakeCount = 0;
            return task;
        }
    }
    updateUserInterface() {
        // create progressObject from last completed task
        const lastCompletedTaskIndex = this.getPrevTaskIndex(this.state.currentTaskIndex);
        if (lastCompletedTaskIndex !== null) {
            const [i, j] = lastCompletedTaskIndex;
            this.userInterfaceState.progress[i][j] = true;
        }
        return this.userInterfaceAdapter.setDisplay({
            progress: this.userInterfaceState.progress,
        });
    }
    getNextTaskIndex(index) {
        const currSubsection = index[0];
        const currTask = index[1];
        const finalSubsection = this.condition.tasks.length - 1;
        const finalTaskInSubsection = this.condition.tasks[currSubsection].length - 1;
        if (currTask >= finalTaskInSubsection) {
            if (currSubsection >= finalSubsection) {
                // that was the last task
                return null;
            }
            else {
                // move to next subsection
                return [currSubsection + 1, 0];
            }
        }
        else {
            // move to next task in subsection
            return [currSubsection, currTask + 1];
        }
    }
    getPrevTaskIndex(index) {
        const currSubsection = index[0];
        const currTask = index[1];
        const firstSubsection = 0;
        const firstTaskInSubsection = 0;
        if (currTask <= firstTaskInSubsection) {
            if (currSubsection <= firstSubsection) {
                // that was the last task
                return null;
            }
            else {
                // move to last task in prev subsection
                const prevSubsectionIndex = currSubsection - 1;
                const lastTaskInPrevSubsectionIndex = this.condition.tasks[prevSubsectionIndex].length - 1;
                return [prevSubsectionIndex, lastTaskInPrevSubsectionIndex];
            }
        }
        else {
            // move to next task in subsection
            return [currSubsection, currTask - 1];
        }
    }
    storeTaskData(taskData) {
        this.participantDataService.addTaskData(taskData);
    }
    runStudyTasks() {
        return new Promise((resolve, reject) => {
            const showNextTask = (task) => {
                this.resumeCountdown();
                this.runTask(task).then((taskData) => {
                    this.pauseCountdown();
                    this.storeTaskData(taskData);
                    const nextTask = this.getNextTask();
                    const allTasksComplete = nextTask === null;
                    if (allTasksComplete) {
                        resolve();
                    }
                    else {
                        showNextTask(nextTask);
                    }
                });
            };
            const firstTask = this.getFirstTask();
            showNextTask(firstTask);
        });
    }
    runTask(task) {
        return this.updateUserInterface().then(() => {
            const startTime = new Date();
            let endTime;
            return new Promise((resolve, reject) => {
                this.userInterfaceAdapter.runTask(task).then((answer) => {
                    endTime = new Date();
                    const taskData = {
                        answer: answer,
                        timeElapsed: endTime.getTime() - startTime.getTime(),
                        numMistakes: this.state.currentTaskMistakeCount,
                        task: task,
                        taskIndex: this.state.currentTaskIndex,
                    };
                    resolve(taskData);
                });
            });
        });
    }
    getValidationID() {
        function randString() {
            let text = "";
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < 5; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }
        return `${randString()}-${this.condition.condition_id}`;
    }
    finishStudy() {
        const validationID = this.getValidationID();
        this.participantDataService.setData({
            validation_id: validationID,
            condition: this.condition,
        });
        this.participantDataService.endDataCollection();
        this.updateUserInterface().then(() => {
            this.userInterfaceAdapter.promptUser({
                text: `The study is over. Here is your validation ID: ${validationID}`,
                allowContinue: false,
                allowInput: false,
            });
        });
    }
}
exports.default = StudyController;
