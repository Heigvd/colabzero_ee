/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ch.albasim.colabzerojpa.rest;

import ch.albasim.colabzerojpa.ejb.UserFacade;
import ch.albasim.colabzerojpa.persistence.User;
import java.util.List;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author maxence
 */
@Path("users")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @Inject
    private UserFacade userFacade;

    @GET
    public List<User> getUsers() {
        return userFacade.getUsers();
    }

    @POST
    public Long createUser(User u){
        return userFacade.createUser(u).getId();
    }

    @PUT
    public void updateUser(User u){
        userFacade.updateUser(u);
    }
}
