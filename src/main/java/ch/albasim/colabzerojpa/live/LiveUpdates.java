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

import ch.albasim.colabzerojpa.persistence.utils.changes.Change;
import ch.albasim.colabzerojpa.persistence.utils.changes.MicroChange;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 *
 * @author maxence
 */
public class LiveUpdates implements Serializable {

    private String targetClass;
    private Long targetId;

    private Long revision;

    private String content;

    private List<Change> pendingChanges = new ArrayList<>();

    public String getTargetClass() {
        return targetClass;
    }

    public void setTargetClass(String targetClass) {
        this.targetClass = targetClass;
    }

    public Long getTargetId() {
        return targetId;
    }

    public void setTargetId(Long targetId) {
        this.targetId = targetId;
    }

    public Long getRevision() {
        return revision;
    }

    public void setRevision(Long revision) {
        this.revision = revision;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<Change> getPendingChanges() {
        return pendingChanges;
    }

    public void setPendingChanges(List<Change> pendingChanges) {
        this.pendingChanges = pendingChanges;
    }

    public List<Change> getByParent(List<Change> changes, String basedOn) {
        List<Change> collect = changes.stream()
                .filter(ch -> ch.getBasedOn().equals(basedOn))
                .collect(Collectors.toList());
        return new ArrayList<Change>(collect);
    }

    private void modifyOffset(Map<Integer, Integer> offsets, Integer index, Integer value) {
        Integer currentOffset = offsets.get(index);
        if (currentOffset == null) {
            currentOffset = 0;
        }
        currentOffset += value;
        System.out.println("  modOffset 1) " + offsets);

        offsets.put(index, currentOffset);

        System.out.println("  modOffset 2) " + offsets);

        Map<Integer, Integer> modified = new HashMap<>();

        // shift offsets after current index
        for (var entry : offsets.entrySet()) {
            Integer key = entry.getKey();

            if (key > index && key < index + value) {
                System.out.println("CONFLIT");
            }
            if (key > index) {
                // move offset to new index
                Integer v = entry.getValue();
                if (v != null) {
                    int newKey = key + value;
                    int newValue = v;
                    if (offsets.containsKey(newKey)) {
                        newValue = offsets.get(newKey) + newValue;
                    }
                    modified.put(key, 0);
                    modified.put(newKey, newValue);
                }
            }
        }

        System.out.println("  modOffset 3) " + modified);

        // merge shifted offsets
        for (var entry : modified.entrySet()) {
            Integer key = entry.getKey();
            int current = entry.getValue();
            offsets.put(key, current);
        }

        System.out.println(" mod Offsets: " + offsets);
    }

    private void applyChange(StringBuilder buffer, MicroChange mu) {
        System.out.println(mu);
        if (mu.getType() == MicroChange.Type.D) {
            buffer.delete(mu.getOffset(), mu.getOffset() + mu.getLength());
        } else if (mu.getType() == MicroChange.Type.I) {
            buffer.insert(mu.getOffset(), mu.getValue());
        }
    }

    private Map<Integer, Integer> computeOffset(Change change) {
        Map<Integer, Integer> offsets = new HashMap<>();

        List<MicroChange> muChanges = change.getChanges();
        for (int i = muChanges.size() - 1; i >= 0; i--) {
            MicroChange mu = muChanges.get(i);
            if (mu.getType() == MicroChange.Type.D) {
                modifyOffset(offsets, mu.getOffset(), -mu.getLength());
            } else if (mu.getType() == MicroChange.Type.I) {
                modifyOffset(offsets, mu.getOffset(), mu.getValue().length());
            }
        }

        return offsets;
    }

    private boolean shift(Change change, Map<Integer, Integer> offsets, boolean forward) {
        boolean conflictFree = true;
        int way = forward ? 1 : -1;

        for (MicroChange mu : change.getChanges()) {
            int delta = 0;
            for (Map.Entry<Integer, Integer> entry : offsets.entrySet()) {
                if (mu.getOffset() >= entry.getKey()) {
                    // Shift micro change
                    if (entry.getKey() + entry.getValue() >= mu.getOffset()) {
                        System.out.println("AVERYConflict : " + mu);
                        conflictFree = false;
                    }
                    delta += entry.getValue() * way;
                }
            }
            if (delta != 0) {
                mu.setOffset(mu.getOffset() + delta);
            }
        }

        return conflictFree;
    }

    /**
     *
     * @param parent
     * @param offsets
     * @return conflict free propagation or not
     */
    private boolean propagateOffset(List<Change> changes, String parent, Map<Integer, Integer> offsets, boolean forward) {
        boolean conflictFree = true;
        for (Change child : getByParent(changes, parent)) {
            boolean shiftFree = this.shift(child, offsets, forward);
            boolean pFree = this.propagateOffset(changes, child.getNewRevision(), offsets, forward);
            conflictFree = conflictFree && shiftFree && pFree;
        }
        return conflictFree;
    }

    /**
     *
     * @param newBase
     * @param change
     * @param offsets
     *
     * @return true if rebase has been done without conflict
     */
    private boolean rebase(Change newBase, Change change) {
        if (newBase.getBasedOn().equals(change.getBasedOn())) {
            Map<Integer, Integer> offsets = computeOffset(newBase);
            boolean conflictFree = true;

            System.out.println("Rebase Sieblings: " + change + " on " + newBase
                    + " with offset " + offsets);
            change.setBasedOn(newBase.getNewRevision());

            conflictFree = shift(change, offsets, true) && conflictFree;
            conflictFree = propagateOffset(pendingChanges, change.getNewRevision(),
                    offsets, conflictFree) && conflictFree;

            System.out.println(" -> " + change);
            return conflictFree;
        } else if (newBase.getBasedOn().equals(change.getNewRevision())) {
            System.out.println("Inverse hierachy : " + change + " on " + newBase);
            // [x] -> change -> newBase
            // ==>[x] ->  newBase -> change

            boolean conflictFree = true;

            Map<Integer, Integer> changeOffsets = computeOffset(change);

            newBase.setBasedOn(change.getBasedOn());
            change.setBasedOn(newBase.getNewRevision());

            conflictFree = shift(newBase, changeOffsets, false) && conflictFree;

            Map<Integer, Integer> newBaseOffsets = computeOffset(newBase);
            conflictFree = shift(change, newBaseOffsets, true) && conflictFree;

            System.out.println(" with offsets " + changeOffsets + " and " + newBaseOffsets);
            System.out.println(" -> " + change);

            return conflictFree;
        } else {
            throw new RuntimeException("Changes must be sieblings or newBase must be a child of change");
        }
    }

    public List<Change> filterByAuthor(List<Change> changes, String author) {
        return changes.stream()
                .filter(child
                        -> child.getLiveSession().equals(author))
                .collect(Collectors.toList());
    }

    public String process(boolean strict) {
        StringBuilder buffer = new StringBuilder(this.content);

        String previousRev = "0";

        List<Change> changes = this.getPendingChanges();

        while (!changes.isEmpty()) {
            List<Change> children = getByParent(changes, previousRev);
            if (!children.isEmpty()) {
                //Map<Integer, Integer> offsets = new HashMap<>();
                System.out.print("\n");
                //System.out.println("new empty offsets " + offsets);

                // apply first child only
                Change change = children.remove(0);
                changes.remove(change);

                System.out.println("Process: " + change);

                List<MicroChange> muChanges = change.getChanges();
                for (int i = muChanges.size() - 1; i >= 0; i--) {
                    applyChange(buffer, muChanges.get(i));
                    System.out.println("  " + i + ")" + buffer);
                }

                System.out.println(" -> " + buffer);
                //System.out.println("Offsets" + offsets);
                // rebase others children

                changes.removeAll(children);
                for (int i = children.size() - 1; i >= 0; i--) {
                    Change child = children.remove(i);
                    if (!rebase(change, child)) {
                        if (strict) {
                            // todo throw ?
                            throw new RuntimeException("Conflict");
                        }
                    }
                    changes.add(0, child);
                }
                previousRev = change.getNewRevision();

            } else {
                throw new RuntimeException("This is buggy");
            }
        }

        return buffer.toString();
    }
}
