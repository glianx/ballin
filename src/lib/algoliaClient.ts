import algoliasearch, { type SearchClient } from "algoliasearch";

const indexName: string = 'ballin-index-0';

const searchClient: SearchClient = algoliasearch(
    "ZURBPQ9KTP",
    "f6af10260780491fbeb6a93788ccbb04"
);

export { indexName, searchClient, };