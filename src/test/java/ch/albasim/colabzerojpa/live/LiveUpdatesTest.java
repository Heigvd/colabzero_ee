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
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

/**
 *
 * @author maxence
 */
public class LiveUpdatesTest {

    @Test
    public void testProcess() {
        String session1 = "s1";

        LiveUpdates lu = new LiveUpdates();

        lu.setContent("");
        lu.setRevision(0l);
        lu.setTargetClass("@test");
        lu.setTargetId(0l);

        lu.setPendingChanges(new ArrayList<>());
        List<Change> chs = lu.getPendingChanges();

        chs.add(Change.build(session1, "0", "1")
                .ins(0, "Salut"));

        chs.add(Change.build(session1, session1 + "::1", "2")
                .ins(5, " les co"));

        chs.add(Change.build(session1, session1 + "::2", "3")
                .ins(12, "pains"));

        String process = lu.process(false);
        Assertions.assertEquals("Salut les copains", process);
        System.out.println("LU: " + process);

    }

    @Test
    public void testProcess2() {
        String session1 = "s1";
        String session2 = "s2";

        LiveUpdates lu = new LiveUpdates();

        lu.setContent("");
        lu.setRevision(0l);
        lu.setTargetClass("@test");
        lu.setTargetId(0l);

        lu.setPendingChanges(new ArrayList<>());
        List<Change> chs = lu.getPendingChanges();

        // "" -> "apple"
        chs.add(Change.build(session1, "0", "1")
                .ins(0, "apple"));

        // "apple" -> "apple banana"
        chs.add(Change.build(session1, session1 + "::1", "2")
                .ins(5, " banana"));

        // "apple banana" -> "apple broccoli"
        chs.add(Change.build(session2, session1 + "::2", "1")
                .del(7, 5)
                .ins(12, "roccoli"));

        // "apple banana" -> "apple banana carrot"
        chs.add(Change.build(session1, session1 + "::2", "3")
                .ins(12, " carrot"));

        String process = lu.process(false);

        Assertions.assertEquals("apple broccoli carrot", process);
    }

    @Test
    public void testProcess3() {
        String session1 = "sjkhds3432-3423432-ed";
        String session2 = "834kjhds-dsfwezh-ddd7";

        LiveUpdates lu = new LiveUpdates();

        lu.setContent("");
        lu.setRevision(0l);
        lu.setTargetClass("@test");
        lu.setTargetId(0l);

        lu.setPendingChanges(new ArrayList<>());
        List<Change> chs = lu.getPendingChanges();

        // "" -> "apple"
        chs.add(Change.build(session1, "0", "1")
                .ins(0, "apple"));

        // "apple" -> "apple banana"
        chs.add(Change.build(session1, session1 + "::1", "2")
                .ins(5, " banana"));

        // "apple banana" -> "apple broccoli"
        chs.add(Change.build(session2, session1 + "::2", "1")
                .del(7, 5)
                .ins(12, "roccoli"));

        // "apple broccoli" -> "apple, broccoli, "
        chs.add(Change.build(session2, session2 + "::1", "2")
                .ins(5, ",")
                .ins(14, ","));

        // "apple banana" -> "apple banana carrot"
        chs.add(Change.build(session1, session1 + "::2", "3")
                .ins(12, " carrot"));

        String process = lu.process(false);

        Assertions.assertEquals("apple, broccoli carrot,", process);
    }

    @Test
    public void testDeepBranch() {
        String session1 = "s1";
        String session2 = "s2";

        LiveUpdates lu = new LiveUpdates();

        lu.setContent("apple banana cherry durian\n"
                + "asparagus broccoli carrot daikon");
        lu.setRevision(0l);
        lu.setTargetClass("@test");
        lu.setTargetId(0l);

        lu.setPendingChanges(new ArrayList<>());
        List<Change> chs = lu.getPendingChanges();

        // session 1 -> three commit branch
        // "apple ..."+ -> "apricots ..."
        chs.add(Change.build(session1, "0", "1")
                .del(1, 4).ins(5, "pricot"));

        // "apricot banana -> "apricot blueberry"
        chs.add(Change.build(session1, session1 + "::1", "2")
                .del(9, 5).ins(14, "lueberry"));

        // "apricot blueberry cherry durian" -> "apricot blueberry cherry durian elderberry"
        chs.add(Change.build(session1, session1 + "::2", "3")
                .ins(31, " elderberry"));

        // session 2 -> three commit branch
        // "[...]asparagus broccoli"+ -> "[...]bean"
        int delta = 27;
        chs.add(Change.build(session2, "0", "1")
                .del(delta + 11, 7).ins(delta + 18, "ean"));

        // "asparagus bean carrot-> "asparagus bean cucumber"
        chs.add(Change.build(session2, session2 + "::1", "2")
                .del(delta + 16, 5).ins(delta + 21, "ucumber"));

        // "asparagus bean cucumber daikon" -> "asparagus bean cucumber daikon eggplant"
        chs.add(Change.build(session2, session2 + "::2", "3")
                .ins(delta + 30, " eggplant"));

        String process = lu.process(false);

        Assertions.assertEquals("apricot blueberry cherry durian elderberry\n"
                + "asparagus bean cucumber daikon eggplant", process);
    }

    @Test
    public void testConflict() {
        String session1 = "s1";
        String session2 = "s2";

        LiveUpdates lu = new LiveUpdates();

        lu.setContent("");
        lu.setRevision(0l);
        lu.setTargetClass("@test");
        lu.setTargetId(0l);

        lu.setPendingChanges(new ArrayList<>());
        List<Change> chs = lu.getPendingChanges();

        // "" -> "apple"
        chs.add(Change.build(session1, "0", "1")
                .ins(0, "apple"));

        // "apple" -> "apple banana carrot"
        chs.add(Change.build(session1, session1 + "::1", "2")
                .ins(5, " banana carrot"));

        // "apple banana carrot" -> "apple broccoli carrot"
        chs.add(Change.build(session1, session1 + "::2", "3")
                .del(7, 5)
                .ins(12, "roccoli"));

        // "apple banana carrot" -> "apple broccoli carrot"
        chs.add(Change.build(session2, session1 + "::2", "1")
                .del(7, 5)
                .ins(12, "lueberry"));

        String process = lu.process(false);

        Assertions.assertEquals("apple brolueberry carrot", process);
    }

    @Test
    public void testScriptConflict() {
        Assertions.assertThrows(RuntimeException.class, () -> {
            String session1 = "s1";
            String session2 = "s2";

            LiveUpdates lu = new LiveUpdates();

            lu.setContent("");
            lu.setRevision(0l);
            lu.setTargetClass("@test");
            lu.setTargetId(0l);

            lu.setPendingChanges(new ArrayList<>());
            List<Change> chs = lu.getPendingChanges();

            // "" -> "apple"
            chs.add(Change.build(session1, "0", "1")
                    .ins(0, "apple"));

            // "apple" -> "apple banana carrot"
            chs.add(Change.build(session1, session1 + "::1", "2")
                    .ins(5, " banana carrot"));

            // "apple banana carrot" -> "apple broccoli carrot"
            chs.add(Change.build(session1, session1 + "::2", "3")
                    .del(7, 5)
                    .ins(12, "roccoli"));

            // "apple banana carrot" -> "apple broccoli carrot"
            chs.add(Change.build(session2, session1 + "::2", "1")
                    .del(7, 5)
                    .ins(12, "lueberry"));

            String process = lu.process(true);
        });
    }
}
