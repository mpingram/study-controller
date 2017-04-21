import TaskDataObject from "./task-data-object";
import ConditionObject from "./condition-object";

interface ParticipantDataObject {
  condition?: ConditionObject;

  participant_external_id?: string;
  validation_id?: string;

  overall_time_start?: Date;
  overall_time_end?: Date;
  task_data?: TaskDataObject[];
  
  user_closed_study_early?: boolean;
  user_timed_out?: boolean;
}

export default ParticipantDataObject;