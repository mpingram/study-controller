import MockUserInterfaceResponse from "../typedefs/mock-user-interface-response";

import TaskObject from "../../src/scripts/typedefs/task-object";
import TaskDataObject from "../../src/scripts/typedefs/task-data-object";
import TaskIndex from "../../src/scripts/typedefs/task-index";

const createRandomTasks = (): {tasks: TaskObject[][], dummyResponses: MockUserInterfaceResponse[], expectedTaskData: TaskDataObject[]} => {
    
  let tasks: TaskObject[][] = [];
  let dummyResponses: MockUserInterfaceResponse[] = [];
  let expectedTaskData: TaskDataObject[] = [];

  const MAX_SUBSECTIONS = 3;
  const MAX_TASKS_PER_SUBSECTION = 3;
  const MAX_MOCK_TASK_RESPONSES = 4;
  const MAX_MOCK_TASK_RESPONSE_TIME = 1000;

  const randomIntLessThan = (max: number): number => Math.ceil(Math.random() * max);

  const createRandomTask = (taskIndex: TaskIndex): {task: TaskObject, taskResponses: MockUserInterfaceResponse[], taskData: TaskDataObject} => {
    let task: TaskObject;
    let taskResponses: MockUserInterfaceResponse[];
    let taskData: TaskDataObject;

    const maxResponses = MAX_MOCK_TASK_RESPONSES;
    const maxResponseTime = MAX_MOCK_TASK_RESPONSE_TIME;

    const numResponses = Math.ceil(Math.random() * maxResponses);
    const taskQuestion = `Question ${taskIndex[0]}-${taskIndex[1]}`;
    const responseTime = randomResponseTime();

    function randomResponseTime(): number {
      return Math.ceil(Math.random() * maxResponseTime);
    }

    function createTaskResponses(numResponses: number, responseTime: number, task: TaskObject, taskIndex: TaskIndex): MockUserInterfaceResponse[] {
      let responses: MockUserInterfaceResponse[] = [];
      const lastIndex = numResponses - 1;
      for (let i = 0; i < numResponses; i ++ ){
        responses.push({
          answer: i === lastIndex ? true : false,
          responseTimeInMs: responseTime,
          task: task,
          taskIndex: taskIndex,
        });
      }
      return responses;
    }

    task = {
      question: taskQuestion,
      validationFunction: (response: boolean): boolean => response === true,
    };
    taskResponses = createTaskResponses(numResponses, responseTime, task, taskIndex);
    taskData = {
      answer: true,
      numMistakes: numResponses - 1,
      task: task,
      taskIndex: taskIndex,
      timeElapsed: responseTime * numResponses
    };

    return {task, taskResponses, taskData};
  };


  // fill in tasks, dummy responses, and expected task data
  const numSubsections = randomIntLessThan(MAX_SUBSECTIONS);
  for (let subsectionIndex = 0; subsectionIndex < numSubsections; subsectionIndex++ ){
    tasks[subsectionIndex] = [];
    const numTasks = randomIntLessThan(MAX_TASKS_PER_SUBSECTION);
    for (let taskIndex = 0; taskIndex < numTasks; taskIndex++ ){
      const {task, taskResponses, taskData} = createRandomTask([subsectionIndex, taskIndex]);
      tasks[subsectionIndex].push(task);
      dummyResponses = dummyResponses.concat(taskResponses);
      expectedTaskData.push(taskData);
    }
  };



  return {tasks, dummyResponses, expectedTaskData};
};

export default createRandomTasks;