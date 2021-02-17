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
import {inputStyle, iconStyle, disabledIconStyle} from "./style";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTimes, faCheck} from "@fortawesome/free-solid-svg-icons";

type State = {
    status: "SET" | "EDITING" | "WAITING";
    newValue: string;
}

const x = (v: string): string => {return v}

export const TextEditor = ({value, onChange}: {value: string, onChange: (newValue: string) => void}) => {

    const [state, setState] = React.useState<State>({
        status: "SET",
        newValue: value || ''
    });

    if (state.status === 'SET') {
        return <div>
            {value}
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
                value={state.newValue}
                onChange={(e) => setState({...state, newValue: e.target.value})}
            />
            <FontAwesomeIcon
                className={iconStyle}
                onClick={() => setState({status: "SET", newValue: value})}
                icon={faTimes}
            />

            {state.newValue != value ? (
                <FontAwesomeIcon
                    className={iconStyle}
                    icon={faCheck}
                    onClick={() => {
                        onChange(state.newValue);
                        setState({...state, status: "SET"})
                    }}
                />
            ) : (
                    <FontAwesomeIcon className={disabledIconStyle} icon={faCheck} />
                )}
        </div>;
    }
    return <div>not yet implemented</div>
}
