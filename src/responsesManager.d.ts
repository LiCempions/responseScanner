declare module "responsesmanager" {

    export type responseCallback = (data:string) => void
    export interface Response { "data"?: string, "callback"?: responseCallback }
    

    export class ResponsesManager {
        responses: { [k: string]: Response };
        completed: string[];
        setData(resID: string, data: string): void;
        setCallback(resID: string, callback: responseCallback): void;
    }
}