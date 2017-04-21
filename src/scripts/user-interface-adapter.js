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
