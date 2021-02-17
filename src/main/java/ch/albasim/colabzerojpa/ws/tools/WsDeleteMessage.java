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

import ch.albasim.colabzerojpa.persistence.WithId;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 *
 * @author maxence
 */
public class WsDeleteMessage extends WsMessage {

    public static class IndexEntry {

        private final String type;
        private final Long id;

        public IndexEntry(WithId object) {
            this.type = object.getJsonBType();
            this.id = object.getId();
        }

        public String getType() {
            return type;
        }

        public Long getId() {
            return id;
        }

    }

    private Collection<IndexEntry> items;

    public WsDeleteMessage(Collection<IndexEntry> objects) {
        this.items = objects;
    }

    public Collection<IndexEntry> getItems() {
        return items;
    }

    public void setItems(List<IndexEntry> items) {
        this.items = items;
    }

}
