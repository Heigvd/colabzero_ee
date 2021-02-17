/*
 * Wegas War Manager
 * https://www.albasim.ch
 *
 * Copyright (c) 2020 School of Business and Engineering Vaud, Comem, MEI
 * Licensed under the MIT License
 */
import * as client from "./API/client";
import { configureStore } from "@reduxjs/toolkit";
const initialState = {
    cards: [],
};
const initCardsAction = (cards) => ({
    type: "INIT_CARDS",
    cards: cards
});
export const updateCardAction = (card) => ({
    type: "UPDATE_CARD",
    card: card
});
export const removeCardAction = (card) => ({
    type: "REMOVE_CARD",
    card: card
});
function reducer(state = initialState, action) {
    if (action.type === "INIT_CARDS") {
        return { ...state, cards: action.cards };
    }
    else if (action.type === "UPDATE_CARD") {
        const newCards = state.cards.slice();
        const index = newCards.findIndex(d => d.id === action.card.id);
        if (index >= 0) {
            newCards.splice(index, 1, action.card);
        }
        else {
            newCards.push(action.card);
        }
        return { ...state, cards: newCards };
    }
    else if (action.type === "REMOVE_CARD") {
        const newCards = state.cards.slice();
        const index = newCards.findIndex(d => d.id === action.card.id);
        if (index >= 0) {
            newCards.splice(index, 1);
        }
        return { ...state, cards: newCards };
    }
    return state;
}
const store = configureStore({ reducer: reducer });
export const getStore = () => store;
const disp = store.dispatch;
export function fetchCard(card) {
    if (card.id) {
        return client
            .getCard(card.id)
            .then(d => {
            return store.dispatch(updateCardAction(d));
        });
    }
}
export async function initCards() {
    return client.getCards()
        .then(cards => store.dispatch(initCardsAction(cards)))
        .then(x => x.cards);
}
export async function createCard(card, name) {
    return client
        .postCard({
        content: ""
    })
        .then(d => store.dispatch(updateCardAction(d)))
        .then(x => x.card);
}
/**
 *
 * @param card
 * @returns the destroyed card
 */
export async function deleteCard(card) {
    if (card.id) {
        return client
            .deleteCard(card.id)
            .then(d => {
            return store.dispatch(removeCardAction(d));
        })
            .then(x => x.card);
    }
}
//# sourceMappingURL=store.js.map