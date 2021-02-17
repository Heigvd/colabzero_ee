/*
 * Wegas War Manager
 * https://www.albasim.ch
 *
 * Copyright (c) 2020 School of Business and Engineering Vaud, Comem, MEI
 * Licensed under the MIT License
 */
import * as React from "react";
import AlbaLogo from "../images/logo.svg";
import { getStore, initCards } from "../store";
import { Provider } from "react-redux";
import { bodyStyle, headerStyle, headerImageStyle, headerTitleStyle, headerItemStyle } from "./style";
import { css, cx } from "emotion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faSync } from "@fortawesome/free-solid-svg-icons";
import { Cards } from "./Cards";
export function Manager(props) {
    const [appState, setState] = React.useState({ status: "LOADING" });
    const init = () => {
        initCards()
            .then(() => {
            setState({
                status: "READY",
            });
        });
    };
    const sync = () => {
        setState({
            status: "SYNC",
        });
        init();
    };
    if (appState.status === "LOADING") {
        init();
        return (React.createElement("div", { className: bodyStyle },
            React.createElement("div", { className: css({
                    margin: "auto"
                }) },
                React.createElement(FontAwesomeIcon, { size: "2x", icon: faSpinner, pulse: true }))));
    }
    else {
        return (React.createElement("div", { className: bodyStyle },
            React.createElement(Provider, { store: getStore() },
                React.createElement("div", { className: headerStyle },
                    React.createElement(AlbaLogo, { className: headerImageStyle }),
                    React.createElement("div", { className: headerTitleStyle }, "colabzero"),
                    React.createElement(FontAwesomeIcon, { spin: appState.status === "SYNC", className: cx(headerItemStyle, css({
                            cursor: "pointer"
                        })), onClick: () => {
                            sync();
                        }, icon: faSync })),
                React.createElement("div", { className: css({
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        flexGrow: 1,
                        flexShring: 1,
                        overflow: "auto"
                    }) },
                    React.createElement(Cards, null)))));
    }
}
//# sourceMappingURL=Manager.js.map