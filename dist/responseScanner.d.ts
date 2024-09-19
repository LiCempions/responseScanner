import { ResponsesManager } from "./responsesManager.js";
type autoCallback = (data: string) => void;
export declare class ResponseScanner {
    #private;
    readonly rManager: ResponsesManager;
    readonly abortScanner: Function;
    constructor();
    addAutoCallback(callbackId: string, callback: autoCallback): void;
    removeAutoCallback(callbackId: string): void;
}
export {};
