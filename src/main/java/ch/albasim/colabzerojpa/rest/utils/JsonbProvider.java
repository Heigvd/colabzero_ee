package ch.albasim.colabzerojpa.rest.utils;

import ch.albasim.colabzerojpa.jsonb.DateDeserializer;
import ch.albasim.colabzerojpa.jsonb.DateSerializer;
import javax.json.bind.Jsonb;
import javax.json.bind.JsonbBuilder;
import javax.json.bind.JsonbConfig;
import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;

/**
 *
 * @author Hippolyte
 */
@Provider
public class JsonbProvider implements ContextResolver<Jsonb> {

    /**
     *
     */
    //ObjectMapper mapper;
    /**
     * {@inheritDoc}
     */
    @Override
    public Jsonb getContext(Class<?> aClass) {
        return JsonbProvider.getMapper();
    }

    /**
     *
     * @return an ObjectMapper
     */
    public static Jsonb getMapper() {
        JsonbConfig config = new JsonbConfig()
                .withFormatting(true)
                .withSerializers(new DateSerializer())
                .withDeserializers(new DateDeserializer());

        return JsonbBuilder.create(config);
    }
}
