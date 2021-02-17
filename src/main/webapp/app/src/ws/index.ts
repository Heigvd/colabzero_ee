
/*
 * Copyright (C) 2020 AlbaSim, MEI, The School of Management and Engineering Vaud
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


import {Card, User, Change} from "..";
import {dispatch, ACTIONS} from "../store";

interface WsDeleteMessage {
  "@class": "WsDeleteMessage";
  items: {
    id: number;
    "type": "Card" | "User"
  }[];
}

interface WsUpdateMessage {
  "@class": "WsUpdateMessage";
  "payload": {
    "@class": "Card" | "User"
  }[];
}


interface WsUpdateChangeMessage {
  "@class": "WsUpdateChangeMessage";
  "payload": Change[]
}

interface WsDeleteChangeMessage {
  "@class": "WsDeleteChangeMessage";
  "payload": Change[]
}

interface WsInitMessage {
  "@class": "WsInitMessage";
  "sessionId": string;
}

const onUpdate = (event: WsUpdateMessage) => {
  console.log("Update: ", event);
  for (const item of event.payload) {
    switch (item["@class"]) {
      case "Card":
        dispatch(ACTIONS.updateCard(item as Card));
        break;
      case "User":
        dispatch(ACTIONS.updateUser(item as User));
        break;
    }
  }
}

const onUpdateChange = (event: WsUpdateChangeMessage) => {
  console.log("Update: ", event);
  for (const item of event.payload) {
    dispatch(ACTIONS.updateChange(item));
  }
}

const onDeleteChange = (event: WsDeleteChangeMessage) => {
  console.log("Delete: ", event);
  for (const item of event.payload) {
    dispatch(ACTIONS.removeChange(item));
  }
}


const onDelete = (event: WsDeleteMessage) => {
  console.log("Delete: ", event);

  for (const item of event.items) {

    switch (item["type"]) {
      case "Card":
        dispatch(ACTIONS.removeCard(item.id));
        break;
      case "User":
        dispatch(ACTIONS.removeUser(item.id));
        break;
    }
  }
}

//export function send(channel: string, payload: {}) {
//  connection.send(JSON.stringify({
//    channel,
//    payload
//  }));
//}


function createConnection(onCloseCb: () => void) {
  console.log("Init Websocket Connection");
  const connection = new WebSocket('ws:///' + window.location.host + "/ws");
  console.log("Init Ws Done");


  connection.onclose = () => {
    // reset by peer => reconnect please
    console.log("WS reset by peer");
    onCloseCb();
  }

  let resolveSessionId: {(value?: string | PromiseLike<string> | undefined): void; (arg0: string): void;};

  const p = new Promise<string>((resolve, reject) => {
    resolveSessionId = resolve;
  });

  connection.onmessage = (messageEvent) => {
    const message = JSON.parse(messageEvent.data);
    if ("@class" in message) {
      switch (message["@class"]) {
        case "WsDeleteMessage":
          onDelete(message);
          break;
        case "WsUpdateMessage":
          onUpdate(message);
          break;
        case "WsUpdateChangeMessage":
          onUpdateChange(message);
          break;
        case "WsDeleteChangeMessage":
          onDeleteChange(message);
          break;
        case "WsInitMessage":
          dispatch(ACTIONS.initWsSessionId((message as WsInitMessage).sessionId));
          resolveSessionId((message as WsInitMessage).sessionId);
          break;
      }
    }
  }

  return {
    getSessionId: p
  }
}


export function init() {

  const reinit = () => {
    setTimeout(() => {
      createConnection(reinit);
    }, 500);
  }

  return createConnection(reinit)
}
