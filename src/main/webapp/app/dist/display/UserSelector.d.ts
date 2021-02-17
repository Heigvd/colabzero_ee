import { User } from '../API/client';
interface StateProps {
    users: User[];
}
interface DispatchProps {
}
interface MultiProps {
    value: string[];
    className: string;
    onChange: (value: string[]) => void;
}
interface SingleProps {
    value?: string;
    className: string;
    onChange: (value?: string) => void;
}
declare type MProps = StateProps & DispatchProps & MultiProps;
declare type SProps = StateProps & DispatchProps & SingleProps;
export declare const MultiUserSelector: import("react-redux").ConnectedComponent<({ value, className, users, onChange }: MProps) => JSX.Element, Pick<MProps, "className" | "onChange" | "value"> & MultiProps>;
export declare const SingleUserSelector: import("react-redux").ConnectedComponent<({ value, className, users, onChange }: SProps) => JSX.Element, Pick<SProps, "className" | "onChange" | "value"> & SingleProps>;
export {};
