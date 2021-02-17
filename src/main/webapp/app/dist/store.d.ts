import { Card, User, Change } from "./API/client";
import * as API from './API/client';
import { Action, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
export interface ZeroState {
    wsSession?: string;
    status: 'UNINITIALIZED' | 'SYNC' | 'READY';
    cards: {
        [id: number]: Card;
    };
    liveChanges: {
        [atClass: string]: {
            [cardId: number]: API.Change[];
        };
    };
    users: {
        [id: number]: User;
    };
    edit?: number;
    editUser?: number;
    error?: Error;
}
export declare const ACTIONS: {
    error: (error: Error) => {
        type: "ERROR";
        error: Error;
    };
    startInit: () => {
        type: "START_INIT";
    };
    initWsSessionId: (sessionId: string) => {
        type: "INIT_WS_SESSION_ID";
        sessionId: string;
    };
    initDone: () => {
        type: "INIT_DONE";
    };
    /**
     * CARDS
     */
    initCards: (cards: Card[]) => {
        type: "INIT_CARDS";
        cards: Card[];
    };
    editCard: (id: number) => {
        type: "EDIT_CARD";
        id: number;
    };
    updateCard: (card: Card) => {
        type: "UPDATE_CARD";
        card: Card;
    };
    removeCard: (id: number) => {
        type: "REMOVE_CARD";
        id: number;
    };
    /**
     * CHANGES
     */
    initChanges: (changes: Change[]) => {
        type: "INIT_CHANGES";
        changes: Change[];
    };
    updateChange: (change: Change) => {
        type: "UPDATE_CHANGE";
        change: Change;
    };
    removeChange: (change: Change) => {
        type: "REMOVE_CHANGE";
        change: Change;
    };
    /**
     * USERS
     */
    initUsers: (users: User[]) => {
        type: "INIT_USERS";
        users: User[];
    };
    updateUser: (user: User) => {
        type: "UPDATE_USER";
        user: User;
    };
    removeUser: (id: number) => {
        type: "REMOVE_USER";
        userId: number;
    };
    startEditUser: (id: number) => {
        type: "EDIT_USER";
        id: number;
    };
};
export declare const getStore: () => import("redux").Store<ZeroState, {
    type: "ERROR";
    error: Error;
} | {
    type: "START_INIT";
} | {
    type: "INIT_WS_SESSION_ID";
    sessionId: string;
} | {
    type: "INIT_DONE";
} | {
    type: "INIT_CARDS";
    cards: Card[];
} | {
    type: "EDIT_CARD";
    id: number;
} | {
    type: "UPDATE_CARD";
    card: Card;
} | {
    type: "REMOVE_CARD";
    id: number;
} | {
    type: "INIT_CHANGES";
    changes: Change[];
} | {
    type: "UPDATE_CHANGE";
    change: Change;
} | {
    type: "REMOVE_CHANGE";
    change: Change;
} | {
    type: "INIT_USERS";
    users: User[];
} | {
    type: "UPDATE_USER";
    user: User;
} | {
    type: "REMOVE_USER";
    userId: number;
} | {
    type: "EDIT_USER";
    id: number;
}> & {
    dispatch: unknown;
};
export declare const dispatch: import("redux").Dispatch<{
    type: "ERROR";
    error: Error;
} | {
    type: "START_INIT";
} | {
    type: "INIT_WS_SESSION_ID";
    sessionId: string;
} | {
    type: "INIT_DONE";
} | {
    type: "INIT_CARDS";
    cards: Card[];
} | {
    type: "EDIT_CARD";
    id: number;
} | {
    type: "UPDATE_CARD";
    card: Card;
} | {
    type: "REMOVE_CARD";
    id: number;
} | {
    type: "INIT_CHANGES";
    changes: Change[];
} | {
    type: "UPDATE_CHANGE";
    change: Change;
} | {
    type: "REMOVE_CHANGE";
    change: Change;
} | {
    type: "INIT_USERS";
    users: User[];
} | {
    type: "UPDATE_USER";
    user: User;
} | {
    type: "REMOVE_USER";
    userId: number;
} | {
    type: "EDIT_USER";
    id: number;
}>;
export declare type AppThunk<ReturnType = void> = ThunkAction<ReturnType, ZeroState, unknown, Action<string>>;
export declare type TDispatch = ThunkDispatch<ZeroState, void, AnyAction>;
export declare function initData(): AppThunk;
export declare function editCard(card: Card): AppThunk;
export declare function createCard(card: Card): AppThunk;
export declare function updateCard(card: Card): AppThunk;
export declare function patchCard(card: Card, patch: API.Change): AppThunk;
export declare function deleteCard(card: Card): AppThunk;
export declare function createUser(user: User): AppThunk;
export declare function updateUser(user: User): AppThunk;
