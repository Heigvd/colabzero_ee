import { Change, MicroChange } from "../API/client";
import { ZeroState } from "../store";
export declare const mapChangesByObject: (changes: Change[]) => ZeroState['liveChanges'];
export declare const updateChange: (changes: ZeroState['liveChanges'], change: Change) => ZeroState['liveChanges'];
export declare const removeChange: (changes: ZeroState['liveChanges'], change: Change) => ZeroState['liveChanges'];
export declare const getMicroChange: (previous: string, current: string) => MicroChange[];
export declare const applyChanges: (content: string, changeset: Change[]) => {
    value: string;
    revision: string;
};
/**
 * merge ch1 within ch2
 * returns changes which contains set of unique changes
 *         and duplicaets, which contains ch2 changes which
 *         previously exists in ch1
 *
 */
export declare const merge: (ch1: Change[], ch2: Change[]) => {
    changes: Change[];
    duplicates: Change[];
};
