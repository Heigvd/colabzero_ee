/*
 * colabzero
 * https://www.albasim.ch
 *
 * Copyright (c) 2020 School of Business and Engineering Vaud, Comem, MEI
 * Licensed under the MIT License
 */
import * as React from "react";

import Logo from "../images/logo.svg";

import {
  ZeroState,
  TDispatch,
  initData
} from "../store";
import {connect} from "react-redux";
import {
  bodyStyle,
  headerStyle,
  headerImageStyle,
  headerTitleStyle,
  headerItemStyle
} from "./style";
import {css, cx} from "emotion";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import {Cards, CreateRandomCard} from "./Cards";

const MainAppInternal = ({init, status, }: {
  status: ZeroState["status"];
  init: () => void;
}) => {
  if (status === "UNINITIALIZED") {
    init();
    return (
      <div className={bodyStyle}>
        <div
          className={css({
            margin: "auto"
          })}
        >
          <FontAwesomeIcon size="2x" icon={faSpinner} pulse />
        </div>
      </div>
    );
  } else {
    return (
      <div className={bodyStyle}>
        <div className={headerStyle}>
          <Logo className={headerImageStyle} />
          <div className={headerTitleStyle}>Colabzero JPA</div>

          <FontAwesomeIcon
            spin={status === "SYNC"}
            className={cx(
              headerItemStyle,
              css({
                marginRight: "3px",
                cursor: "pointer"
              })
            )}
            onClick={() => {
              init();
            }}
            icon={faSync}
          />
        </div>

        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            flexGrow: 1,
            flexShrink: 1,
            overflow: "auto"
          })}
        >
          <Cards />
          <CreateRandomCard />

        </div>
      </div>
    );
  }
}


export const MainApp = connect(
  (state: ZeroState) => ({
    status: state.status,
  }),
  (dispatch: TDispatch) => ({
    init: () => {
      dispatch(initData());
    }
  })
)(MainAppInternal);




