/*
 * colabzero
 * https://www.albasim.ch
 *
 * Copyright (c) 2020 School of Business and Engineering Vaud, Comem, MEI
 * Licensed under the MIT License
 */

import * as React from "react";
import {Card} from "../API/client";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faTimes, faCheck, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {deleteCard} from "../store";
import {itemCard, iconStyle, whiteIconStyle} from "./style";

export function Destroyer({card}: {card: Card}) {
    const [waitDeleteConfirm, setConfirm] = React.useState(false);

    return (
        <div>
            {waitDeleteConfirm ? (
                <div>
                    <FontAwesomeIcon
                        className={whiteIconStyle}
                        icon={faTimes}
                        onClick={() => setConfirm(false)}
                    />
                    <FontAwesomeIcon
                        className={whiteIconStyle}
                        icon={faCheck}
                        onClick={() => deleteCard(card)}
                    />
                </div>
            ) : (
                    <div>
                        <FontAwesomeIcon
                            className={whiteIconStyle}
                            icon={faTrashAlt}
                            onClick={() => setConfirm(true)}
                        />
                    </div>
                )}
        </div>
    );
}
