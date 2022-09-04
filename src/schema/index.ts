import { buildSchemaSync, Resolver, Query} from "type-graphql";
import { ImageResolver } from "./image";
import { ToiletResolver } from "./toilet";
import { authChecker } from "./auth";

@Resolver()
class DummyResolver {
    @Query(_returns => String)
    hello() {
        return "Hello World!";
    }
}

export const schema = buildSchemaSync({
    resolvers: [DummyResolver, ImageResolver, ToiletResolver],
    emitSchemaFile: process.env.NODE_ENV === "development",
    authChecker,
})