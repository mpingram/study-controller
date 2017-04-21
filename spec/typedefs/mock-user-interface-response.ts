import TaskObject from "../../src/scripts/typedefs/task-object";
import TaskIndex from "../../src/scripts/typedefs/task-index";

interface MockUserInterfaceResponse{
  task: TaskObject;
  taskIndex: TaskIndex;
  answer: any;
  responseTimeInMs: number;
};

export default MockUserInterfaceResponse;