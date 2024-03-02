import { searchClient } from "$lib/algolia/algoliaClient";
import type { Player } from "src/routes/+page.svelte";
import { getPlayerID } from "$lib/IDs/getIDs"
import { rawData } from "$lib/playerPacks/playerPack2024allStar";
// import { rawData } from `$lib/playerPacks/${playerPack}`;


export function addPlayerPack(indexName: string): void {
    // Promise.all(
    //     Array.from({ length: 10 }).map(
    //         (_, index) => import(`/modules/module-${index}.js`),
    //     ),
    // ).then((modules) => modules.forEach((module) => module.load()));
    
    // Create a new index if it does not exist and add a record
    const index = searchClient.initIndex(indexName)

    function getFGM(playerData: string[]): number {
        let FGM: number = 0;
        for (let i = 1; i < playerData.length / 3; i++)
            FGM += parseFloat(playerData[3 * i]);
        return FGM;
    }

    function getFGA(playerData: string[]): number {
        let FGA: number = 0;
        for (let i = 1; i < playerData.length / 3; i++)
            FGA += parseFloat(playerData[3 * i + 1]);
        return FGA;
    }

    function getFGP(playerData: string[]): number {
        let FGP: number = 0;
        if (getFGM(playerData) / getFGA(playerData))
            FGP =
                Math.round((getFGM(playerData) / getFGA(playerData)) * 1000) /
                10;
        return FGP;
    }


    // allData includes headers
    const allData: string[] = rawData.split("\n");
    let players: Player[] = [];

    // does not include headers
    const playersData: string[] = allData.slice(2);

    let i = 0;
    let j = 0;
    while (i < playersData.length) {
        const playerData: string[] = playersData[i].split(",");
        if (getPlayerID(playerData[0]) != "") {
            let player: Player = {
                name: playerData[0],
                team: playerData[1],
                age: parseInt(playerData[2]),

                fga: getFGA(playerData),
                fgm: getFGM(playerData),
                fgp: getFGP(playerData),

                img:
                    "https://cdn.nba.com/headshots/nba/latest/1040x760/" +
                    getPlayerID(playerData[0]) +
                    ".png",
                id: getPlayerID(playerData[0])
            };
            players[j] = player;
            j++;
        }
        i++;
    }

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