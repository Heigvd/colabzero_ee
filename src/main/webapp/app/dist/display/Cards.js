/*
 * Wegas War Manager
 * https://www.albasim.ch
 *
 * Copyright (c) 2020 School of Business and Engineering Vaud, Comem, MEI
 * Licensed under the MIT License
 */
import * as React from "react";
import { connect } from "react-redux";
const CardDisplay = ({ card }) => {
    return (React.createElement("div", null,
        React.createElement("div", null,
            "id: ",
            card.id),
        React.createElement("div", null, card.content)));
};
function InternalCardsDisplay({ cards }) {
    return React.createElement("div", null, cards.map(card => (React.createElement(CardDisplay, { key: card.id, card: card }))));
}
const mapStateToProps = (state) => ({
    cards: state.cards
});
const mapDispatchToProps = () => ({});
export const Cards = connect(mapStateToProps, mapDispatchToProps)(InternalCardsDisplay);
//# sourceMappingURL=Cards.js.map