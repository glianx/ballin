<script lang="ts">
    export let data;

    let indexName: string = "playerPack2024regularSeason";
    import { rawData } from "$lib/playerPacks/playerPack2024allStar";
    import { rawIDs as rawPlayerIDs } from "$lib/IDs/playerIDs";
    import { rawIDs as rawTeamIDs } from "$lib/IDs/teamIDs";

    import("$lib/getPlayerInterface").Player;
    import { userPlayerInfo } from "$lib/userPlayer/getUserPlayer";
    import { getPlayerID, getTeamID, getTeamName } from "$lib/IDs/getIDs";
    import { addPlayerPack } from "$lib/algolia/algoliaAddPlayerPack";

    import { quickSortPlayers } from "$lib/sort";

    import { send, receive } from "$lib/transition";
    import { writable, type Writable } from "svelte/store";
    import { addRecords } from "$lib/algolia/algoliaAddRecord";

    import { searchClient } from "$lib/algolia/algoliaClient";
    import { onMount } from "svelte";

    let userPlayer: Player = userPlayerInfo;

    let playersBST: Player[] = [];
    let index: any;
    if (data.post?.title != null) {
        index = searchClient.initIndex(data.post?.slug);
    }

    const createStore = () => {
        const { subscribe, update, set }: Writable<Player[]> = writable([]);
        return {
            subscribe,
            loadPlayers: async () => {
                let players: Player[] = [];
                await index
                    .browseObjects({
                        batch: (batch: any) => {
                            players = players.concat(batch); // Accumulate players
                        },
                    })
                    .then(() => {
                        // remove userPlayer in case of duplicate in database
                        players = players.filter(
                            (p) => !(p.name == userPlayer.name && p.fga == 0)
                        );
                        
                        // create Binary Search Tree

                        for (let i: number = 0; i < players.length; i++) {
                            let j: number = 0;
                            while (playersBST[j] != null) {
                                if (players[i].fgp < playersBST[j].fgp) {
                                    j = 2 * j + 1;
                                } else {
                                    j = 2 * j + 2;
                                }
                            }
                            playersBST[j] = players[i];
                        }

                        // set playersStore as sorted players with userPlayer
                        players.push(userPlayer);
                        quickSortPlayers(players, 0, players.length - 1);
                        set(players);
                    })
                    .catch((error) => {
                        console.error(
                            "Failed to load players from Algolia",
                            error
                        );
                        set([]);
                    });
            },
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

                let playersBSTwithUser: Player[] =
                    returnPlayersBSTwithUser(playersBST);
                let orderedPlayers: Player[] = [];
                update((p) =>
                    returnPlayersFromBST(0, orderedPlayers, playersBSTwithUser)
                );
            },
            addZeroUserScore: () => {
                userPlayer = {
                    ...userPlayer,
                    fga: userPlayer.fga + 1,
                    fgm: userPlayer.fgm,
                    fgp:
                        Math.round(
                            (userPlayer.fgm / (userPlayer.fga + 1)) * 1000
                        ) / 10,
                };

                let playersBSTwithUser: Player[] =
                    returnPlayersBSTwithUser(playersBST);
                let orderedPlayers: Player[] = [];
                update((p) =>
                    returnPlayersFromBST(0, orderedPlayers, playersBSTwithUser)
                );
            },
            remove: (player: Player) => {
                update(($players) =>
                    $players.filter((p) => p.name !== player.name)
                );
            },
        };
    };

    function returnPlayersBSTwithUser(playersBST: Player[]): Player[] {
        let j: number = 0;
        let newPlayersBST: Player[] = structuredClone(playersBST);
        while (newPlayersBST[j] != null) {
            if (userPlayer.fgp < newPlayersBST[j].fgp) {
                j = 2 * j + 1;
            } else {
                j = 2 * j + 2;
            }
        }
        newPlayersBST[j] = userPlayer;
        return newPlayersBST;
    }

    function returnPlayersFromBST(
        j: number,
        orderedPlayers: Player[],
        playersBSTwithUser: Player[]
    ): Player[] {
        // check if node exists
        if (playersBSTwithUser[j] != null) {
            returnPlayersFromBST(2 * j + 2, orderedPlayers, playersBSTwithUser);
            orderedPlayers.push(playersBSTwithUser[j]);
            returnPlayersFromBST(2 * j + 1, orderedPlayers, playersBSTwithUser);

            return orderedPlayers;
        }
    }

    const playersStore = createStore();
    let players: Player[] = [];

    // Subscribe to the store and update local variable `players` whenever the store changes
    playersStore.subscribe((value) => {
        players = value;
    });

    onMount(() => {
        playersStore.loadPlayers().then(() => {
            console.log("Players have been fetched");
            console.log(players);
        });
    });

    export { Player };
