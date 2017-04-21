import StudyController from "./study-controller";
import CountdownTimer from "./countdown-timer";
import UserInterfaceAdapter from "./user-interface-adapter";
import ParticipantDataService from "./participant-data-service";
import BackendAdapter from "./backend-adapter";

import ConditionObject from "./typedefs/condition-object";

let controller: StudyController;

const backendAdapter = new BackendAdapter();
const participantDataService = new ParticipantDataService(backendAdapter);
const userInterfaceAdapter = new UserInterfaceAdapter();

backendAdapter.getCondition().then( (condition) => {
  controller = new StudyController(condition, userInterfaceAdapter, participantDataService);
  userInterfaceAdapter.connectToController(controller);

  controller.runStudy();
});