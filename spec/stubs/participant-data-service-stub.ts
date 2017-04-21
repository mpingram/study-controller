import IParticipantDataService from "../../src/scripts/typedefs/participant-data-service";

import ISpy from "../typedefs/spy";

import ParticipantDataObject from "../../src/scripts/typedefs/participant-data-object";
import TaskDataObject from "../../src/scripts/typedefs/task-data-object";

export default class ParticipantDataServiceStub implements IParticipantDataService {

  setData(newData: ParticipantDataObject){
    this.reporter.report(this.setData, newData);
    this.participantData = this.mergeDataObjects(this.participantData, newData);
  }

  addTaskData(taskData: TaskDataObject){
    this.reporter.report(this.addTaskData, taskData);
    if (this.participantData.task_data === undefined){
      this.participantData.task_data = [taskData];
    } else {
      this.participantData.task_data.push(taskData); 
    }
  }

  endDataCollection(){
    this.reporter.report(this.endDataCollection, this.participantData);
  }

  constructor(reporter: ISpy){
    this.reporter = reporter;
  }

  private reporter: ISpy;

  private participantData: ParticipantDataObject = {};

  private mergeDataObjects(target: ParticipantDataObject, source: ParticipantDataObject): ParticipantDataObject {
    return Object.assign(target, source);
  }
}