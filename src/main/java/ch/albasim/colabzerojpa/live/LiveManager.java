/*
 * Copyright (C) 2021 AlbaSim, MEI, HEIG-VD, HES-SO
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
package ch.albasim.colabzerojpa.live;

import ch.albasim.colabzerojpa.ejb.CardFacade;
import ch.albasim.colabzerojpa.persistence.Card;
import ch.albasim.colabzerojpa.persistence.utils.changes.Change;
import ch.albasim.colabzerojpa.persistence.utils.changes.MicroChange;
import ch.albasim.colabzerojpa.ws.WebsocketEndpoint;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import javax.cache.Cache;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

/**
 *
 * @author maxence
 */
//@Clustered
@ApplicationScoped
public class LiveManager implements Serializable {

    @Inject
    private Cache<Long, LiveUpdates> cache;

    @Inject
    private CardFacade cardFacade;

    private LiveUpdates get(Long id) {

        if (cache.containsKey(id)) {
            return cache.get(id);
        } else {
            LiveUpdates l = new LiveUpdates();

            Card card = cardFacade.getCard(id);

            l.setContent(card.getContent());
            l.setRevision(card.getRevision());
            l.setTargetClass(card.getJsonBType());
            l.setTargetId(card.getId());

            return l;
        }
    }

    public void patchCard(Long id, Change patch) {
        LiveUpdates get = get(id);
        List<Change> changes = get.getPendingChanges();
        //if (!changes.isEmpty()) {
        //    Change last = changes.get(changes.size() - 1);
        //    patch.setBasedOn(last.getNewRevision());
        //}

        changes.add(patch);
        cache.put(id, get);
        WebsocketEndpoint.propagateChange(patch);
    }

    public List<Change> getPendingChanges(Long id) {
        LiveUpdates get = cache.get(id);
        if (get != null) {
            return get.getPendingChanges();
        } else {
            return new ArrayList<>();
        }
    }

    public List<Change> deletePendingChanges(Long id) {
        List<Change> changes = getPendingChanges(id);
        cache.remove(id);
        WebsocketEndpoint.propagateChangeDeletion(changes);
        return changes;
    }

    public List<Change> getAllPendingChanges() {
        List<Change> changes = new LinkedList<>();
        Iterator<Cache.Entry<Long, LiveUpdates>> it = cache.iterator();
        while (it.hasNext()) {
            changes.addAll(it.next().getValue().getPendingChanges());
        }
        return changes;
    }

    public String applyPatchCard(String content, Change change) {
        StringBuilder buffer = new StringBuilder(content);

        List<MicroChange> changes = change.getChanges();
        for (int i = changes.size() - 1; i >= 0; i--) {
            MicroChange mu = changes.get(i);
            if (mu.getType() == MicroChange.Type.D) {
                buffer.delete(mu.getOffset(), mu.getLength());
            } else if (mu.getType() == MicroChange.Type.I) {
                buffer.insert(mu.getOffset(), mu.getValue());
            }
        }
        return buffer.toString();
    }

    public void processAll() {
        Iterator<Cache.Entry<Long, LiveUpdates>> it = cache.iterator();
        while (it.hasNext()) {
            it.next().getValue().process(false);
        }
    }
}