</script>

<div
    class="fixed top-0 start-0 justify-between w-full bg-gray-50 dark:bg-gray-700 text-xs"
>
    <div class="flex bg-gray-200 px-2 py-3">
        <div class="w-5/12 text-gray-700 text-left">Ballin</div>
        <div class="w-5/12 flex justify-end items-center">
            <p class="w-8 px-2 text-center">FGM</p>
            <p class="w-8 px-2 text-center">FGA</p>
        </div>
        <div class="w-1/6 text-gray-700 text-right">FG%</div>
    </div>
</div>

<div class="mx-auto rounded overflow-hidden text-xs">
    <div class="flex px-2 py-3">
        <div class="w-1/6 text-white text-right">Placeholder</div>
    </div>
</div>

<div class="mx-auto rounded overflow-hidden text-xs">
    {#each $playersStore as player (player.objectID)}
        {#if player.img != "https://cdn.nba.com/headshots/nba/latest/1040x760/undefined.png"}
            <div
                class="flex px-2 py-2 items-center {player.name ==
                userPlayer.name
                    ? 'bg-orange-300'
                    : ''}"
            >
                <div class="w-3/4 flex">
                    {#if player.name != userPlayer.name}
                        <img
                            class="w-10 h-10 mr-2 self-center object-cover rounded-full"
                            src="https://cdn.nba.com/headshots/nba/latest/1040x760/{getPlayerID(
                                player.name
                            )}.png"
                            alt="player?.name"
                        />
                    {:else}
                        <img
                            src="src/lib/userPlayer/user.png"
                            class="w-10 h-10 mr-2 self-center object-cover rounded-full"
                            alt="User"
                        />
                    {/if}
                    <img
                        class="w-10 h-10 mr-2 self-center object-cover rounded-full"
                        alt="away-logo"
                        src="https://cdn.nba.com/logos/nba/{getTeamID(
                            player.team
                        )}/primary/L/logo.svg"
                    />
                    <div class="flex flex-col">
                        <p class="text-sm font-bold">{player?.name}</p>
                        <p class=" text-gray-600">
                            {getTeamName(player?.team)
                                .split("-")
                                .map((word) => {
                                    return (
                                        word[0].toUpperCase() +
                                        word.substring(1)
                                    );
                                })
                                .join(" ")}
                        </p>
                    </div>
                </div>
                <div class="w-5/12 flex justify-end items-center">
                    <p class="w-8 px-1 text-center">
                        {Boolean(player?.fgm) ? Math.round(player?.fgm) : "-"}
                    </p>
                    <p class="w-8 px-1 text-center">
                        {Boolean(player?.fga) ? Math.round(player?.fga) : "-"}
                    </p>
                </div>
                <p class="w-1/6 text-lg sm:text-xl font-bold text-right">
                    {player?.fgp >= 0 ? player?.fgp.toFixed(1) : "-"}
                </p>
            </div>
            <!-- <button on:click={() => playersStore.remove(player)} aria-label="Remove">x</button> -->
        {/if}
    {/each}
</div>

<div class="flex border-t">
    <div class="px-2 py-2 text-center">
        <p class="text-gray-600">
            <button>
                {#if $playersStore.length == 0}
                    <img
                        class="w-10 h-10 mr-2 self-center object-cover rounded-full"
                        src="src/lib/media/loading.gif"
                        alt="loading"
                    />
                {:else}
                    <img
                        class="w-10 h-10 mr-2 self-center object-cover rounded-full"
                        src="src/lib/media/blank.png"
                        alt="Placeholder"
                    />
                {/if}
                <p class="font-light text-gray-600" /></button
            >
        </p>
    </div>
</div>

<div
    id="bottom-banner"
    tabindex="-1"
    class="fixed bottom-0 start-0 flex justify-between w-full bg-gray-50 dark:bg-gray-700"
>
    <div class="w-1/2 px-2 py-2 text-center">
        <button
            on:click={() => playersStore.addOneUserScore()}
            class="font-semibold text-gray-700"
            >MAKE
            <p class="font-light text-gray-600">
                {(
                    Math.round(
                        ((userPlayer.fgm + 1) / (userPlayer.fga + 1)) * 1000
                    ) / 10
                ).toFixed(1)}
            </p>
        </button>
    </div>
    <div class="w-1/2 px-2 py-2 text-center">
        <p class="text-gray-600">
            <button
                on:click={() => playersStore.addZeroUserScore()}
                class="font-semibold"
                >MISS
                <p class="font-light text-gray-600">
                    {(
                        Math.round(
                            (userPlayer.fgm / (userPlayer.fga + 1)) * 1000
                        ) / 10
                    ).toFixed(1)}
                </p></button
            >
        </p>
    </div>
</div>
