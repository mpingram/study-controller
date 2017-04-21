"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const study_controller_1 = require("./study-controller");
const user_interface_adapter_1 = require("./user-interface-adapter");
const participant_data_service_1 = require("./participant-data-service");
const backend_adapter_1 = require("./backend-adapter");
let controller;
const backendAdapter = new backend_adapter_1.default();
const participantDataService = new participant_data_service_1.default(backendAdapter);
const userInterfaceAdapter = new user_interface_adapter_1.default();
backendAdapter.getCondition().then((condition) => {
    controller = new study_controller_1.default(condition, userInterfaceAdapter, participantDataService);
    userInterfaceAdapter.connectToController(controller);
    controller.runStudy();
});
