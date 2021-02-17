/*
 * Copyright (C) 2021 Maxence
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
package ch.albasim.colabzerojpa.ejb;

import ch.albasim.colabzerojpa.persistence.WithId;
import ch.albasim.colabzerojpa.ws.WebsocketEndpoint;
import ch.albasim.colabzerojpa.ws.tools.WsDeleteMessage.IndexEntry;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.transaction.Status;
import javax.transaction.Synchronization;

/**
 *
 * @author maxence
 */
public class Sync implements Synchronization {

    private Set<WithId> updated = new HashSet<>();
    private Set<IndexEntry> deleted = new HashSet<>();

    @Override
    public void beforeCompletion() {
    }

    @Override
    public void afterCompletion(int status) {
        if (status == Status.STATUS_COMMITTED) {
            updated.removeAll(deleted);
            if (!updated.isEmpty()) {
                WebsocketEndpoint.propagate(updated);
            }
            if (!deleted.isEmpty()) {
                WebsocketEndpoint.propagateDeletion(deleted);
            }
        }
    }

    public void registerUpdate(WithId o) {
        updated.add(o);
    }

    public void registerDelete(WithId o) {
        deleted.add(new IndexEntry(o));
    }
}
