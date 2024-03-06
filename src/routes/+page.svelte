<script>
    import { getPlayerID } from '$lib/IDs/getIDs';

	export let data;
</script>

<div
    class="fixed top-0 start-0 justify-between w-full bg-gray-50 dark:bg-gray-700 text-xs"
>
    <div class="flex bg-gray-200 px-2 py-3">
        <div class="text-gray-700 text-left">Ballin</div>
    </div>
</div>

<div class="mx-auto rounded overflow-hidden text-xs">
    <div class="flex px-2 py-3">
        <div class="w-1/6 text-white text-right">Placeholder</div>
    </div>
</div>

<ul>
	{#each data.summaries as { slug, title, topPlayers, numPlayers }}
		<li>
			<a href="/{slug}">
				<div class="flex px-2 py-2 items-center">
					<div class="w-3/4 flex">
						{#each topPlayers as player (player)}
							<img
								class="w-10 h-10 mr-2 self-center object-cover rounded-full"
								src="https://cdn.nba.com/headshots/nba/latest/1040x760/{getPlayerID(
									player
								)}.png"
								alt="player?.name"
							/>
						{/each}
						<div class="flex flex-col">
							<p class="text-sm font-bold">{title}</p>
							<p class=" text-gray-600">
								{numPlayers} players
							</p>
						</div>
					</div>
					<!-- <div class="w-5/12 flex justify-end items-center">
				<p class="w-8 px-1 text-center">
					{Boolean(player?.fgm) ? player?.fgm : "-"}
				</p>
				<p class="w-8 px-1 text-center">
					{Boolean(player?.fga) ? player?.fga : "-"}
				</p>
			</div>
			<p class="w-1/6 text-lg sm:text-xl font-bold text-right">
				{player?.fgp >= 0 ? player?.fgp.toFixed(1) : "-"}
			</p> -->
				</div>
			</a>
		</li>
	{/each}
</ul>
