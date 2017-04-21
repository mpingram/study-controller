interface TaskObject {
  question: any;
  validationFunction: (answer: any) => boolean;
}

export default TaskObject;
