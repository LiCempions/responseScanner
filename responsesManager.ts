interface Response { "data"?: string, "callback"?: Function }

export class ResponsesManager {
    responses: { [k: string]: Response };
    completed: string[] = [];

    setData(resID: string, data: string){
        if ( this.responses[resID].callback != null ) {
            const result = this.responses[resID].callback(data);

            this.completed.push(resID);
            delete this.responses[resID];
            return result;
        } else {
            this.responses[resID].data = data;
        }
    }
    setCallback(resID: string, callback: Function){
        if ( this.responses[resID].data != null ) {

            const result = callback(this.responses[resID].data);

            this.completed.push(resID);
            delete this.responses[resID];
            return result;
        } else {
            this.responses[resID].callback = callback;
        }
    }
}