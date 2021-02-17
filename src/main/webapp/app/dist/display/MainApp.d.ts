import { ZeroState } from "../store";
export declare const MainApp: import("react-redux").ConnectedComponent<({ init, status, }: {
    status: ZeroState["status"];
    init: () => void;
}) => JSX.Element, Pick<{
    status: ZeroState["status"];
    init: () => void;
}, never>>;
