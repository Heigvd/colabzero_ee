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
package ch.albasim.colabzerojpa.persistence.utils.changes;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author maxence
 */
public class Change implements Serializable {

    private String atClass;
    private Long atId;

    /**
     * empty means first change
     */
    private String basedOn;

    private String newRevision;

    /**
     * aka websocket sessionId
     */
    private String liveSession;

    private List<MicroChange> changes = new ArrayList<>();

    public List<MicroChange> getChanges() {
        return changes;
    }

    public void setChanges(List<MicroChange> changes) {
        this.changes = changes;
    }

    public String getAtClass() {
        return atClass;
    }

    public void setAtClass(String atClass) {
        this.atClass = atClass;
    }

    public Long getAtId() {
        return atId;
    }

    public void setAtId(Long atId) {
        this.atId = atId;
    }

    public String getBasedOn() {
        return basedOn;
    }

    public void setBasedOn(String basedOn) {
        this.basedOn = basedOn;
    }

    public String getNewRevision() {
        return newRevision;
    }

    public void setNewRevision(String newRevision) {
        this.newRevision = newRevision;
    }

    public String getLiveSession() {
        return liveSession;
    }

    public void setLiveSession(String liveSession) {
        this.liveSession = liveSession;
    }

    public String toString() {
        return "Patch " + this.atClass + ":" + this.atId + "@" + this.basedOn + " " + this.changes + " => " + this.newRevision;
    }

    public static Change build(String liveSession, String basedOn, String newRevision) {
        Change ch = new Change();
        ch.setBasedOn(basedOn);
        ch.setLiveSession(liveSession);
        ch.setNewRevision(liveSession + "::" + newRevision);

        return ch;
    }

    public Change ins(int offset, String data) {
        MicroChange mu = new MicroChange();
        mu.setType(MicroChange.Type.I);
        mu.setOffset(offset);
        mu.setValue(data);
        this.changes.add(mu);

        return this;
    }

    public Change del(int offset, int length) {
        MicroChange mu = new MicroChange();
        mu.setType(MicroChange.Type.D);
        mu.setOffset(offset);
        mu.setLength(length);
        this.changes.add(mu);
        return this;
    }
}
