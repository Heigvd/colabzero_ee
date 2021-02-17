/*
 * Colabzero
 * https://www.albasim.ch
 *
 * Copyright (c) 2020 School of Business and Engineering Vaud, Comem, MEI
 * Licensed under the MIT License
 */

export interface Card {
  "@class": "Card";
  id?: number;
  revision: number;
  externalId: string;
  creationTime: number;
  content: string;
}

export interface User {
  "@class": "User";
  id?: number;
  username: string;
  displayName: string;
}

export interface MicroAdd {
  t: 'I';
  o: number;
  v: string;
}


export interface MicroRem {
  t: 'D';
  o: number;
  l: number;
}

export type MicroChange = MicroAdd | MicroRem;

export interface Change {
  atClass?:string;
  atId?: number;
  basedOn: string;
  newRevision: string;
  liveSession: string;
  changes: MicroChange[];
}



function getOptions({
  method,
  body,
  contentType
}: {
    method?: string;
    body?: {} | string | FormData;
    contentType?: string;
}): RequestInit {
  let headers;
  if (contentType) {
    // do not set multipart/form-data by hand but let the
    // browser do it
    if (contentType != "multipart/form-data") {
      headers = new Headers({
        "content-type": contentType
      });
    }
  } else {
    headers = new Headers({
      "content-type": "application/json"
    });
  }

  return {
    headers: headers,
    method: method || "GET",
    body: body
      ? body instanceof FormData
        ? (body as FormData)
        : JSON.stringify(body)
      : undefined
  };
}

async function get<T>(url: string): Promise<T> {
  return fetch(url, getOptions({method: "GET"})).then(res => {
    if (res.ok) {
      return res.json() as Promise<T>;
    } else {
      throw new Error("Failure");
    }
  });
}

async function getVoid(url: string): Promise<void> {
  return fetch(url, getOptions({method: "GET"})).then(res => {
    if (res.ok) {
      return;
    } else {
      throw new Error("Failure");
    }
  });
}

async function post<T>(
  url: string,
  body: {},
  contentType?: string
): Promise<T> {
  return fetch(
    url,
    getOptions({
      method: "POST",
      body: body,
      contentType: contentType
    })
  ).then(res => {
    if (res.ok) {
      return res.json() as Promise<T>;
    } else {
      throw new Error("Failure");
    }
  });
}

async function put<T>(url: string, body: {}): Promise<T> {
  return fetch(
    url,
    getOptions({
      method: "PUT",
      body: body
    })
  ).then(res => {
    if (res.ok) {
      return res.json() as Promise<T>;
    } else {
      throw new Error("Failure");
    }
  });
}

async function putVoid(url: string, body: {}): Promise<void> {
  return fetch(
    url,
    getOptions({
      method: "PUT",
      body: body
    })
  ).then(res => {
    if (res.ok) {
      return;
    } else {
      throw new Error("Failure");
    }
  });
}

async function patchVoid(url: string, body: {}): Promise<void> {
  return fetch(
    url,
    getOptions({
      method: "PATCH",
      body: body
    })
  ).then(res => {
    if (res.ok) {
      return;
    } else {
      throw new Error("Failure");
    }
  });
}

async function deleteR<T>(url: string, body?: {}): Promise<T> {
  return fetch(
    url,
    getOptions({
      method: "DELETE",
      body: body
    })
  ).then(res => {
    if (res.ok) {
      if (res.bodyUsed) {
        return res.json() as Promise<T>;
      } else {
        return undefined as any;
      }
    } else {
      throw new Error("Failure");
    }
  });
}

export async function getCards(): Promise<Card[]> {
  return get<Card[]>("/api/cards");
}

export async function getCard(id: number): Promise<Card> {
  return get<Card>("/api/cards/" + id);
}

export async function createCard(card: Card): Promise<number> {
  return post<number>("/api/cards", card);
}

export async function updateCard(card: Card) {
  return putVoid("/api/cards/", card);
}

export async function patchCard(card: Card, change: Change) {
  return patchVoid("/api/cards/" + card.id, change);
}

export async function deleteCard(id: number) {
  return deleteR<number>("/api/cards/" + id);
}

/**
 * CHANGES
 */
export async function getChanges(): Promise<Change[]> {
  return get<Change[]>("/api/cards/pendings");
}

export async function deleteChanges(card: Card): Promise<Change[]> {
  return deleteR<Change[]>("/api/cards/" + card.id + " /pendings");
}


/**
 * User API
 */
export async function getUsers(): Promise<User[]> {
  return get<User[]>("/api/users");
}

export async function createUser(user: User): Promise<number> {
  return post<number>("/api/users", user);
}

export async function updateUser(user: User): Promise<void> {
  return putVoid("/api/users", user);
}

