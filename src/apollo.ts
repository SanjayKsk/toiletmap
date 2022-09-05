import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { useMemo } from "react";



// initialize apollo client
function createApolloClient() {
    return new ApolloClient({
        link: new HttpLink({uri: "/api/graphql", credentials: "same-origin"}),
        cache: new InMemoryCache(),
        defaultOptions: {
            watchQuery: {
                fetchPolicy: "cache-and-network",
            },
        },
    });
}


//get instance of client

export function useApollo(){
    const client = useMemo(() => createApolloClient(), []);
    return client;
}
