import { InMemoryCache } from "@apollo/client"

let cache: InMemoryCache;
export const getApolloClientCache = ():InMemoryCache => {
  if (!cache) {
    cache = new InMemoryCache();
  }
  return cache;
};
