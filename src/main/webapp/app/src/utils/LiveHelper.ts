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

import {Change, MicroChange} from "../API/client";
import * as Diff from "diff";
import {ZeroState} from "../store";


export const mapChangesByObject = (changes: Change[]): ZeroState['liveChanges'] => {
  return changes.reduce<ZeroState['liveChanges']>(
    (acc, cur) => {
      if (cur.atClass != null && cur.atId != null) {
        acc[cur.atClass] = acc[cur.atClass] || {};
        acc[cur.atClass][cur.atId] = acc[cur.atClass][cur.atId] || []
        acc[cur.atClass][cur.atId].push(cur);
      }
      return acc;
    }, {});
};


export const updateChange = (changes: ZeroState['liveChanges'], change: Change): ZeroState['liveChanges'] => {
  if (change.atClass != null && change.atId != null) {

    const newChanges: Change[] =
      (changes[change.atClass] && changes[change.atClass][change.atId]) ?
        changes[change.atClass][change.atId]
        :
        [];


    const idx = newChanges.findIndex(c => c.newRevision === change.newRevision);

    if (idx >= 0) {
      newChanges.splice(idx, 1, change);
    } else {
      newChanges.push(change);
    }

    return {
      ...changes,
      [change.atClass]: {
        ...changes[change.atClass],
        [change.atId]: newChanges
      }
    }
  }
  return changes;
};


export const removeChange = (changes: ZeroState['liveChanges'], change: Change): ZeroState['liveChanges'] => {
  if (change.atClass != null && change.atId != null && changes[change.atClass] && changes[change.atClass][change.atId]) {

    const newChanges = [...changes[change.atClass][change.atId]];

    const idx = changes[change.atClass][change.atId].findIndex(c => c.newRevision === change.newRevision);

    if (idx >= 0) {
      newChanges.splice(idx, 1, change);

      return {
        ...changes,
        [change.atClass]: {
          ...changes[change.atClass],
          [change.atId]: newChanges
        }
      }
    }
  }
  return changes;
};



export const getMicroChange = (previous: string, current: string): MicroChange[] => {
  console.log("Previous:", previous);
  console.log("New:", current);

  const diff = Diff.diffChars(previous, current);

  console.log("Diff: ", diff);
  let currentOffset = 0;
  const changes: MicroChange[] = [];

  for (const current of diff) {
    if (current.added) {
      changes.push({
        t: 'I' as 'I',
        o: currentOffset,
        v: current.value,
      });
    } else if (current.removed) {
      changes.push({
        t: 'D' as 'D',
        o: currentOffset,
        l: current.count || 0,
      });
    }

    currentOffset += (current.count || 0);
  }

  console.log("Changeset: ", changes);
  return changes;
}

export const getMicroChangeReduce = (previous: string, current: string): MicroChange[] => {
  console.log("Previous:", previous);
  console.log("New:", current);

  const diff = Diff.diffChars(previous, current);

  console.log("Diff: ", diff);

  const reduction = diff.reduce<{changes: MicroChange[]; offset: number}>(
    (acc, current) => {
      console.log("Acc: ", acc);
      console.log("Cur: ", current);
      const newOffset = acc.offset + (current.count || 0);
      console.log("NewOffset: ", newOffset);
      if (current.added) {
        const nAcc = {
          changes: [...acc.changes, {
            t: 'I' as 'I',
            o: acc.offset,
            v: current.value,
          }],
          offset: newOffset
        };
        console.log("NewAcc: ", nAcc);
        return nAcc;
      } else if (current.removed) {
        const nAcc = {
          changes: [...acc.changes, {
            t: 'D' as 'D',
            o: acc.offset,
            l: current.count || 0,
          }],
          offset: newOffset
        }
        console.log("NewAcc: ", nAcc);
        return nAcc;
      }
      const nAcc = {
        ...acc,
        offset: newOffset
      }
      console.log("NewAcc: ", nAcc);
      return nAcc;
    }, {changes: [], offset: 0});

  console.log("Changeset: ", reduction);

  return reduction.changes;
}

export const applyChanges = (content: string, changeset: Change[]): {
  value: string
  revision: string
} => {
  let buffer = content;

  let previousRev: string = "0";
  const changes = changeset.map(c => ({...c}));

  while (changes.length > 0) {
    const children = changes.filter(change => change.basedOn === previousRev);
    if (children.length > 0) {
      const offsets: {[index: number]: number} = {};

      // apply first child
      const change = children.shift()!;
      changes.splice(changes.indexOf(change), 1);

      const muChanges = [...change.changes];
      muChanges.reverse();

      for (const mu of muChanges) {
        let currentOffset = offsets[mu.o] || 0;

        if (mu.t === 'D') {
          buffer = buffer.substring(0, mu.o) + buffer.substring(mu.o + mu.l);
          currentOffset -= mu.l;
        } else if (mu.t === "I") {
          buffer = buffer.substring(0, mu.o) + mu.v + buffer.substring(mu.o);
          currentOffset += mu.v.length;
        }
        offsets[mu.o] = currentOffset;
      }

      // rebase sieblings
      children.reverse();
      for (const child of children) {
        changes.splice(changes.indexOf(child), 1);
        child.basedOn = change.newRevision;
        for (const mu of child.changes) {
          for (const index in offsets) {
            if (+index <= mu.o) {
              mu.o += offsets[index];
            }
          }
        }
        changes.unshift(child);
      }
      previousRev = change.newRevision;

    } else {
      throw new Error("Inconsistent changset: missing " + previousRev + " children");
    }
  }

  return {
    value: buffer,
    revision: previousRev
  }
}

/**
 * merge ch1 within ch2
 * returns changes which contains set of unique changes
 *         and duplicaets, which contains ch2 changes which
 *         previously exists in ch1
 *
 */
export const merge = (ch1: Change[], ch2: Change[]) => {
  return ch2.reduce<{
    changes: Change[],
    duplicates: Change[]
  }>((acc, cur) => {
    if (acc.changes.find(c => c.newRevision === cur.newRevision)) {
      return {
        changes: acc.changes,
        duplicates: [...acc.duplicates, cur]
      };
    } else {
      return {
        changes: [...acc.changes, cur],
        duplicates: acc.duplicates
      };
    }
  }, {changes: [...ch1], duplicates: []});
}


export const changesEquals = (ch1: Change[], ch2: Change[]) => {
  if (ch1.length !== ch2.length) {
    return false;
  }
  for (const i in ch1) {
    if (ch1[i].newRevision !== ch2[i].newRevision) {
      return false
    }
  }
  return true;
}

