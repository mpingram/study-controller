import ConditionObject from "./condition-object";

interface IBackendAdapter {
  postData: (json: string) => Promise<any>;
  getCondition: () => Promise<ConditionObject>;
}

export default IBackendAdapter;