import IUserInterfaceAdapter from "../../src/scripts/typedefs/user-interface-adapter";

import StudyController from "../../src/scripts/study-controller";
import TaskObject from "../../src/scripts/typedefs/task-object";
import UserInfoObject from "../../src/scripts/typedefs/user-info-object";
import UserInterfacePromptOptions from "../../src/scripts/typedefs/user-interface-prompt-options";
import UserInterfaceDisplayOptions from "../../src/scripts/typedefs/user-interface-display-options";

import ISpy from "../typedefs/spy";
import MockUserInterfaceResponse from "../typedefs/mock-user-interface-response";

const DEFAULT_RESPONSE_TIME = 1000;

export default class MockUserInterfaceAdapterStub implements IUserInterfaceAdapter {
  
  connectToController(studyController: StudyController): void {
    this.studyController = studyController;
  }

  runTask(task: TaskObject): Promise<any> {
    this.reporter.report(this.runTask, task);
    return new Promise( (resolve, reject) => {

      const tryNextAnswer = (onAccepted: Function): void => {
        const answerObject: MockUserInterfaceResponse = this.getNextAnswer();
        setTimeout( () => {
          const accepted: boolean = this.validateAnswer(answerObject.answer);
          if(accepted === true){
            onAccepted(answerObject.answer)
          } else {
            tryNextAnswer(onAccepted);
          }
        }, answerObject.responseTimeInMs);

      };
      const onAcceptedCallback = (answer: any) => {
        resolve(answer);
      }

      tryNextAnswer(onAcceptedCallback);

    });
  }

  promptUser(promptOptions: UserInterfacePromptOptions): Promise<UserInfoObject>{
    this.reporter.report(this.promptUser, promptOptions);
    return new Promise( (resolve, reject) => {
      setTimeout( () => {
        resolve(this.userInfoAnswer);
      }, DEFAULT_RESPONSE_TIME);
    });
  }

  setDisplay(displayOptions: UserInterfaceDisplayOptions): Promise<any> {
    this.reporter.report(this.setDisplay, displayOptions);
    return new Promise( (resolve, reject) => {
      setTimeout( () => {
        resolve();
      }, DEFAULT_RESPONSE_TIME);
    });
  }

  updateTime(timeString: string){
    this.reporter.report(this.updateTime, timeString);
  }


  constructor(reporter: ISpy, taskAnswers: MockUserInterfaceResponse[], userInfoAnswer: UserInfoObject){
    this.reporter = reporter;
    this.taskAnswers = taskAnswers;
    this.userInfoAnswer = userInfoAnswer;
  }

  private studyController: StudyController;

  private reporter: ISpy;
  private taskAnswers: MockUserInterfaceResponse[];
  private userInfoAnswer: UserInfoObject;

  private getNextAnswer(): MockUserInterfaceResponse {
    return this.taskAnswers.shift();
  }

  private validateAnswer(answer: any): boolean {
    if (this.studyController === undefined){
      throw new Error("No study controller connected");
    } else {
      return this.studyController.validateAnswer(answer);
    }
  }
}