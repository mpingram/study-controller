"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DEFAULT_RESPONSE_TIME = 1000;
class MockUserInterfaceAdapterStub {
    connectToController(studyController) {
        this.studyController = studyController;
    }
    runTask(task) {
        this.reporter.report(this.runTask, task);
        return new Promise((resolve, reject) => {
            const tryNextAnswer = (onAccepted) => {
                const answerObject = this.getNextAnswer();
                setTimeout(() => {
                    const accepted = this.validateAnswer(answerObject.answer);
                    if (accepted === true) {
                        onAccepted(answerObject.answer);
                    }
                    else {
                        tryNextAnswer(onAccepted);
                    }
                }, answerObject.responseTimeInMs);
            };
            const onAcceptedCallback = (answer) => {
                resolve(answer);
            };
            tryNextAnswer(onAcceptedCallback);
        });
    }
    promptUser(promptOptions) {
        this.reporter.report(this.promptUser, promptOptions);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.userInfoAnswer);
            }, DEFAULT_RESPONSE_TIME);
        });
    }
    setDisplay(displayOptions) {
        this.reporter.report(this.setDisplay, displayOptions);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, DEFAULT_RESPONSE_TIME);
        });
    }
    updateTime(timeString) {
        this.reporter.report(this.updateTime, timeString);
    }
    constructor(reporter, taskAnswers, userInfoAnswer) {
        this.reporter = reporter;
        this.taskAnswers = taskAnswers;
        this.userInfoAnswer = userInfoAnswer;
    }
    getNextAnswer() {
        return this.taskAnswers.shift();
    }
    validateAnswer(answer) {
        if (this.studyController === undefined) {
            throw new Error("No study controller connected");
        }
        else {
            return this.studyController.validateAnswer(answer);
        }
    }
}
exports.default = MockUserInterfaceAdapterStub;
