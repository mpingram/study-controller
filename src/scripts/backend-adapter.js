"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BackendAdapter {
    // TODO: implement
    postData(json) {
        console.log(json);
        return Promise.resolve();
    }
    getCondition() {
        return Promise.resolve({});
    }
}
exports.default = BackendAdapter;
