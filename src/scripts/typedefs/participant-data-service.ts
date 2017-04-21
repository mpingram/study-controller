import ParticipantDataObject from "./participant-data-object";
import TaskDataObject from "./task-data-object";

interface IParticipantDataService {
  setData: (data: ParticipantDataObject) => void;
  addTaskData: (task: TaskDataObject) => void;
  endDataCollection: () => void;
}

export default IParticipantDataService;