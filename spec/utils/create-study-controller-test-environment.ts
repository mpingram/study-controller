import ParticipantDataServiceStub from "../stubs/participant-data-service-stub";
import UserInterfaceAdapterStub from "../stubs/user-interface-adapter-stub";

import TestEnvironment from "../typedefs/test-environment";
import ISpy from "../typedefs/spy";
import createRandomTasks from "./create-random-tasks";

import ConditionObject from "../../src/scripts/typedefs/condition-object";

const createStudyControllerTestEnvironment = (condition: ConditionObject,
                                              userInterfaceAdapterSpy: ISpy, 
                                              participantDataServiceSpy: ISpy): TestEnvironment => {

  const TEST_PARTICIPANT_ID = "Test_User"
  const {tasks, dummyResponses, expectedTaskData} = createRandomTasks();
  // copy condition object and assign the newly generated tasks to the new condition
  const newCondition = Object.assign({}, condition);
  newCondition.tasks = tasks;

  const testEnv: TestEnvironment = {
    condition: newCondition,
    expectedParticipantData: {
      condition: newCondition,
      participant_external_id: TEST_PARTICIPANT_ID,
      task_data: expectedTaskData,
    },
    userInterfaceAdapter: new UserInterfaceAdapterStub(userInterfaceAdapterSpy, dummyResponses, {userId: TEST_PARTICIPANT_ID}),
    participantDataService: new ParticipantDataServiceStub(participantDataServiceSpy),
    spyUserInterfaceAdapter: userInterfaceAdapterSpy,
    spyParticipantDataService: participantDataServiceSpy
  };

  return testEnv;
}

export default createStudyControllerTestEnvironment;