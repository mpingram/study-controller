"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const participant_data_service_stub_1 = require("../stubs/participant-data-service-stub");
const user_interface_adapter_stub_1 = require("../stubs/user-interface-adapter-stub");
const create_random_tasks_1 = require("./create-random-tasks");
const createStudyControllerTestEnvironment = (condition, userInterfaceAdapterSpy, participantDataServiceSpy) => {
    const TEST_PARTICIPANT_ID = "Test_User";
    const { tasks, dummyResponses, expectedTaskData } = create_random_tasks_1.default();
    // copy condition object and assign the newly generated tasks to the new condition
    const newCondition = Object.assign({}, condition);
    newCondition.tasks = tasks;
    const testEnv = {
        condition: newCondition,
        expectedParticipantData: {
            condition: newCondition,
            participant_external_id: TEST_PARTICIPANT_ID,
            task_data: expectedTaskData,
        },
        userInterfaceAdapter: new user_interface_adapter_stub_1.default(userInterfaceAdapterSpy, dummyResponses, { userId: TEST_PARTICIPANT_ID }),
        participantDataService: new participant_data_service_stub_1.default(participantDataServiceSpy),
        spyUserInterfaceAdapter: userInterfaceAdapterSpy,
        spyParticipantDataService: participantDataServiceSpy
    };
    return testEnv;
};
exports.default = createStudyControllerTestEnvironment;
