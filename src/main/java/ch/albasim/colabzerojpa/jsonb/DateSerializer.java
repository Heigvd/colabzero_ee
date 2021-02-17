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
package ch.albasim.colabzerojpa.jsonb;

import java.lang.reflect.Type;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import javax.json.bind.serializer.DeserializationContext;
import javax.json.bind.serializer.JsonbSerializer;
import javax.json.bind.serializer.SerializationContext;
import javax.json.stream.JsonGenerator;
import javax.json.stream.JsonParser;

/**
 * @author maxence
 */
public class DateSerializer implements JsonbSerializer<LocalDateTime> {

    public LocalDateTime deserialize(JsonParser parser, DeserializationContext ctx, Type rtType) {
        return LocalDateTime.ofInstant(Instant.ofEpochSecond(Long.parseLong(parser.getString())), ZoneId.systemDefault());
    }

    @Override
    public void serialize(LocalDateTime date, JsonGenerator generator, SerializationContext ctx) {
        generator.write(date.toEpochSecond(ZoneOffset.UTC));
    }
}
