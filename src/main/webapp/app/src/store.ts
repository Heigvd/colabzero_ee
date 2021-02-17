import {Card, User, Change} from "./API/client";
import * as API from './API/client';

import {createStore, applyMiddleware, Action, AnyAction} from 'redux';
import thunk from 'redux-thunk';
import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import * as LiveHelper from "./utils/LiveHelper";

export interface ZeroState {
  wsSession?: string;
  status: 'UNINITIALIZED' | 'SYNC' | 'READY';
  cards: {
    [id: number]: Card;
  };
  liveChanges: {
    [atClass: string]: {
      [cardId: number]: API.Change[]
    }
  };
  users: {
    [id: number]: User;
  };
  edit?: number;
  editUser?: number;
  error?: Error
}

const initialState: ZeroState = {
  status: 'UNINITIALIZED',
  liveChanges: {},
  cards: {},
  users: [],
};

export const ACTIONS = {
  error: (error: Error) => ({
    type: 'ERROR' as "ERROR",
    error: error
  }),
  startInit: () => ({
    type: "START_INIT" as 'START_INIT'
  }),
  initWsSessionId: (sessionId: string) => ({
    type: "INIT_WS_SESSION_ID" as "INIT_WS_SESSION_ID",
    sessionId: sessionId
  }),
  initDone: () => ({
    type: "INIT_DONE" as "INIT_DONE"
  }),
  /**
   * CARDS
   */
  initCards: (cards: Card[]) => ({
    type: "INIT_CARDS" as "INIT_CARDS",
    cards: cards
  }),
  editCard: (id: number) => ({
    type: 'EDIT_CARD' as 'EDIT_CARD',
    id: id,
  }),
  updateCard: (card: Card) => ({
    type: "UPDATE_CARD" as "UPDATE_CARD",
    card: card
  }),
  removeCard: (id: number) => ({
    type: "REMOVE_CARD" as "REMOVE_CARD",
    id: id
  }),
  /**
   * CHANGES
   */
  initChanges: (changes: Change[]) => ({
    type: "INIT_CHANGES" as "INIT_CHANGES",
    changes: changes
  }),
  updateChange: (change: Change) => ({
    type: 'UPDATE_CHANGE' as 'UPDATE_CHANGE',
    change: change,
  }),
  removeChange: (change: Change) => ({
    type: "REMOVE_CHANGE" as "REMOVE_CHANGE",
    change: change,
  }),
  /**
   * USERS
   */
  initUsers: (users: User[]) => ({
    type: "INIT_USERS" as "INIT_USERS",
    users: users
  }),
  updateUser: (user: User) => ({
    type: "UPDATE_USER" as "UPDATE_USER",
    user: user,
  }),
  removeUser: (id: number) => ({
    type: "REMOVE_USER" as "REMOVE_USER",
    userId: id,
  }),
  startEditUser: (id: number) => ({
    type: 'EDIT_USER' as 'EDIT_USER',
    id: id,
  }),
};

function unreachableStatement(x: never) {
}

type ACTIONS_TYPES = ReturnType<typeof ACTIONS[keyof typeof ACTIONS]>;

