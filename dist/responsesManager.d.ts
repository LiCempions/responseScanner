type responseCallback = (data: string) => void;
interface Response {
    "data"?: string;
    "callback"?: responseCallback;
}
export declare class ResponsesManager {
    responses: {
        [k: string]: Response;
    };
    completed: string[];
    setData(resID: string, data: string): void;
    setCallback(resID: string, callback: responseCallback): void;
}
export {};
