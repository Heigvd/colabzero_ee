import { Receipt, User } from "../API/client";
import "react-nice-dates/build/style.css";
import "./styles/customize.css";
declare function InternalReceiptsDisplay({ receipts }: {
    receipts: {
        [id: number]: Receipt;
    };
}): JSX.Element;
export declare const Receipts: import("react-redux").ConnectedComponent<typeof InternalReceiptsDisplay, Pick<{
    receipts: {
        [id: number]: Receipt;
    };
}, never>>;
interface StateProps {
    users: User[];
}
interface DisProps {
    onSave: (receipt: Receipt) => void;
    onCancel: () => void;
    onDelete?: (receipt: Receipt) => void;
    createLine?: (receipt: Receipt) => void;
    edit: (receipt: Receipt) => void;
}
interface MyProps {
    receipt?: Receipt;
    short: boolean;
}
declare type PROPS = StateProps & DisProps & MyProps;
export declare const ReceiptCreator: import("react-redux").ConnectedComponent<({ edit, onSave, onCancel, onDelete, receipt, createLine, short }: PROPS) => JSX.Element, Pick<PROPS, "receipt" | "short"> & MyProps>;
export declare const ReceiptDisplay: import("react-redux").ConnectedComponent<({ edit, onSave, onCancel, onDelete, receipt, createLine, short }: PROPS) => JSX.Element, Pick<PROPS, "receipt" | "short">>;
export {};
