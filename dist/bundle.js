/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const study_controller_1 = __webpack_require__(4);
const user_interface_adapter_1 = __webpack_require__(5);
const participant_data_service_1 = __webpack_require__(3);
const backend_adapter_1 = __webpack_require__(1);
let controller;
const backendAdapter = new backend_adapter_1.default();
const participantDataService = new participant_data_service_1.default(backendAdapter);
const userInterfaceAdapter = new user_interface_adapter_1.default();
backendAdapter.getCondition().then((condition) => {
    controller = new study_controller_1.default(condition, userInterfaceAdapter, participantDataService);
    userInterfaceAdapter.connectToController(controller);
    controller.runStudy();
});


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class BackendAdapter {
    // TODO: implement
    postData(json) {
        console.log(json);
        return Promise.resolve();
    }
    getCondition() {
        return Promise.resolve({});
    }
}
exports.default = BackendAdapter;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class CountdownTimer {
    constructor(config) {
        this.state = {
            timestampOrigin: undefined,
            timestampLastStart: undefined,
            timestampLastStop: undefined,
            remainingTime: undefined,
            timerRunning: false,
            timerInstance: undefined
        };
        if (!config.timerIntervalInMs) {
            this.timerIntervalInMs = 1000;
        }
        else {
            this.timerIntervalInMs = config.timerIntervalInMs;
        }
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
        const miliseconds = this.getRemainingTimeInMs();
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
    startTimer() {
        const now = this.getCurrentDateInMs();
        if (this.state.timestampOrigin === undefined) {
            this.state.timestampOrigin = now;
            this.state.remainingTime = this.timerLengthInMs;
        }
        if (this.state.timerRunning === false) {
            this.state.timerRunning = true;
            this.state.timestampLastStart = now;
            this.state.timerInstance = setTimeout(() => {
                this.state.timerInstance = setInterval(() => {
                    if (this.getRemainingTimeInMs() <= 0) {
                        this.state.remainingTime = this.getRemainingTimeInMs();
                        this.onComplete();
                        this.endTimer();
                    }
                    else if (this.onInterval) {
                        this.onInterval(this.getTime("mm:ss"));
                    }
                }, this.timerIntervalInMs);
            }, this.getRemainingTimeInMs() % 1000);
        }
    }
    endTimer() {
        if (this.state.timerRunning === true) {
            const now = this.getCurrentDateInMs();
            this.state.timestampLastStop = now;
            this.state.timerRunning = false;
            this.state.remainingTime = this.getRemainingTimeInMs();
            try {
                clearInterval(this.state.timerInstance);
            }
            catch (e) {
                clearTimeout(this.state.timerInstance);
            }
        }
    }
    getRemainingTimeInMs() {
        let remainingTime;
        if (this.state.timerRunning === true) {
            const now = this.getCurrentDateInMs();
            const timeSinceLastStart = now - this.state.timestampLastStart;
            remainingTime = this.state.remainingTime - (now - this.state.timestampLastStart);
            console.log(remainingTime);
        }
        else {
            remainingTime = this.state.remainingTime;
        }
        // disallow negative values
        if (remainingTime < 0) {
            remainingTime = 0;
        }
        return remainingTime;
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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ParticipantDataService {
    constructor(backendAdapter) {
        this.participantData = {};
        this.backendAdapter = backendAdapter;
    }
    setData(data) {
        this.participantData = this.mergeDataObjects(this.participantData, data);
    }
    endDataCollection() {
        this.uploadData(this.participantData);
    }
    addTaskData(taskData) {
        this.participantData.task_data.push(taskData);
    }
    uploadData(data) {
        const dataAsJSON = JSON.stringify(data);
        this.backendAdapter.postData(dataAsJSON).then((res) => {
            // FIXME: does failed request raise exception?
            //    if no, need to handle in this fn
            console.log("data posted");
        }).catch((err) => {
            console.log("err");
            this.handleDataUploadError();
        });
    }
    handleDataUploadError() {
        // Implement me
    }
    ;
    mergeDataObjects(target, source) {
        return Object.assign(target, source);
    }
}
exports.default = ParticipantDataService;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const countdown_timer_1 = __webpack_require__(2);
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
            timerIntervalInMs: 1000,
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


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class UserInterfaceAdapter {
    connectToController(studyController) {
        this.studyController = studyController;
    }
    runTask(task) {
        return new Promise((resolve, reject) => {
            // TODO: Implement me
            resolve();
        });
    }
    promptUser(options) {
        return new Promise((resolve, reject) => {
            // TODO: Implement
            resolve();
        });
    }
    setDisplay(options) {
        return new Promise((resolve, reject) => {
            // TODO: Implement
            resolve();
        });
    }
    updateTime(time) {
    }
    constructor() {
    }
}
exports.default = UserInterfaceAdapter;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMWY3NzA3YjZiZDZhMWYxMTI5ZTkiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9iYWNrZW5kLWFkYXB0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9jb3VudGRvd24tdGltZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9wYXJ0aWNpcGFudC1kYXRhLXNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9zdHVkeS1jb250cm9sbGVyLmpzIiwid2VicGFjazovLy8uL3NjcmlwdHMvdXNlci1pbnRlcmZhY2UtYWRhcHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUNoRUE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7OztBQ2REO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBOzs7Ozs7OztBQ1pBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixlQUFlLEdBQUcsZUFBZTtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNwSUE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMWY3NzA3YjZiZDZhMWYxMTI5ZTkiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBzdHVkeV9jb250cm9sbGVyXzEgPSByZXF1aXJlKFwiLi9zdHVkeS1jb250cm9sbGVyXCIpO1xyXG5jb25zdCB1c2VyX2ludGVyZmFjZV9hZGFwdGVyXzEgPSByZXF1aXJlKFwiLi91c2VyLWludGVyZmFjZS1hZGFwdGVyXCIpO1xyXG5jb25zdCBwYXJ0aWNpcGFudF9kYXRhX3NlcnZpY2VfMSA9IHJlcXVpcmUoXCIuL3BhcnRpY2lwYW50LWRhdGEtc2VydmljZVwiKTtcclxuY29uc3QgYmFja2VuZF9hZGFwdGVyXzEgPSByZXF1aXJlKFwiLi9iYWNrZW5kLWFkYXB0ZXJcIik7XHJcbmxldCBjb250cm9sbGVyO1xyXG5jb25zdCBiYWNrZW5kQWRhcHRlciA9IG5ldyBiYWNrZW5kX2FkYXB0ZXJfMS5kZWZhdWx0KCk7XHJcbmNvbnN0IHBhcnRpY2lwYW50RGF0YVNlcnZpY2UgPSBuZXcgcGFydGljaXBhbnRfZGF0YV9zZXJ2aWNlXzEuZGVmYXVsdChiYWNrZW5kQWRhcHRlcik7XHJcbmNvbnN0IHVzZXJJbnRlcmZhY2VBZGFwdGVyID0gbmV3IHVzZXJfaW50ZXJmYWNlX2FkYXB0ZXJfMS5kZWZhdWx0KCk7XHJcbmJhY2tlbmRBZGFwdGVyLmdldENvbmRpdGlvbigpLnRoZW4oKGNvbmRpdGlvbikgPT4ge1xyXG4gICAgY29udHJvbGxlciA9IG5ldyBzdHVkeV9jb250cm9sbGVyXzEuZGVmYXVsdChjb25kaXRpb24sIHVzZXJJbnRlcmZhY2VBZGFwdGVyLCBwYXJ0aWNpcGFudERhdGFTZXJ2aWNlKTtcclxuICAgIHVzZXJJbnRlcmZhY2VBZGFwdGVyLmNvbm5lY3RUb0NvbnRyb2xsZXIoY29udHJvbGxlcik7XHJcbiAgICBjb250cm9sbGVyLnJ1blN0dWR5KCk7XHJcbn0pO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NjcmlwdHMvYXBwLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNsYXNzIEJhY2tlbmRBZGFwdGVyIHtcclxuICAgIC8vIFRPRE86IGltcGxlbWVudFxyXG4gICAgcG9zdERhdGEoanNvbikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGpzb24pO1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxuICAgIGdldENvbmRpdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBCYWNrZW5kQWRhcHRlcjtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zY3JpcHRzL2JhY2tlbmQtYWRhcHRlci5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jbGFzcyBDb3VudGRvd25UaW1lciB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICB0aW1lc3RhbXBPcmlnaW46IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgdGltZXN0YW1wTGFzdFN0YXJ0OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIHRpbWVzdGFtcExhc3RTdG9wOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIHJlbWFpbmluZ1RpbWU6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgdGltZXJSdW5uaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgdGltZXJJbnN0YW5jZTogdW5kZWZpbmVkXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoIWNvbmZpZy50aW1lckludGVydmFsSW5Ncykge1xyXG4gICAgICAgICAgICB0aGlzLnRpbWVySW50ZXJ2YWxJbk1zID0gMTAwMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudGltZXJJbnRlcnZhbEluTXMgPSBjb25maWcudGltZXJJbnRlcnZhbEluTXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb25maWcub25JbnRlcnZhbENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25JbnRlcnZhbCA9IGNvbmZpZy5vbkludGVydmFsQ2FsbGJhY2s7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9uSW50ZXJ2YWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGltZXJMZW5ndGhJbk1zID0gdGhpcy5ub3JtYWxpemVUaW1lckxlbmd0aChjb25maWcudGltZXJMZW5ndGgpO1xyXG4gICAgICAgIHRoaXMub25Db21wbGV0ZSA9IGNvbmZpZy5vbkNvbXBsZXRlQ2FsbGJhY2s7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5yZW1haW5pbmdUaW1lID0gdGhpcy50aW1lckxlbmd0aEluTXM7XHJcbiAgICB9XHJcbiAgICBnZXRUaW1lKGZvcm1hdCkge1xyXG4gICAgICAgIGNvbnN0IG1pbGlzZWNvbmRzID0gdGhpcy5nZXRSZW1haW5pbmdUaW1lSW5NcygpO1xyXG4gICAgICAgIGNvbnN0IHNlY29uZHMgPSBNYXRoLmZsb29yKG1pbGlzZWNvbmRzIC8gMTAwMCk7XHJcbiAgICAgICAgY29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IobWlsaXNlY29uZHMgLyAoMTAwMCAqIDYwKSk7XHJcbiAgICAgICAgc3dpdGNoIChmb3JtYXQpIHtcclxuICAgICAgICAgICAgY2FzZSBcIm1tOnNzXCI6XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaXNwbGF5TWludXRlcyA9IHRoaXMudG9Ud29EaWdpdFN0cmluZyhtaW51dGVzKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3BsYXlTZWNvbmRzID0gdGhpcy50b1R3b0RpZ2l0U3RyaW5nKHNlY29uZHMgJSA2MCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7ZGlzcGxheU1pbnV0ZXN9OiR7ZGlzcGxheVNlY29uZHN9YDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICB0aGlzLnN0YXJ0VGltZXIoKTtcclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgdGhpcy5lbmRUaW1lcigpO1xyXG4gICAgfVxyXG4gICAgc3RhcnRUaW1lcigpIHtcclxuICAgICAgICBjb25zdCBub3cgPSB0aGlzLmdldEN1cnJlbnREYXRlSW5NcygpO1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLnRpbWVzdGFtcE9yaWdpbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudGltZXN0YW1wT3JpZ2luID0gbm93O1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnJlbWFpbmluZ1RpbWUgPSB0aGlzLnRpbWVyTGVuZ3RoSW5NcztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUudGltZXJSdW5uaW5nID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnRpbWVyUnVubmluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudGltZXN0YW1wTGFzdFN0YXJ0ID0gbm93O1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnRpbWVySW5zdGFuY2UgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUudGltZXJJbnN0YW5jZSA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRSZW1haW5pbmdUaW1lSW5NcygpIDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5yZW1haW5pbmdUaW1lID0gdGhpcy5nZXRSZW1haW5pbmdUaW1lSW5NcygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ29tcGxldGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbmRUaW1lcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLm9uSW50ZXJ2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkludGVydmFsKHRoaXMuZ2V0VGltZShcIm1tOnNzXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzLnRpbWVySW50ZXJ2YWxJbk1zKTtcclxuICAgICAgICAgICAgfSwgdGhpcy5nZXRSZW1haW5pbmdUaW1lSW5NcygpICUgMTAwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZW5kVGltZXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUudGltZXJSdW5uaW5nID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vdyA9IHRoaXMuZ2V0Q3VycmVudERhdGVJbk1zKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudGltZXN0YW1wTGFzdFN0b3AgPSBub3c7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudGltZXJSdW5uaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucmVtYWluaW5nVGltZSA9IHRoaXMuZ2V0UmVtYWluaW5nVGltZUluTXMoKTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5zdGF0ZS50aW1lckluc3RhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuc3RhdGUudGltZXJJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXRSZW1haW5pbmdUaW1lSW5NcygpIHtcclxuICAgICAgICBsZXQgcmVtYWluaW5nVGltZTtcclxuICAgICAgICBpZiAodGhpcy5zdGF0ZS50aW1lclJ1bm5pbmcgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgY29uc3Qgbm93ID0gdGhpcy5nZXRDdXJyZW50RGF0ZUluTXMoKTtcclxuICAgICAgICAgICAgY29uc3QgdGltZVNpbmNlTGFzdFN0YXJ0ID0gbm93IC0gdGhpcy5zdGF0ZS50aW1lc3RhbXBMYXN0U3RhcnQ7XHJcbiAgICAgICAgICAgIHJlbWFpbmluZ1RpbWUgPSB0aGlzLnN0YXRlLnJlbWFpbmluZ1RpbWUgLSAobm93IC0gdGhpcy5zdGF0ZS50aW1lc3RhbXBMYXN0U3RhcnQpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZW1haW5pbmdUaW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJlbWFpbmluZ1RpbWUgPSB0aGlzLnN0YXRlLnJlbWFpbmluZ1RpbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGRpc2FsbG93IG5lZ2F0aXZlIHZhbHVlc1xyXG4gICAgICAgIGlmIChyZW1haW5pbmdUaW1lIDwgMCkge1xyXG4gICAgICAgICAgICByZW1haW5pbmdUaW1lID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlbWFpbmluZ1RpbWU7XHJcbiAgICB9XHJcbiAgICAvLyBoZWxwZXIgbWV0aG9kc1xyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICB0b1R3b0RpZ2l0U3RyaW5nKG51bWJlcikge1xyXG4gICAgICAgIGlmIChudW1iZXIgPD0gOSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJzAnICsgbnVtYmVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bWJlci50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG5vcm1hbGl6ZVRpbWVyTGVuZ3RoKHRpbWVyTGVuZ3RoKSB7XHJcbiAgICAgICAgbGV0IHRpbWVyTGVuZ3RoSW5NcztcclxuICAgICAgICBjb25zdCBpbnB1dFRpbWUgPSB0aW1lckxlbmd0aFswXTtcclxuICAgICAgICBjb25zdCBpbnB1dFRpbWVGb3JtYXQgPSB0aW1lckxlbmd0aFsxXTtcclxuICAgICAgICBzd2l0Y2ggKGlucHV0VGltZUZvcm1hdCkge1xyXG4gICAgICAgICAgICBjYXNlIFwic2Vjb25kc1wiOlxyXG4gICAgICAgICAgICBjYXNlIFwic1wiOlxyXG4gICAgICAgICAgICAgICAgdGltZXJMZW5ndGhJbk1zID0gaW5wdXRUaW1lICogMTAwMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWludXRlc1wiOlxyXG4gICAgICAgICAgICBjYXNlIFwibVwiOlxyXG4gICAgICAgICAgICAgICAgdGltZXJMZW5ndGhJbk1zID0gaW5wdXRUaW1lICogMTAwMCAqIDYwO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbmNvcnJlY3QgYXJndW1lbnRzIHBhc3NlZCB0byBUaW1lckxlbmd0aFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRpbWVyTGVuZ3RoSW5NcztcclxuICAgIH1cclxuICAgIGdldEN1cnJlbnREYXRlSW5NcygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gQ291bnRkb3duVGltZXI7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc2NyaXB0cy9jb3VudGRvd24tdGltZXIuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY2xhc3MgUGFydGljaXBhbnREYXRhU2VydmljZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihiYWNrZW5kQWRhcHRlcikge1xyXG4gICAgICAgIHRoaXMucGFydGljaXBhbnREYXRhID0ge307XHJcbiAgICAgICAgdGhpcy5iYWNrZW5kQWRhcHRlciA9IGJhY2tlbmRBZGFwdGVyO1xyXG4gICAgfVxyXG4gICAgc2V0RGF0YShkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNpcGFudERhdGEgPSB0aGlzLm1lcmdlRGF0YU9iamVjdHModGhpcy5wYXJ0aWNpcGFudERhdGEsIGRhdGEpO1xyXG4gICAgfVxyXG4gICAgZW5kRGF0YUNvbGxlY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy51cGxvYWREYXRhKHRoaXMucGFydGljaXBhbnREYXRhKTtcclxuICAgIH1cclxuICAgIGFkZFRhc2tEYXRhKHRhc2tEYXRhKSB7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNpcGFudERhdGEudGFza19kYXRhLnB1c2godGFza0RhdGEpO1xyXG4gICAgfVxyXG4gICAgdXBsb2FkRGF0YShkYXRhKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YUFzSlNPTiA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG4gICAgICAgIHRoaXMuYmFja2VuZEFkYXB0ZXIucG9zdERhdGEoZGF0YUFzSlNPTikudGhlbigocmVzKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIEZJWE1FOiBkb2VzIGZhaWxlZCByZXF1ZXN0IHJhaXNlIGV4Y2VwdGlvbj9cclxuICAgICAgICAgICAgLy8gICAgaWYgbm8sIG5lZWQgdG8gaGFuZGxlIGluIHRoaXMgZm5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkYXRhIHBvc3RlZFwiKTtcclxuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZURhdGFVcGxvYWRFcnJvcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlRGF0YVVwbG9hZEVycm9yKCkge1xyXG4gICAgICAgIC8vIEltcGxlbWVudCBtZVxyXG4gICAgfVxyXG4gICAgO1xyXG4gICAgbWVyZ2VEYXRhT2JqZWN0cyh0YXJnZXQsIHNvdXJjZSkge1xyXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBQYXJ0aWNpcGFudERhdGFTZXJ2aWNlO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NjcmlwdHMvcGFydGljaXBhbnQtZGF0YS1zZXJ2aWNlLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGNvdW50ZG93bl90aW1lcl8xID0gcmVxdWlyZShcIi4vY291bnRkb3duLXRpbWVyXCIpO1xyXG5jbGFzcyBTdHVkeUNvbnRyb2xsZXIge1xyXG4gICAgY29uc3RydWN0b3IoY29uZGl0aW9uLCB1c2VySW50ZXJmYWNlQWRhcHRlciwgcGFydGljaXBhbnREYXRhU2VydmljZSkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRUYXNrOiBudWxsLFxyXG4gICAgICAgICAgICBjdXJyZW50VGFza0luZGV4OiBbMCwgMF0sXHJcbiAgICAgICAgICAgIGN1cnJlbnRUYXNrTWlzdGFrZUNvdW50OiAwLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy51c2VySW50ZXJmYWNlU3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHByb2dyZXNzOiBbW11dXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmNvbmRpdGlvbiA9IGNvbmRpdGlvbjtcclxuICAgICAgICB0aGlzLnVzZXJJbnRlcmZhY2VTdGF0ZS5wcm9ncmVzcyA9IHRoaXMuY3JlYXRlSW5pdGlhbFByb2dyZXNzQmFyU3RhdGUodGhpcy5jb25kaXRpb24pO1xyXG4gICAgICAgIHRoaXMudXNlckludGVyZmFjZUFkYXB0ZXIgPSB1c2VySW50ZXJmYWNlQWRhcHRlcjtcclxuICAgICAgICB0aGlzLnBhcnRpY2lwYW50RGF0YVNlcnZpY2UgPSBwYXJ0aWNpcGFudERhdGFTZXJ2aWNlO1xyXG4gICAgICAgIHRoaXMudGltZXIgPSBuZXcgY291bnRkb3duX3RpbWVyXzEuZGVmYXVsdCh7XHJcbiAgICAgICAgICAgIG9uQ29tcGxldGVDYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZVN0dWR5QnlUaW1lb3V0KCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uSW50ZXJ2YWxDYWxsYmFjazogKGRpc3BsYXlUaW1lKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVzZXJJbnRlcmZhY2VBZGFwdGVyLnVwZGF0ZVRpbWUoZGlzcGxheVRpbWUpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0aW1lckludGVydmFsSW5NczogMTAwMCxcclxuICAgICAgICAgICAgdGltZXJMZW5ndGg6IFt0aGlzLmNvbmRpdGlvbi50aW1lb3V0X2xlbmd0aF9pbl9zZWNvbmRzLCBcInNlY29uZHNcIl1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJ1blN0dWR5KCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3JkUGFydGljaXBhbnRJbmZvKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJ1blN0dWR5VGFza3MoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaFN0dWR5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlckludGVyZmFjZUFkYXB0ZXIucHJvbXB0VXNlcih7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBgRXJyOiAke2Vycn1gLFxyXG4gICAgICAgICAgICAgICAgYWxsb3dDb250aW51ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhbGxvd0lucHV0OiBmYWxzZSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB2YWxpZGF0ZUFuc3dlcihhbnN3ZXIpIHtcclxuICAgICAgICBjb25zdCB2YWxpZGF0ZSA9IHRoaXMuc3RhdGUuY3VycmVudFRhc2sudmFsaWRhdGlvbkZ1bmN0aW9uO1xyXG4gICAgICAgIGlmICh2YWxpZGF0ZShhbnN3ZXIpID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50VGFza01pc3Rha2VDb3VudCArPSAxO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2NyZWVuU2l6ZVRvb1NtYWxsKCkge1xyXG4gICAgICAgIHRoaXMucGF1c2VDb3VudGRvd24oKTsgLy8gcGF1c2UgY291bnRkb3duIGZvcmV2ZXJcclxuICAgICAgICB0aGlzLnVzZXJJbnRlcmZhY2VBZGFwdGVyLnByb21wdFVzZXIoe1xyXG4gICAgICAgICAgICB0ZXh0OiBcIllvdXIgc2NyZWVuIGlzIHRvbyBzbWFsbC4gUGxlYXNlIHRha2UgdGhpcyBzdHVkeSBvbiBhIGRpZmZlcmVudCBkZXZpY2UuXCIsXHJcbiAgICAgICAgICAgIGFsbG93Q29udGludWU6IGZhbHNlLFxyXG4gICAgICAgICAgICBhbGxvd0lucHV0OiBmYWxzZSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGNsb3NlU3R1ZHlCeVVzZXIoKSB7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNpcGFudERhdGFTZXJ2aWNlLnNldERhdGEoe1xyXG4gICAgICAgICAgICB1c2VyX2Nsb3NlZF9zdHVkeV9lYXJseTogdHJ1ZSxcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpbmlzaFN0dWR5KCk7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVJbml0aWFsUHJvZ3Jlc3NCYXJTdGF0ZShjb25kaXRpb24pIHtcclxuICAgICAgICBsZXQgcHJvZ3Jlc3NCYXIgPSBbXTtcclxuICAgICAgICBsZXQgdGFza3MgPSBjb25kaXRpb24udGFza3M7XHJcbiAgICAgICAgbGV0IG51bVN1YnNlY3Rpb25zID0gdGFza3MubGVuZ3RoO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtU3Vic2VjdGlvbnM7IGkrKykge1xyXG4gICAgICAgICAgICBwcm9ncmVzc0JhcltpXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRhc2tzW2ldLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9ncmVzc0JhcltpXS5wdXNoKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJvZ3Jlc3NCYXI7XHJcbiAgICB9XHJcbiAgICByZXN1bWVDb3VudGRvd24oKSB7XHJcbiAgICAgICAgdGhpcy50aW1lci5zdGFydCgpO1xyXG4gICAgfVxyXG4gICAgcGF1c2VDb3VudGRvd24oKSB7XHJcbiAgICAgICAgdGhpcy50aW1lci5zdG9wKCk7XHJcbiAgICB9XHJcbiAgICBjbG9zZVN0dWR5QnlUaW1lb3V0KCkge1xyXG4gICAgICAgIHRoaXMucGFydGljaXBhbnREYXRhU2VydmljZS5zZXREYXRhKHtcclxuICAgICAgICAgICAgdXNlcl90aW1lZF9vdXQ6IHRydWUsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maW5pc2hTdHVkeSgpO1xyXG4gICAgfVxyXG4gICAgcmVjb3JkUGFydGljaXBhbnRJbmZvKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmRpdGlvbi5wYXJ0aWNpcGFudF9leHRlcm5hbF9pZF9wcm9tcHQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgY29uc3QgdXNlcklkVHlwZSA9IHRoaXMuY29uZGl0aW9uLnBhcnRpY2lwYW50X2V4dGVybmFsX2lkX3R5cGU7XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZXJJZFByb21wdCA9IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IGBQbGVhc2UgZW50ZXIgeW91ciAke3VzZXJJZFR5cGV9IGlkOmAsXHJcbiAgICAgICAgICAgICAgICBhbGxvd0lucHV0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYWxsb3dDb250aW51ZTogdHJ1ZSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXNlckludGVyZmFjZUFkYXB0ZXIucHJvbXB0VXNlcih1c2VySWRQcm9tcHQpLnRoZW4oKHVzZXJJbmZvKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNpcGFudERhdGFTZXJ2aWNlLnNldERhdGEoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNpcGFudF9leHRlcm5hbF9pZDogdXNlckluZm8udXNlcklkLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFydGljaXBhbnREYXRhU2VydmljZS5zZXREYXRhKHtcclxuICAgICAgICAgICAgICAgIHBhcnRpY2lwYW50X2V4dGVybmFsX2lkOiBudWxsLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldFRhc2tBdEluZGV4KGluZGV4KSB7XHJcbiAgICAgICAgY29uc3QgW2ksIGpdID0gaW5kZXg7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLnRhc2tzW2ldW2pdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXRGaXJzdFRhc2soKSB7XHJcbiAgICAgICAgY29uc3QgdGFza0luZGV4ID0gdGhpcy5zdGF0ZS5jdXJyZW50VGFza0luZGV4O1xyXG4gICAgICAgIGNvbnN0IHRhc2sgPSB0aGlzLmdldFRhc2tBdEluZGV4KHRhc2tJbmRleCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50VGFzayA9IHRhc2s7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50VGFza01pc3Rha2VDb3VudCA9IDA7XHJcbiAgICAgICAgcmV0dXJuIHRhc2s7XHJcbiAgICB9XHJcbiAgICBnZXROZXh0VGFzaygpIHtcclxuICAgICAgICBjb25zdCBuZXh0VGFza0luZGV4ID0gdGhpcy5nZXROZXh0VGFza0luZGV4KHRoaXMuc3RhdGUuY3VycmVudFRhc2tJbmRleCk7XHJcbiAgICAgICAgY29uc3Qgbm9OZXh0VGFzayA9IG5leHRUYXNrSW5kZXggPT09IG51bGw7XHJcbiAgICAgICAgaWYgKG5vTmV4dFRhc2spIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB0YXNrID0gdGhpcy5nZXRUYXNrQXRJbmRleChuZXh0VGFza0luZGV4KTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50VGFza0luZGV4ID0gbmV4dFRhc2tJbmRleDtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50VGFzayA9IHRhc2s7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuY3VycmVudFRhc2tNaXN0YWtlQ291bnQgPSAwO1xyXG4gICAgICAgICAgICByZXR1cm4gdGFzaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB1cGRhdGVVc2VySW50ZXJmYWNlKCkge1xyXG4gICAgICAgIC8vIGNyZWF0ZSBwcm9ncmVzc09iamVjdCBmcm9tIGxhc3QgY29tcGxldGVkIHRhc2tcclxuICAgICAgICBjb25zdCBsYXN0Q29tcGxldGVkVGFza0luZGV4ID0gdGhpcy5nZXRQcmV2VGFza0luZGV4KHRoaXMuc3RhdGUuY3VycmVudFRhc2tJbmRleCk7XHJcbiAgICAgICAgaWYgKGxhc3RDb21wbGV0ZWRUYXNrSW5kZXggIT09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc3QgW2ksIGpdID0gbGFzdENvbXBsZXRlZFRhc2tJbmRleDtcclxuICAgICAgICAgICAgdGhpcy51c2VySW50ZXJmYWNlU3RhdGUucHJvZ3Jlc3NbaV1bal0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy51c2VySW50ZXJmYWNlQWRhcHRlci5zZXREaXNwbGF5KHtcclxuICAgICAgICAgICAgcHJvZ3Jlc3M6IHRoaXMudXNlckludGVyZmFjZVN0YXRlLnByb2dyZXNzLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZ2V0TmV4dFRhc2tJbmRleChpbmRleCkge1xyXG4gICAgICAgIGNvbnN0IGN1cnJTdWJzZWN0aW9uID0gaW5kZXhbMF07XHJcbiAgICAgICAgY29uc3QgY3VyclRhc2sgPSBpbmRleFsxXTtcclxuICAgICAgICBjb25zdCBmaW5hbFN1YnNlY3Rpb24gPSB0aGlzLmNvbmRpdGlvbi50YXNrcy5sZW5ndGggLSAxO1xyXG4gICAgICAgIGNvbnN0IGZpbmFsVGFza0luU3Vic2VjdGlvbiA9IHRoaXMuY29uZGl0aW9uLnRhc2tzW2N1cnJTdWJzZWN0aW9uXS5sZW5ndGggLSAxO1xyXG4gICAgICAgIGlmIChjdXJyVGFzayA+PSBmaW5hbFRhc2tJblN1YnNlY3Rpb24pIHtcclxuICAgICAgICAgICAgaWYgKGN1cnJTdWJzZWN0aW9uID49IGZpbmFsU3Vic2VjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgLy8gdGhhdCB3YXMgdGhlIGxhc3QgdGFza1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBtb3ZlIHRvIG5leHQgc3Vic2VjdGlvblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtjdXJyU3Vic2VjdGlvbiArIDEsIDBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBtb3ZlIHRvIG5leHQgdGFzayBpbiBzdWJzZWN0aW9uXHJcbiAgICAgICAgICAgIHJldHVybiBbY3VyclN1YnNlY3Rpb24sIGN1cnJUYXNrICsgMV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0UHJldlRhc2tJbmRleChpbmRleCkge1xyXG4gICAgICAgIGNvbnN0IGN1cnJTdWJzZWN0aW9uID0gaW5kZXhbMF07XHJcbiAgICAgICAgY29uc3QgY3VyclRhc2sgPSBpbmRleFsxXTtcclxuICAgICAgICBjb25zdCBmaXJzdFN1YnNlY3Rpb24gPSAwO1xyXG4gICAgICAgIGNvbnN0IGZpcnN0VGFza0luU3Vic2VjdGlvbiA9IDA7XHJcbiAgICAgICAgaWYgKGN1cnJUYXNrIDw9IGZpcnN0VGFza0luU3Vic2VjdGlvbikge1xyXG4gICAgICAgICAgICBpZiAoY3VyclN1YnNlY3Rpb24gPD0gZmlyc3RTdWJzZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGF0IHdhcyB0aGUgbGFzdCB0YXNrXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIG1vdmUgdG8gbGFzdCB0YXNrIGluIHByZXYgc3Vic2VjdGlvblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJldlN1YnNlY3Rpb25JbmRleCA9IGN1cnJTdWJzZWN0aW9uIC0gMTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RUYXNrSW5QcmV2U3Vic2VjdGlvbkluZGV4ID0gdGhpcy5jb25kaXRpb24udGFza3NbcHJldlN1YnNlY3Rpb25JbmRleF0ubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbcHJldlN1YnNlY3Rpb25JbmRleCwgbGFzdFRhc2tJblByZXZTdWJzZWN0aW9uSW5kZXhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBtb3ZlIHRvIG5leHQgdGFzayBpbiBzdWJzZWN0aW9uXHJcbiAgICAgICAgICAgIHJldHVybiBbY3VyclN1YnNlY3Rpb24sIGN1cnJUYXNrIC0gMV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RvcmVUYXNrRGF0YSh0YXNrRGF0YSkge1xyXG4gICAgICAgIHRoaXMucGFydGljaXBhbnREYXRhU2VydmljZS5hZGRUYXNrRGF0YSh0YXNrRGF0YSk7XHJcbiAgICB9XHJcbiAgICBydW5TdHVkeVRhc2tzKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNob3dOZXh0VGFzayA9ICh0YXNrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3VtZUNvdW50ZG93bigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ydW5UYXNrKHRhc2spLnRoZW4oKHRhc2tEYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXVzZUNvdW50ZG93bigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmVUYXNrRGF0YSh0YXNrRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dFRhc2sgPSB0aGlzLmdldE5leHRUYXNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxsVGFza3NDb21wbGV0ZSA9IG5leHRUYXNrID09PSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhbGxUYXNrc0NvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dOZXh0VGFzayhuZXh0VGFzayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0VGFzayA9IHRoaXMuZ2V0Rmlyc3RUYXNrKCk7XHJcbiAgICAgICAgICAgIHNob3dOZXh0VGFzayhmaXJzdFRhc2spO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcnVuVGFzayh0YXNrKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlVXNlckludGVyZmFjZSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBsZXQgZW5kVGltZTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXNlckludGVyZmFjZUFkYXB0ZXIucnVuVGFzayh0YXNrKS50aGVuKChhbnN3ZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBlbmRUaW1lID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXNrRGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVFbGFwc2VkOiBlbmRUaW1lLmdldFRpbWUoKSAtIHN0YXJ0VGltZS5nZXRUaW1lKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bU1pc3Rha2VzOiB0aGlzLnN0YXRlLmN1cnJlbnRUYXNrTWlzdGFrZUNvdW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrOiB0YXNrLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrSW5kZXg6IHRoaXMuc3RhdGUuY3VycmVudFRhc2tJbmRleCxcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGFza0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZ2V0VmFsaWRhdGlvbklEKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIHJhbmRTdHJpbmcoKSB7XHJcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gXCJcIjtcclxuICAgICAgICAgICAgY29uc3QgcG9zc2libGUgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5XCI7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0ICs9IHBvc3NpYmxlLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwb3NzaWJsZS5sZW5ndGgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGAke3JhbmRTdHJpbmcoKX0tJHt0aGlzLmNvbmRpdGlvbi5jb25kaXRpb25faWR9YDtcclxuICAgIH1cclxuICAgIGZpbmlzaFN0dWR5KCkge1xyXG4gICAgICAgIGNvbnN0IHZhbGlkYXRpb25JRCA9IHRoaXMuZ2V0VmFsaWRhdGlvbklEKCk7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNpcGFudERhdGFTZXJ2aWNlLnNldERhdGEoe1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uX2lkOiB2YWxpZGF0aW9uSUQsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNpcGFudERhdGFTZXJ2aWNlLmVuZERhdGFDb2xsZWN0aW9uKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVVc2VySW50ZXJmYWNlKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlckludGVyZmFjZUFkYXB0ZXIucHJvbXB0VXNlcih7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBgVGhlIHN0dWR5IGlzIG92ZXIuIEhlcmUgaXMgeW91ciB2YWxpZGF0aW9uIElEOiAke3ZhbGlkYXRpb25JRH1gLFxyXG4gICAgICAgICAgICAgICAgYWxsb3dDb250aW51ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhbGxvd0lucHV0OiBmYWxzZSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gU3R1ZHlDb250cm9sbGVyO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NjcmlwdHMvc3R1ZHktY29udHJvbGxlci5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jbGFzcyBVc2VySW50ZXJmYWNlQWRhcHRlciB7XHJcbiAgICBjb25uZWN0VG9Db250cm9sbGVyKHN0dWR5Q29udHJvbGxlcikge1xyXG4gICAgICAgIHRoaXMuc3R1ZHlDb250cm9sbGVyID0gc3R1ZHlDb250cm9sbGVyO1xyXG4gICAgfVxyXG4gICAgcnVuVGFzayh0YXNrKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgLy8gVE9ETzogSW1wbGVtZW50IG1lXHJcbiAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHByb21wdFVzZXIob3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIC8vIFRPRE86IEltcGxlbWVudFxyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzZXREaXNwbGF5KG9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBUT0RPOiBJbXBsZW1lbnRcclxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlVGltZSh0aW1lKSB7XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBVc2VySW50ZXJmYWNlQWRhcHRlcjtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zY3JpcHRzL3VzZXItaW50ZXJmYWNlLWFkYXB0ZXIuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==