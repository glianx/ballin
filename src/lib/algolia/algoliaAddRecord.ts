import { searchClient } from "$lib/algolia/algoliaClient";
import type { Player } from "src/routes/+page.svelte";
import { getPlayerID } from "$lib/IDs/getIDs"

export function addRecords(players: Player[], indexName: string): void {
    // Create a new index if it does not exist and add a record
    const index = searchClient.initIndex(indexName)

    for (let i = 0; i < players.length; i++) {
        const player: Player = players[i];
        const record = { 
            objectID: getPlayerID(player.name), 
            name: player.name,
            team: player.team,
            age:  player.age,
            
            fgm:  player.fgm,
            fga:  player.fga,
            fgp:  player.fgp, 

            img: player.img
        }
        index.saveObject(record).wait()
    }
}