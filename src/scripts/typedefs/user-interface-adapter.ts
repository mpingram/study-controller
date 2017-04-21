import StudyController from "../study-controller";
import TaskObject from "./task-object";
import UserInfoObject from "./user-info-object";
import UserInterfacePromptOptions from "./user-interface-prompt-options";
import UserInterfaceDisplayOptions from "./user-interface-display-options";


interface IUserInterfaceAdapter {
  runTask(task: TaskObject): Promise<any>;
  promptUser(promptOptions: UserInterfacePromptOptions): Promise<UserInfoObject>;
  setDisplay(displayOptions: UserInterfaceDisplayOptions): Promise<any>;
  updateTime(timeString: string): void;
  connectToController(controller: StudyController): void;
}

export default IUserInterfaceAdapter;