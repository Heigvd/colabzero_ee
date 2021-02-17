package ch.albasim.colabzerojpa.ejb;

import ch.albasim.colabzerojpa.persistence.WithId;
import java.io.Serializable;
import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.inject.Inject;
import javax.transaction.TransactionScoped;
import javax.transaction.TransactionSynchronizationRegistry;

/**
 *
 * @author maxence
 */
@TransactionScoped
public class RequestManager implements Serializable {

    @Resource
    private transient TransactionSynchronizationRegistry jtaSyncRegistry;

    private Sync sync;

    @PostConstruct
    public void construct() {
        if (jtaSyncRegistry != null && sync == null) {
            sync = new Sync();
            jtaSyncRegistry.registerInterposedSynchronization(sync);
        }
    }

    public void registerUpdate(WithId o) {
        sync.registerUpdate(o);
    }

    public void registerDelete(WithId o) {
        sync.registerDelete(o);
    }
}
