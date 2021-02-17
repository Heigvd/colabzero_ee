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
package ch.albasim.colabzerojpa.ws.tools;

import ch.albasim.colabzerojpa.persistence.utils.changes.Change;
import java.util.Collection;

/**
 *
 * @author maxence
 */
public class WsDeleteChangeMessage extends WsMessage {

    private final Collection<Change> payload;

    public WsDeleteChangeMessage(Collection<Change> payload) {
        this.payload = payload;
    }

    public Collection<Change> getPayload() {
        return payload;
    }

}
