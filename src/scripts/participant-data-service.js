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
