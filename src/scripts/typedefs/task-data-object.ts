import TaskObject from "./task-object";
import TaskIndex from "./task-index";

interface TaskDataObject {
  answer?: any,
  task: TaskObject,
  taskIndex: TaskIndex,
  timeElapsed: number,
  numMistakes: number,
}

export default TaskDataObject;