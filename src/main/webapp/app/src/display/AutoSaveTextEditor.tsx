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
import {debounce} from 'lodash';

type State = {
    status: "EDITING";
    currentValue: string;
    savedValue?: string;
}

export const AutoSaveTextEditor = ({value, onChange}: {value: string, onChange: (newValue: string) => void}) => {

    const [state, setState] = React.useState<State>({
        status: "EDITING",
        currentValue: value || '',
        savedValue: undefined
    });

    const debouncedOnChange = React.useCallback(
        debounce((value: string) => {
            onChange(value);
        }, 1000), []);

    const onInternalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        debouncedOnChange(e.target.value)
        setState(
            {...state, currentValue: e.target.value}
        );
    }

    return <div>
        <textarea
            value={state.currentValue}
            onChange={onInternalChange}
        />
        {
            state.status !== 'EDITING' ?
                <FontAwesomeIcon
                    className={iconStyle}
                    pulse
                    icon={faTimes}
                />
                : null
        }
    </div>;
}
