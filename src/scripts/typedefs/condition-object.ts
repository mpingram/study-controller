import TaskObject from "./task-object";

interface ConditionObject {
  condition_id: string;
  condition_name: string;
  tasks: Array<Array<TaskObject>>;

  participant_external_id_type: string | null;
  participant_external_id_prompt: boolean | null;

  timeout_length_in_seconds: number;
  exit_button_visible: boolean;
  ending_redirect_url: string;
}

export default ConditionObject;

