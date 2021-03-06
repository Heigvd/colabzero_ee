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
import javax.json.bind.annotation.JsonbProperty;

/**
 *
 * @author maxence
 */
public class MicroChange implements Serializable {

    public enum Type {
        I,
        D
    }

    @JsonbProperty("o")
    private Integer offset;

    @JsonbProperty("t")
    private Type type;

    @JsonbProperty("v")
    private String value;

    @JsonbProperty("l")
    private Integer length;

    public Integer getOffset() {
        return offset;
    }

    public void setOffset(Integer offset) {
        this.offset = offset;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Integer getLength() {
        return length;
    }

    public void setLength(Integer length) {
        this.length = length;
    }

    public String toString() {
        if (type == Type.D) {
            return "delete " + length + " from " + offset;
        } else {
            return "insert '" + value + "' at " + offset;
        }
    }

}
