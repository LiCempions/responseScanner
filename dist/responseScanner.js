`use strict`;
import fs from "node:fs/promises";
import rl from "readline/promises";
import { validate as UUIDvalidate } from "uuid";
import { ResponsesManager } from "./responsesManager.js";
export class ResponseScanner {
    rManager;
    #autoCallbacks;
    #abortController;
    abortScanner;
    #logPath;
    #fh;
    #readTo = 0;
    constructor() {
        this.rManager = new ResponsesManager();
        this.#abortController = new AbortController();
        this.abortScanner = this.#abortController.abort;
        this.#initScanner();
    }
    addAutoCallback(callbackId, callback) {
        this.#autoCallbacks[callbackId] = callback;
    }
    ;
    removeAutoCallback(callbackId) {
        delete this.#autoCallbacks[callbackId];
    }
    ;
    async #initScanner() {
        this.#logPath = await this.#getLatestLog();
        this.#fh = await fs.open(this.#logPath);
        await this.#fetchResponses();
        this.#watchLog();
    }
    ;
    async #getLatestLog() {
        const dir = await fs.opendir("./../../../../../logs/");
        let files = [];
        function selectRecent(prev, curr) {
            // get dates in form of arrays
            const prevDate = prev.match(/\d+/g);
            const currDate = curr.match(/\d+/g);
            if (prevDate.length != currDate.length) {
                console.warn("Log dates don't match in accuracy, using most accurate");
                return prevDate.length > currDate.length ? prevDate : currDate;
            }
            // check which date is most recent
            for (let i = 0; i < prevDate.length; i++) {
                if (prevDate[i] == currDate[i]) {
                    continue;
                }
                if (prevDate[i] > currDate[i]) {
                    return prev;
                }
                else if (currDate[i] > prevDate[i]) {
                    return curr;
                }
            }
            // return the filename with the most recent date
            return curr;
        }
        // load all ContentLog filenames in files[]
        for await (const dirent of dir) {
            if (dirent.name.startsWith("ContentLog")) {
                files.push(dirent.name);
            }
        }
        return dir.path + files.reduce(selectRecent);
    }
    ;
    async #fetchResponses() {
        const fStream = this.#fh.createReadStream({ start: this.#readTo });
        const lineReader = rl.createInterface({ input: fStream });
        for await (const line of lineReader) {
            // line model: hh:mm:ss[Scripting][inform]-uuiduuid-uuid-uuid-uuid-uuiduuiduuid-data
            if (line.slice(8, 28) != "[Scripting][inform]-") {
                continue;
            }
            const uuid = line.slice(28, 64);
            if (!UUIDvalidate(uuid)) {
                continue;
            }
            if (Object.keys(this.#autoCallbacks).includes(uuid)) {
                this.#autoCallbacks[uuid](line.slice(65));
            }
            else {
                this.rManager.setData(uuid, line.slice(65));
            }
        }
        this.#readTo = fStream.bytesRead;
        lineReader.close();
        fStream.close();
    }
    ;
    async #watchLog() {
        const watcher = fs.watch(this.#logPath, { signal: this.#abortController.signal });
        for await (const event of watcher) {
            if (event.eventType == "change") {
                await this.#fetchResponses();
            }
            else {
                await this.#fh.close();
                try {
                    this.#logPath = this.#logPath.slice(0, this.#logPath.lastIndexOf("/") + 1) + event.filename.toString();
                    this.#fh = await fs.open(this.#logPath);
                }
                catch (err) {
                    this.#abortController.abort("Error was thrown while opening renamed file");
                    throw err;
                }
            }
        }
    }
    ;
}
//# sourceMappingURL=responseScanner.js.map