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

import * as React from "react";
import {iconStyle} from "./style";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";
import {throttle} from "lodash";

import {Change} from "..";
import * as LiveHelper from '../utils/LiveHelper';
import {connect} from "react-redux";
import {ZeroState, TDispatch} from "../store";

type State = {
  status: "SET" | "EDITING";
  currentValue: string;
}

interface StateProps {
  liveSession?: string;
};

interface DispatchProps {
}

interface OwnProps {
  atClass: string,
  atId: number,
  value: string;
  onChange: (change: Change) => void;
  changes: Change[];
}

type Props = StateProps & DispatchProps & OwnProps;

const LiveTextEditorInternal = ({atClass, atId, liveSession, value, changes, onChange}: Props) => {

  const veryValue = LiveHelper.applyChanges(value, changes);

  console.log("VeryValue " + veryValue.revision + " -> " + veryValue.value);

  if (!liveSession) {
    return <div>
      <div>disconnected...</div>
      <div>{veryValue.value}</div>
    </div>;
  }

  const [state, setState] = React.useState<State>({
    status: "SET",
    currentValue: veryValue.value || '',
  });

  // initial saved value is
  const savedValue = React.useRef<{
    content: string;
    revision: string;
    /**
     * already sent to the server, maybe not yet in props.changes
     */
    localChanges: Change[];
    myCounter: number
  }>({content: veryValue.value, revision: '0', localChanges: [], myCounter: 0});

  console.log("SavedValue: " + savedValue.current.revision + " -> " + savedValue.current.content);

  console.log("SavedChanges ", changes);
  console.log("LocalChange: ", savedValue.current.localChanges);
  const effectiveChanges = LiveHelper.merge(changes, savedValue.current.localChanges);

  if (effectiveChanges.duplicates && effectiveChanges.duplicates.length > 0) {
    // if there is duplicates, we can saflety removed them from localChanges
    savedValue.current.localChanges = savedValue.current.localChanges
      .filter((c) => !effectiveChanges.duplicates.find(dc => c.newRevision === dc.newRevision))
  }

  const baseValue = LiveHelper.applyChanges(value, effectiveChanges.changes);

  console.log("Base value: " + baseValue.revision + " -> " + baseValue.value);

  if (baseValue.value !== savedValue.current.content) {
    // rebase internal values

    const diff = LiveHelper.getMicroChange(savedValue.current.content, state.currentValue);

    if (diff.length > 0) {
      const currentChange = [...effectiveChanges.changes, {
        atClass: atClass,
        atId: atId,
        changes: diff,
        basedOn: savedValue.current.revision,
        liveSession: "internal",
        newRevision: "internal.temp"
      }];

      const currentValue = LiveHelper.applyChanges(value, currentChange);
      console.log("New currentValue: " + currentValue.revision + " -> " + currentValue.value);

      savedValue.current.content = baseValue.value;
      savedValue.current.revision = baseValue.revision;

      setState({
        ...state,
        currentValue: currentValue.value
      });
    } else {
      savedValue.current.content = baseValue.value;
      savedValue.current.revision = baseValue.revision;

      setState({
        ...state,
        currentValue: baseValue.value
      });
    }
  }

  const throttledOnChange = React.useCallback(
    throttle((value: string) => {
      const previous = savedValue.current.content;
      const next = value;
      const count = savedValue.current.myCounter + 1;
      const change: Change = {
        atClass: atClass,
        atId: atId,
        changes: LiveHelper.getMicroChange(previous, next),
        basedOn: savedValue.current.revision,
        liveSession: liveSession,
        newRevision: liveSession + "::" + count
      };

      savedValue.current.content = value;
      savedValue.current.myCounter = count;
      savedValue.current.localChanges.push(change);
      savedValue.current.revision = change.newRevision;

      console.log("Send change");
      onChange(change);
    }, 500), []);

  const onInternalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    throttledOnChange(e.target.value)
    setState(
      {...state, currentValue: e.target.value}
    );
  }

  if (state.status === 'SET') {
    return <div>
      {state.currentValue}
      <FontAwesomeIcon
        title="Click to edit URL"
        className={iconStyle}
        onClick={() => setState({...state, status: "EDITING"})}
        icon={faPen}
      />
    </div>;
  } else if (state.status === 'EDITING') {
    return <div>
      <textarea
        value={state.currentValue}
        onChange={onInternalChange}
      />
    </div>;
  }
  return <div>not yet implemented</div>
}

export const LiveTextEditor = connect<StateProps, DispatchProps, OwnProps, ZeroState>(
  state => ({
    liveSession: state.wsSession
  }),
  (dispatch: TDispatch) => ({
  })
)(LiveTextEditorInternal);
