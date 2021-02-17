
package ch.albasim.colabzerojpa.jsonb;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import javax.json.JsonObject;
import javax.json.bind.JsonbBuilder;
import javax.json.bind.serializer.DeserializationContext;
import javax.json.bind.serializer.JsonbDeserializer;
import javax.json.stream.JsonParser;
import org.reflections.Reflections;

/**
 *
 * @author Maxence
 */
public class ZeroDeserializer implements JsonbDeserializer<Jsonable> {

    private static final Map<String, Class<? extends Jsonable>> classesMap = new HashMap<>();

    public ZeroDeserializer() {
    }

    private static final Reflections reflections;

    static {
        reflections = new Reflections("ch.colabproject");
    }

    @Override
    public Jsonable deserialize(JsonParser parser, DeserializationContext ctx, Type rtType) {

        JsonObject value = parser.getObject();
        String atClass = value.getString("@class", null);

        Class<? extends Jsonable> theClass = classesMap.get(atClass);

        if (theClass == null) {
            Optional<Class<? extends Jsonable>> eClass = reflections.getSubTypesOf(Jsonable.class).stream().filter(cl -> cl.getSimpleName().equals(atClass)).findFirst();
            if (eClass.isPresent()) {
                theClass = eClass.get();
                classesMap.put(atClass, theClass);
            }
        }
        return JsonbBuilder.create().fromJson(value.toString(), theClass);
    }
}
