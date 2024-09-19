declare const ResponsesManager: any;
type autoCallback = (data: string) => void;
export declare class ResponseScanner {
    #private;
    readonly rManager: typeof ResponsesManager;
    readonly abortScanner: Function;
    constructor();
    addAutoCallback(callbackId: string, callback: autoCallback): void;
    removeAutoCallback(callbackId: string): void;
}
export {};
