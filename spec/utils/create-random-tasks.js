"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createRandomTasks = () => {
    let tasks = [];
    let dummyResponses = [];
    let expectedTaskData = [];
    const MAX_SUBSECTIONS = 3;
    const MAX_TASKS_PER_SUBSECTION = 3;
    const MAX_MOCK_TASK_RESPONSES = 4;
    const MAX_MOCK_TASK_RESPONSE_TIME = 1000;
    const randomIntLessThan = (max) => Math.ceil(Math.random() * max);
    const createRandomTask = (taskIndex) => {
        let task;
        let taskResponses;
        let taskData;
        const maxResponses = MAX_MOCK_TASK_RESPONSES;
        const maxResponseTime = MAX_MOCK_TASK_RESPONSE_TIME;
        const numResponses = Math.ceil(Math.random() * maxResponses);
        const taskQuestion = `Question ${taskIndex[0]}-${taskIndex[1]}`;
        const responseTime = randomResponseTime();
        function randomResponseTime() {
            return Math.ceil(Math.random() * maxResponseTime);
        }
        function createTaskResponses(numResponses, responseTime, task, taskIndex) {
            let responses = [];
            const lastIndex = numResponses - 1;
            for (let i = 0; i < numResponses; i++) {
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
            validationFunction: (response) => response === true,
        };
        taskResponses = createTaskResponses(numResponses, responseTime, task, taskIndex);
        taskData = {
            answer: true,
            numMistakes: numResponses - 1,
            task: task,
            taskIndex: taskIndex,
            timeElapsed: responseTime * numResponses
        };
        return { task, taskResponses, taskData };
    };
    // fill in tasks, dummy responses, and expected task data
    const numSubsections = randomIntLessThan(MAX_SUBSECTIONS);
    for (let subsectionIndex = 0; subsectionIndex < numSubsections; subsectionIndex++) {
        tasks[subsectionIndex] = [];
        const numTasks = randomIntLessThan(MAX_TASKS_PER_SUBSECTION);
        for (let taskIndex = 0; taskIndex < numTasks; taskIndex++) {
            const { task, taskResponses, taskData } = createRandomTask([subsectionIndex, taskIndex]);
            tasks[subsectionIndex].push(task);
            dummyResponses = dummyResponses.concat(taskResponses);
            expectedTaskData.push(taskData);
        }
    }
    ;
    return { tasks, dummyResponses, expectedTaskData };
};
exports.default = createRandomTasks;
