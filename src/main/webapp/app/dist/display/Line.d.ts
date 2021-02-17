import { Line } from '../API/client';
interface StateProps {
    categories: string[];
}
interface DispatchProps {
}
interface OwnProps {
    line: Line;
    onDelete: (line: Line) => void;
    onChange: (line: Line) => void;
}
declare type LineProps = StateProps & DispatchProps & OwnProps;
export declare const LineDisplay: import("react-redux").ConnectedComponent<({ line, onDelete, onChange, categories }: LineProps) => JSX.Element, Pick<LineProps, "line" | "onChange" | "onDelete"> & OwnProps>;
export {};
