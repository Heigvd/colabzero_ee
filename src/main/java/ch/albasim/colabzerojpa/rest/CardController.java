/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ch.albasim.colabzerojpa.rest;

import ch.albasim.colabzerojpa.ejb.CardFacade;
import ch.albasim.colabzerojpa.live.LiveManager;
import ch.albasim.colabzerojpa.persistence.Card;
import ch.albasim.colabzerojpa.persistence.utils.changes.Change;
import java.util.List;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PATCH;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author maxence
 */
@Path("cards")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CardController {

    private static final Logger log = LoggerFactory.getLogger(CardController.class);

    @Inject
    private CardFacade cardFacade;

    @Inject
    private LiveManager liveManager;

    @GET
    public List<Card> getCards() {
        log.info("GET All");
        return cardFacade.getCards();
    }

    @GET
    @Path("/{id}")
    public Card getCard(@PathParam("id") Long id) {
        log.info("Post /{}", "TODO");
        return cardFacade.getCard(id);
    }

    @GET
    @Path("/pendings")
    public List<Change> getAllChanges(@PathParam("id") Long id) {
        log.info("Post /{}", "TODO");
        return liveManager.getAllPendingChanges();
    }

    @GET
    @Path("/{id}/pendings")
    public List<Change> getChanges(@PathParam("id") Long id) {
        log.info("Post /{}", "TODO");
        return liveManager.getPendingChanges(id);
    }

    @DELETE
    @Path("/{id}/pendings")
    public List<Change> deleteChanges(@PathParam("id") Long id) {
        log.info("Post /{}", "TODO");
        return liveManager.deletePendingChanges(id);
    }

    @POST
    public Long createCard(Card card) {
        log.info("Post /{}", card);
        return cardFacade.createCard(card).getId();
    }

    @PUT
    public void updateCard(Card card) {
        cardFacade.updateCard(card);
    }

    @PATCH
    @Path("/{id}")
    public void updateCard(@PathParam("id") Long id, Change change) {
        cardFacade.patchCard(id, change);
    }

    @DELETE
    @Path("/{id}")
    public void deleteCard(@PathParam("id") Long id) {
        cardFacade.deleteCard(id);
    }
}
