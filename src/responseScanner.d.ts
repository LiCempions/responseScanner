import { ResponsesManager } from "responsesmanager";

declare module "responsescanner" {

    export type autoCallback = (data:string) => void;

    export class ResponseScanner {
        rManager: ResponsesManager;
        abortScanner: AbortController["abort"];
        addAutoCallback(callbackId: string, callback: autoCallback): void;
        removeAutoCallback(callbackId: string): void;
    }
}