function reducer(state = initialState, action: ACTIONS_TYPES): ZeroState {

  switch (action.type) {
    case 'START_INIT':
      return {...state, status: 'SYNC'};
    case 'INIT_DONE':
      return {...state, status: 'READY'};
    case 'INIT_WS_SESSION_ID':
      return {...state, wsSession: action.sessionId};
    case 'ERROR':
      return {
        ...state,
        error: action.error
      }
    case 'INIT_CARDS':
      return {
        ...state,
        cards: action.cards.reduce<ZeroState["cards"]>((acc, current) => {
          if (current.id) {
            acc[current.id] = current;
          }
          return acc;
        }, {})
      };
    case 'UPDATE_CARD':
      if (action.card.id) {
        const newCards = {
          ...state.cards,
          [action.card.id]: action.card
        };
        return {...state, cards: newCards};
      }
      return state;
    case 'EDIT_CARD':
      return {
        ...state,
        edit: action.id
      }
    case 'REMOVE_CARD':
      if (action.id) {
        const newCards = {
          ...state.cards,
        };
        delete newCards[action.id]
        return {...state, cards: newCards};
      }
      return state;
    case 'INIT_USERS':
      return {
        ...state,
        users: action.users.reduce<ZeroState["users"]>((acc, current) => {
          if (current.id) {
            acc[current.id] = current;
          }
          return acc;
        }, {})
      };
    case 'UPDATE_USER':
      if (action.user.id) {
        const users = {
          ...state.users,
          [action.user.id]: action.user
        };
        return {...state, users: users};
      }
      return state;
    case 'REMOVE_USER':
      if (action.userId) {
        const users = {
          ...state.users,
        };
        delete users[action.userId]
        return {...state, users: users};
      }
      return state;
    case 'EDIT_USER':
      return {...state, editUser: action.id}
    case 'INIT_CHANGES':
      return {...state, liveChanges: LiveHelper.mapChangesByObject(action.changes)}
    case 'UPDATE_CHANGE':
      return {...state, liveChanges: LiveHelper.updateChange(state.liveChanges, action.change)}
    case 'REMOVE_CHANGE':
      return {...state, liveChanges: LiveHelper.removeChange(state.liveChanges, action.change)}
  }

  unreachableStatement(action);
  return state;
}

const store = createStore(reducer, applyMiddleware(thunk));

export const getStore = () => store;

export const dispatch = store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  ZeroState,
  unknown,
  Action<string>
>

export type TDispatch = ThunkDispatch<ZeroState, void, AnyAction>;

export function initData(): AppThunk {
  return async (dispatch, _getState) => {
    dispatch(ACTIONS.startInit());

    const promises = {
      cards: API.getCards(),
      users: API.getUsers(),
      changes: API.getChanges()
    };

    const array = Object.values(promises) as Promise<any>[];
    Promise.all(array)
      .then(() => {
        dispatch(ACTIONS.initDone());
      })

    promises.cards
      .then((cards) =>
        dispatch(ACTIONS.initCards(cards)))
      .catch((e) =>
        dispatch(ACTIONS.error(e))
      );

    promises.users
      .then((users) =>
        dispatch(ACTIONS.initUsers(users)))
      .catch((e) =>
        dispatch(ACTIONS.error(e))
      );

    promises.changes
      .then((changes) =>
        dispatch(ACTIONS.initChanges(changes)))
      .catch((e) =>
        dispatch(ACTIONS.error(e))
      );
  }
}

export function editCard(card: Card): AppThunk {
  return async dispatch => {
    if (card.id != null) {
      dispatch(ACTIONS.editCard(card.id));
    }
  }
}

export function createCard(card: Card): AppThunk {
  return async dispatch => {
    const id = await API.createCard({
      ...card,
      id: undefined
    })
    dispatch(ACTIONS.editCard(id));
  }
}


export function updateCard(card: Card): AppThunk {
  return async dispatch => {
    API.updateCard({
      ...card,
    })
  }
}


export function patchCard(card: Card, patch: API.Change): AppThunk {
  return async dispatch => {
    API.patchCard(card, patch);
  }
}


export function deleteCard(card: Card): AppThunk {
  return async dispatch => {
    if (card.id) {
      API.deleteCard(card.id);
    }
  }
}


export function createUser(user: User): AppThunk {
  return async dispatch => {
    const id = await API.createUser({
      ...user
    })
  }
}


export function updateUser(user: User): AppThunk {
  return async dispatch => {
    const id = await API.updateUser({
      ...user
    })
  }
}

export function cancelChanges(card: Card) : AppThunk {
  return async dispatch => {
    await API.deleteChanges(card);
  }
}
