/*
 * Wegas War Manager
 * https://www.albasim.ch
 *
 * Copyright (c) 2020 School of Business and Engineering Vaud, Comem, MEI
 * Licensed under the MIT License
 */
import * as React from "react";
import { render } from "react-dom";
import { Manager } from "./display/Manager";
function mount() {
    return render(React.createElement(Manager, null), document.getElementById("root"));
}
mount();
//# sourceMappingURL=app.js.map