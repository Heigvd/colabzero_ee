/*
 * Colabzero
 * https://www.albasim.ch
 *
 * Copyright (c) 2020 School of Business and Engineering Vaud, Comem, MEI
 * Licensed under the MIT License
 */
function getOptions( { method, body, contentType }) {
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
            ? body
            : JSON.stringify(body)
            : undefined
  };
}
async function get(url) {
  return fetch(url, getOptions({method: "GET"})).then(res => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Failure");
    }
  });
}
async function getVoid(url) {
  return fetch(url, getOptions({method: "GET"})).then(res => {
    if (res.ok) {
      return;
    } else {
      throw new Error("Failure");
    }
  });
}
async function post(url, body, contentType) {
  return fetch(url, getOptions({
    method: "POST",
    body: body,
    contentType: contentType
  })).then(res => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Failure");
    }
  });
}
async function put(url, body) {
  return fetch(url, getOptions({
    method: "PUT",
    body: body
  })).then(res => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Failure");
    }
  });
}
async function deleteR(url, body) {
  return fetch(url, getOptions({
    method: "DELETE",
    body: body
  })).then(res => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Failure");
    }
  });
}
export async function getCards() {
  return get("/api/cards");
}
export async function getCard(id) {
  return get("/api/cards/" + id);
}
export async function postCard(card) {
  return post("/api/cards", card);
}
export async function putCard(card) {
  return put("/api/cards/", card);
}
export async function deleteCard(id) {
  return deleteR("/api/cards/" + id);
}
//# sourceMappingURL=client.js.map