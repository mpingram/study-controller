import IParticipantDataService from "./typedefs/participant-data-service";
import IBackendAdapter from "./typedefs/backend-adapter";

import ParticipantDataObject from "./typedefs/participant-data-object";
import TaskDataObject from "./typedefs/task-data-object";

export default class ParticipantDataService implements IParticipantDataService {
  
  public setData(data: ParticipantDataObject): void {
    this.participantData = this.mergeDataObjects(this.participantData, data);
  }
  public endDataCollection(): void {
    this.uploadData(this.participantData);
  }

  public addTaskData(taskData: TaskDataObject): void {
    this.participantData.task_data.push(taskData);
  }

  constructor(backendAdapter: IBackendAdapter){
    this.backendAdapter = backendAdapter;
  }

  private backendAdapter: IBackendAdapter;
  private participantData: ParticipantDataObject = {};

  private uploadData(data: ParticipantDataObject): void {
    const dataAsJSON = JSON.stringify(data);
    this.backendAdapter.postData(dataAsJSON).then( (res) => {
      // FIXME: does failed request raise exception?
      //    if no, need to handle in this fn
      console.log("data posted")
    }).catch( (err) => {
      console.log("err");
      this.handleDataUploadError();
    });
  }

  private handleDataUploadError(){
    // Implement me
  };

  private mergeDataObjects(target: ParticipantDataObject, source: ParticipantDataObject): ParticipantDataObject {
    return Object.assign(target, source);
  }

}