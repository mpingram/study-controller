import IUserInterfaceAdapter from "./typedefs/user-interface-adapter";

import StudyController from "./study-controller";

import TaskObject from "./typedefs/task-object";
import UserInterfacePromptOptions from "./typedefs/user-interface-prompt-options";
import UserInterfaceDisplayOptions from "./typedefs/user-interface-display-options";

export default class UserInterfaceAdapter implements IUserInterfaceAdapter {

  public connectToController(studyController: StudyController): void{
    this.studyController = studyController;
  }

  public runTask(task: TaskObject): Promise<any> {
    return new Promise( (resolve, reject) => {
      // TODO: Implement me
      resolve();
    });
  }

  public promptUser(options: UserInterfacePromptOptions): Promise<any> {
    return new Promise( (resolve, reject) => {
      // TODO: Implement
      resolve();
    });
  }

  public setDisplay(options: UserInterfaceDisplayOptions): Promise<any> {
    return new Promise( (resolve, reject) => {
      // TODO: Implement
      resolve();
    });
  }

  public updateTime(time: string): void {

  }


  constructor(){
  }


  private studyController: StudyController;

}