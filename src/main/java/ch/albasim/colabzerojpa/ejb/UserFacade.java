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

import ch.albasim.colabzerojpa.persistence.Card;
import ch.albasim.colabzerojpa.persistence.User;
import ch.albasim.colabzerojpa.ws.WebsocketEndpoint;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

/**
 *
 * @author maxence
 */
@Stateless
@LocalBean
public class UserFacade {

    @PersistenceContext(unitName = "THE_PU")
    private EntityManager em;

    public List<User> getUsers() {
        TypedQuery<User> query = em.createNamedQuery("User.findAll", User.class);
        return query.getResultList();
    }

    public User getUser(Long id) {
        return em.find(User.class, id);
    }

    public User getUser(String username) {
        TypedQuery<User> query = em.createNamedQuery("User.findByUsername", User.class);
        query.setParameter("username", username);
        return query.getSingleResult();
    }

    public User updateUser(User user) {
        User mUser = this.getUser(user.getId());

        mUser.setDisplayName(user.getDisplayName());

        return mUser;
    }

    public User createUser(User user) {
        User newUser = new User();
        newUser.setUsername(user.getUsername());
        newUser.setDisplayName(user.getDisplayName());
        em.persist(newUser);
        return newUser;
    }

}
