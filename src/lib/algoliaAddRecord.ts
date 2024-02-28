import { indexName, searchClient } from "$lib/algoliaClient";
import type { Player } from "src/routes/+page.svelte";

export function addRecords(players: Player[]): void {
    // Create a new index if it does not exist and add a record
    const index = searchClient.initIndex(indexName)

    for (let i = 0; i < players.length; i++) {
        const player: Player = players[i];
        const record = { 
            objectID: i, 
            name: player.name,
            team: player.team,
            age:  player.age,
            
            fgm:  player.fgm,
            fga:  player.fga,
            fgp:  player.fgp
        }
        index.saveObject(record).wait()
    }
}