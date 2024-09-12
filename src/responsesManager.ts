`use strict`;
type responseCallback = (data:string) => void
interface Response { "data"?: string, "callback"?: responseCallback }

export class ResponsesManager {
    responses: { [k: string]: Response } = {};
    completed: string[] = [];

    setData(resID: string, data: string){
        if ( this.responses[resID]) {
            this.responses[resID].callback(data);

            this.completed.push(resID);
            delete this.responses[resID];
        } else {
            this.responses[resID] = { data: data };
        }
    }
    setCallback(resID: string, callback: responseCallback){
        if ( this.responses[resID]) {

            callback(this.responses[resID].data);

            this.completed.push(resID);
            delete this.responses[resID];
        } else {
            this.responses[resID] = {callback: callback};
        }
    }
}