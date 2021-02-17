/*
 * colabzero
 * https://www.albasim.ch
 *
 * Copyright (c) 2020 School of Business and Engineering Vaud, Comem, MEI
 * Licensed under the MIT License
 */

import * as React from "react";
import {render} from "react-dom";
import {init} from "./ws";
import {Provider} from "react-redux";
import {getStore} from "./store";
import ErrorBoundary from "./ErrorBoundary";
import {MainApp} from "./display/MainApp";

function mount() {
  return render(
    <ErrorBoundary>
      <Provider store={getStore()}>
        <MainApp /> ,
        </Provider >
    </ErrorBoundary>,
    document.getElementById("root")
  );
}

init();
mount();