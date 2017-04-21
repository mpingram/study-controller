import IBackendAdapter from "./typedefs/backend-adapter";
import ConditionObject from "./typedefs/condition-object";

export default class BackendAdapter implements IBackendAdapter {

  // TODO: implement
  public postData(json: string): Promise<any> {
    console.log(json);
    return Promise.resolve();
  }

  public getCondition(): Promise<ConditionObject> {
    return Promise.resolve({} as ConditionObject);
  }
}

