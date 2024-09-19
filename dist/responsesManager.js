"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponsesManager = void 0;
`use strict`;
class ResponsesManager {
    responses = {};
    completed = [];
    setData(resID, data) {
        if (this.responses[resID]) {
            this.responses[resID].callback(data);
            this.completed.push(resID);
            delete this.responses[resID];
        }
        else {
            this.responses[resID] = { data: data };
        }
    }
    setCallback(resID, callback) {
        if (this.responses[resID]) {
            callback(this.responses[resID].data);
            this.completed.push(resID);
            delete this.responses[resID];
        }
        else {
            this.responses[resID] = { callback: callback };
        }
    }
}
exports.ResponsesManager = ResponsesManager;
//# sourceMappingURL=responsesManager.js.map