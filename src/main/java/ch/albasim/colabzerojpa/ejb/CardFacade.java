/*
 * Copyright (C) 2021 maxence
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
package ch.albasim.colabzerojpa.ejb;

import ch.albasim.colabzerojpa.live.LiveManager;
import ch.albasim.colabzerojpa.persistence.Card;
import ch.albasim.colabzerojpa.persistence.utils.changes.Change;
import java.util.List;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

/**
 *
 * @author maxence
 */
@Stateless
@LocalBean
public class CardFacade {

    @PersistenceContext(unitName = "THE_PU")
    private EntityManager em;

    @Inject
    private LiveManager liveManager;

    public Card getCard(Long id) {
        return em.find(Card.class, id);
    }

    public List<Card> getCards() {
        TypedQuery<Card> query = em.createNamedQuery("Card.findAll", Card.class);
        return query.getResultList();
    }

    private void reviveCardUser(Card card) {
    }

    /**
     * Update paidBy, status and date
     *
     * @param card
     * @return
     */
    public Card updateCard(Card card) {
        Card mCard = this.getCard(card.getId());

        this.reviveCardUser(card);

        mCard.setContent(card.getContent());

        return mCard;
    }

    public Card createCard(Card card) {
        this.reviveCardUser(card);
        em.persist(card);
        return card;
    }

    public Card deleteCard(Long id) {
        Card card = this.getCard(id);
        em.remove(card);
        return card;
    }

    public void patchCard(Long id, Change change) {
        liveManager.patchCard(id, change);
    }
}
