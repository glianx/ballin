<script lang="ts">
    // import { rawData } from "$lib/data";
    import { rawData } from "$lib/players-2024-playoffs";
    import { rawIDs } from "$lib/playerIDs";
    import { send, receive } from "$lib/transition";
    import { writable, type Writable } from "svelte/store";
    import { addRecords } from "$lib/algoliaAddRecord";

    import { searchClient } from "$lib/algoliaClient";

    interface Player {
        name: string;
        team: string;
        age: number;

        fgm: number;
        fga: number;
        fgp: number;

        img: string;
    }

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
            FGP = Math.round((getFGM(playerData) / getFGA(playerData)) * 1000) / 10;
        return FGP;
    }

    // allData includes headers
    const allData: string[] = rawData.split("\n");
    let players: Player[] = [];

    // does not include headers
    const playersData: string[] = allData.slice(2);

    const allIDs: string[] = rawIDs.split("\n");

    for (let i: number = 0; i < playersData.length; i++) {
        const playerData: string[] = playersData[i].split(",");
        let player: Player = {
            name: playerData[0],
            team: playerData[1],
            age: parseInt(playerData[2]),

            fga: getFGA(playerData),
            fgm: getFGM(playerData),
            fgp: getFGP(playerData),

            img: "https://cdn.nba.com/headshots/nba/latest/1040x760/"+getPlayerID(playerData[0])+".png"
        };
        players[i] = player;
    }

    let userPlayer: Player = {
        name: "Leo Liang",
        team: "TOR",
        age: 12,

        fga: 0,
        fgm: 0,
        fgp: 0,

        img: "src/lib/leo-nba.png"
    };

    players.push(userPlayer);
    quickSortPlayers(players, 0, players.length - 1);

    // players = quickSortPlayers(players, 0, players.length - 1);

    const { subscribe, update }: Writable<Player[]> = writable(players);
    
    const playersStore = {
        subscribe,
        addOneUserScore: () => {
            userPlayer = {
                ...userPlayer,
                fga: userPlayer.fga + 1,
                fgm: userPlayer.fgm + 1,
                fgp:
                    Math.round(
                        ((userPlayer.fgm + 1) / (userPlayer.fga + 1)) * 1000
                    ) / 10,
            };
            update((p) => [
                ...p.filter((p) => p.name !== userPlayer.name),
                userPlayer,
            ]);
            console.log({ players, userPlayer });

            update((p) => quickSortPlayers(p, 0, p.length - 1));
        },
        addZeroUserScore: () => {
            userPlayer = {
                ...userPlayer,
                fga: userPlayer.fga + 1,
                fgm: userPlayer.fgm,
                fgp:
                    Math.round(
                        ((userPlayer.fgm) / (userPlayer.fga + 1)) * 1000
                    ) / 10,
            };
            update(($players) => [
                ...$players.filter((p) => p.name !== userPlayer.name),
                userPlayer,
            ]);
            console.log({ players, userPlayer });

            update((p) => quickSortPlayers(p, 0, p.length - 1));
            $playersStore = $playersStore;

        },

        remove: (player: Player) => {
            update(($players) =>
                $players.filter((p) => p.name !== player.name)
            );
        },
    };

    function quickSortPlayers(players: Player[], left: number, right: number): Player[] {
        let l = left;
        let r = right;
        
        let p = players[Math.floor((l + r) / 2)].fgp;
        
        while (l <= r) {
            while (players[l].fgp > p) {
                l++;
            }
            while (players[r].fgp < p) {
                r--;
            }
            
            if (l <= r) {
                [players[l], players[r]] = [players[r], players[l]];
                l++;
                r--;
            }
        }
        if (left < r) 
            quickSortPlayers(players, left, r);
        if (l < right)
            quickSortPlayers(players, l, right);

        return players;

        // players = players;
        // update(($players) => players);
    }

    function getPlayerID(name: string) {
        for (let i = 0; i < allIDs.length; i++) {
            let nameID: string[] = allIDs[i].split(",");
            if (name === nameID[0]) {
                return nameID[1];
            }
        }
    }

    // console.log(players);

    let indexName: string = 'players-2024-playoffs';
    addRecords(players, indexName);

    // let userIndexName: string = 'user-index-0';
    



    export { Player };
</script>





<div class="w-1/2 p-5">
    {#each $playersStore as player (player?.name)}
        <div
            class="flex justify-between text-xl"
            in:receive={{ key: player.name }}
            out:send={{ key: player.name }}
        >
            <p>{player.name}</p>
            <p>{player.fgp.toFixed(1)}</p>
            {#if player.name != userPlayer.name}
                <img
                    src="https://cdn.nba.com/headshots/nba/latest/1040x760/{getPlayerID(
                        player.name
                    )}.png"
                    class="object-cover h-18 w-24"
                    alt="player"
                />
            {:else}
                <img
                    src="src/lib/leo-nba.png"
                    class="object-cover h-18 w-24"
                    alt="player"
                />
            {/if}

            <!-- <p>{player.name}, {player.fgp.toFixed(1)}</p> -->
            <button
                on:click={() => playersStore.remove(player)}
                aria-label="Remove">x</button
            >
        </div>
    {/each}

    <div class="text-xl">
		<button on:click={() => playersStore.addOneUserScore()}>+ 1</button>
		<button on:click={() => playersStore.addZeroUserScore()}>+ 0</button>
	</div>
</div>

<!-- <style>
	button {
		background-image: url($lib/remove.svg);
	}
</style> -->
