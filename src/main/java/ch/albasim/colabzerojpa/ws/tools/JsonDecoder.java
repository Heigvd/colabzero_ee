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

import ch.albasim.colabzerojpa.rest.utils.JsonbProvider;
import java.io.StringReader;
import javax.json.Json;
import javax.json.JsonException;
import javax.json.JsonReader;
import javax.json.bind.Jsonb;
import javax.websocket.DecodeException;
import javax.websocket.Decoder;
import javax.websocket.EndpointConfig;

/**
 *
 * @author maxence
 */
public class JsonDecoder implements Decoder.Text<WsMessage> {

    @Override
    public WsMessage decode(String s) throws DecodeException {
        Jsonb jsonb = JsonbProvider.getMapper();
        return jsonb.fromJson(s, WsMessage.class);
    }

    @Override
    public boolean willDecode(String s) {
        try (JsonReader jsonReader = Json.createReader(new StringReader(s))) {
            jsonReader.readObject();
            return true;
        } catch (JsonException e) {
            return false;
        }
    }

    @Override
    public void init(EndpointConfig config) {
    }

    @Override
    public void destroy() {
    }

}
