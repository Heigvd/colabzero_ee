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
package ch.albasim.colabzerojpa.ws;

import ch.albasim.colabzerojpa.persistence.WithId;
import ch.albasim.colabzerojpa.persistence.utils.changes.Change;
import ch.albasim.colabzerojpa.ws.tools.JsonDecoder;
import ch.albasim.colabzerojpa.ws.tools.JsonEncoder;
import ch.albasim.colabzerojpa.ws.tools.WsDeleteMessage;
import ch.albasim.colabzerojpa.ws.tools.WsDeleteMessage.IndexEntry;
import ch.albasim.colabzerojpa.ws.tools.WsInitMessage;
import ch.albasim.colabzerojpa.ws.tools.WsMessage;
import ch.albasim.colabzerojpa.ws.tools.WsUpdateChangeMessage;
import ch.albasim.colabzerojpa.ws.tools.WsUpdateMessage;
import java.io.IOException;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.websocket.CloseReason;
import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author maxence
 */
@ServerEndpoint(value = "/ws", encoders = JsonEncoder.class, decoders = JsonDecoder.class)
public class WebsocketEndpoint {

    private static final Logger log = LoggerFactory.getLogger(WebsocketEndpoint.class);

    private static Set<Session> sessions = Collections.synchronizedSet(new HashSet<Session>());

    public static void broadcastMessage(WsMessage message) {
        for (Session session : sessions) {
            try {
                session.getBasicRemote().sendObject(message);
            } catch (IOException | EncodeException e) {
                log.error("Broadcast message exception: {}", e);
            }
        }
    }

    @OnOpen
    public void onOpen(Session session) throws IOException, EncodeException {
        log.info("WebSocket opened: {}", session.getId());
        sessions.add(session);
        session.getBasicRemote().sendObject(new WsInitMessage(session));
    }

    @OnMessage
    public void onMessage(WsMessage message, Session session) {
        log.info("Message received: {} from {}", message, session.getId());
        try {
            session.getBasicRemote().sendObject(message);
        } catch (IOException | EncodeException e) {
            log.error("On message exception: {}", e);
        }
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        log.info("WebSocket error for {} {}", session.getId(), throwable.getMessage());
    }

    @OnClose
    public void onClose(Session session, CloseReason closeReason) {
        log.info("WebSocket closed for {} with reason {}", session.getId(), closeReason.getCloseCode());
        sessions.remove(session);
    }

    public static void propagate(Collection<WithId> o) {
        broadcastMessage(new WsUpdateMessage(o));
    }

    public static void propagateDeletion(Collection<IndexEntry> o) {
        broadcastMessage(new WsDeleteMessage(o));
    }

    public static void propagateChange(Collection<Change> patches) {
        broadcastMessage(new WsUpdateChangeMessage(patches));
    }

    public static void propagateChange(Change patch) {
        propagateChange(List.of(patch));
    }

    public static void propagateChangeDeletion(List<Change> changes) {
        broadcastMessage(new WsUpdateChangeMessage(changes));
    }

}
