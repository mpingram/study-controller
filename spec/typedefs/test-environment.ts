import ConditionObject from "../../src/scripts/typedefs/condition-object";
import ParticipantDataObject from "../../src/scripts/typedefs/participant-data-object";
import IUserInterfaceAdapter from "../../src/scripts/typedefs/user-interface-adapter";
import IParticipantDataService from "../../src/scripts/typedefs/participant-data-service";
import ISpy from "../typedefs/spy";

interface TestEnvironment {
  condition: ConditionObject,
  expectedParticipantData: ParticipantDataObject,
  userInterfaceAdapter: IUserInterfaceAdapter,
  participantDataService: IParticipantDataService,
  spyUserInterfaceAdapter: ISpy,
  spyParticipantDataService: ISpy,
};

export default TestEnvironment;