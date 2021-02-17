import { ZeroState } from "../store";
import { Receipt } from "..";
export declare const LesCourses: import("react-redux").ConnectedComponent<typeof LesCoursesInternal, Pick<{
    status: ZeroState['status'];
    edit?: Receipt | undefined;
    init: () => void;
}, never>>;
declare function LesCoursesInternal({ init, status, edit }: {
    status: ZeroState['status'];
    edit?: Receipt;
    init: () => void;
}): JSX.Element;
export {};
