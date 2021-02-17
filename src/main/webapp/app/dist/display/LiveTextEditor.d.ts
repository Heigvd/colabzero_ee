import { Change } from "..";
interface StateProps {
    liveSession?: string;
}
interface DispatchProps {
}
interface OwnProps {
    atClass: string;
    atId: number;
    value: string;
    onChange: (change: Change) => void;
    changes: Change[];
}
declare type Props = StateProps & DispatchProps & OwnProps;
export declare const LiveTextEditor: import("react-redux").ConnectedComponent<({ atClass, atId, liveSession, value, changes, onChange }: Props) => JSX.Element, Pick<Props, "onChange" | "value" | "atClass" | "atId" | "changes"> & OwnProps>;
export {};
