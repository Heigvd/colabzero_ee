import { Card, Change } from "../API/client";
interface StateProps {
}
interface DispatchProps {
    onSave: (card: Card) => void;
    onPatch: (card: Card, change: Change) => void;
}
interface OwnProps {
    card: Card;
}
declare type Props = StateProps & DispatchProps & OwnProps;
export declare const CardDisplay: import("react-redux").ConnectedComponent<({ card, onSave, onPatch }: Props) => JSX.Element, Pick<Props, "card"> & OwnProps>;
declare function InternalCardsDisplay({ cards }: {
    cards: Card[];
}): JSX.Element;
export declare const Cards: import("react-redux").ConnectedComponent<typeof InternalCardsDisplay, Pick<{
    cards: Card[];
}, never>>;
export declare const CreateRandomCard: import("react-redux").ConnectedComponent<({ onSave }: {
    onSave: (card: Card) => void;
}) => JSX.Element, Pick<{
    onSave: (card: Card) => void;
}, never>>;
export {};
