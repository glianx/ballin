import algoliasearch, { type SearchClient } from "algoliasearch";

const searchClient: SearchClient = algoliasearch(
    "ZURBPQ9KTP",
    "f6af10260780491fbeb6a93788ccbb04"
);

export { searchClient };