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
package ch.albasim.colabzerojpa.persistence.utils;

import ch.albasim.colabzerojpa.ejb.RequestManager;
import ch.albasim.colabzerojpa.persistence.WithId;
import javax.inject.Inject;
import javax.persistence.PostPersist;
import javax.persistence.PreRemove;
import javax.persistence.PostUpdate;

/**
 *
 * @author maxence
 */
public class EntityListener {

    @Inject
    private RequestManager requestManager;

    @PostPersist
    @PostUpdate
    public void onUpdate(Object o) {
        if (o instanceof WithId) {
            requestManager.registerUpdate((WithId) o);
        }
    }

    @PreRemove
    public void onDestroy(Object o) {
        if (o instanceof WithId) {
            requestManager.registerDelete((WithId) o);
        }
    }
}
