"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const study_controller_1 = require("../src/scripts/study-controller");
const create_study_controller_test_environment_1 = require("./utils/create-study-controller-test-environment");
const deep_object_compare_1 = require("./utils/deep-object-compare");
jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;
describe("StudyController", () => {
    describe("data output", () => {
        let study;
        let conditionConfig = {
            // tasks will be filled in by createStudyControllerTestEnv()
            tasks: undefined,
            condition_id: "condition_id",
            condition_name: "condition_name",
            ending_redirect_url: "ending_redirect_url",
            exit_button_visible: true,
            participant_external_id_prompt: true,
            participant_external_id_type: "MTurk",
            timeout_length_in_seconds: 9000,
        };
        function setUpTestEnv(conditionConfig, onDataCollected) {
            const userInterfaceAdapterSpy = {
                report: (methodReference, ...parameters) => {
                    switch (methodReference.name) {
                        case "runTask":
                            const task = parameters[0];
                            //console.log(` > ${task.question}`);
                            break;
                        case "promptUser":
                            const promptOptions = parameters[0];
                            //console.log(` > ${promptOptions.text}`);
                            break;
                        case "updateTime":
                            //console.log(`:${parameters[0]}`);
                            break;
                        case "setDisplay":
                            printProgress(parameters[0].progress);
                            break;
                    }
                }
            };
            function printProgress(progress) {
                console.log(":: == Progress ==");
                for (let i = 0; i < progress.length; i++) {
                    let rowString = ":: [";
                    for (let j = 0; j < progress[i].length; j++) {
                        const indicator = progress[i][j] === true ? "0" : "-";
                        rowString += indicator;
                    }
                    rowString += "]";
                    console.log(rowString);
                }
                console.log(":: ==============");
            }
            const participantDataServiceSpy = {
                report: (methodReference, ...parameters) => {
                    switch (methodReference.name) {
                        case "setData":
                        case "addTask":
                            //console.log(JSON.stringify(parameters[0], null, 2));
                            break;
                        case "endDataCollection":
                            const studyData = parameters[0];
                            onDataCollected(parameters[0]);
                    }
                }
            };
            return create_study_controller_test_environment_1.default(conditionConfig, userInterfaceAdapterSpy, participantDataServiceSpy);
        }
        function runStudyInTestEnvironment(conditionConfig) {
            return new Promise((resolve, reject) => {
                const testEnv = setUpTestEnv(conditionConfig, onDataCollected);
                const study = new study_controller_1.default(testEnv.condition, testEnv.userInterfaceAdapter, testEnv.participantDataService);
                testEnv.userInterfaceAdapter.connectToController(study);
                study.runStudy();
                function onDataCollected(actualDataOutput) {
                    const output = {
                        actualDataOutput: actualDataOutput,
                        expectedDataOutput: testEnv.expectedParticipantData
                    };
                    resolve(output);
                }
            });
        }
        it("should match expected data output", (done) => {
            runStudyInTestEnvironment(conditionConfig).then((data) => {
                // unset validation ID -- it's randomly generated, so comparison tests always
                //   fail if it's left in.
                data.actualDataOutput.validation_id = undefined;
                done();
                const objComparisonResult = deep_object_compare_1.default(data.actualDataOutput, data.expectedDataOutput);
                if (objComparisonResult === false) {
                    console.log(" ---- actualData: ---- ");
                    console.log(JSON.stringify(data.actualDataOutput, null, 2));
                    console.log(" ---- expectedData: ---- ");
                    console.log(JSON.stringify(data.expectedDataOutput, null, 2));
                }
                expect(objComparisonResult).toBe(true);
            });
        });
        it("should fail to match an incorrect data output", (done) => {
            runStudyInTestEnvironment(conditionConfig).then((data) => {
                // unset validation id - it's randomly generated and will always be different
                data.actualDataOutput.validation_id = undefined;
                // meddle with some of the perfectly good data
                data.actualDataOutput.task_data[0].answer = "Wumbo";
                done();
                const objComparisonResult = deep_object_compare_1.default(data.actualDataOutput, data.expectedDataOutput);
                expect(objComparisonResult).not.toBe(true);
            });
        });
    });
});
