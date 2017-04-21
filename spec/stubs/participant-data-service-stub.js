"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ParticipantDataServiceStub {
    constructor(reporter) {
        this.participantData = {};
        this.reporter = reporter;
    }
    setData(newData) {
        this.reporter.report(this.setData, newData);
        this.participantData = this.mergeDataObjects(this.participantData, newData);
    }
    addTaskData(taskData) {
        this.reporter.report(this.addTaskData, taskData);
        if (this.participantData.task_data === undefined) {
            this.participantData.task_data = [taskData];
        }
        else {
            this.participantData.task_data.push(taskData);
        }
    }
    endDataCollection() {
        this.reporter.report(this.endDataCollection, this.participantData);
    }
    mergeDataObjects(target, source) {
        return Object.assign(target, source);
    }
}
exports.default = ParticipantDataServiceStub;
