<script>
	export let searchHistory = [];
	export let historyMatch;
	export let showHistory;
</script>

<div
	class="max-w-[500px] z-[1000] fill-orange-300 top-0 max-h-screen w-full bg-neutral-900/80 backdrop-blur-md border-x-2 border-neutral-900 flex flex-col text-orange-400 fixed"
>
	<ul class="w-full max-h-screen min-h-screen overflow-y-scroll hide-scroll flex flex-col-reverse">
		<button
			class="w-full bottom-0 sticky pt-2 pb-3 bg-red-500 text-white"
			on:click={() => {
				showHistory = false;
			}}>close</button
		>
		{#each searchHistory as item, index}
			<li
				class="py-4 px-2 pr-7 hover:bg-lime-200/10 hover:text-lime-400 border-l-2 border-l-transparent hover:border-l-lime-300"
				on:click={() => {
					historyMatch(index);
					showHistory = false;
				}}
				on:keydown
			>
				<div class="flex w-full gap-8 justify-between">
					<div class="font-mono text-xl truncate w-full">
						<h1 class="truncate w-full">{item.searchedTerm}</h1>
						<h2>{item.selectedSteamGameData.final_formatted || 'N/A'}</h2>
					</div>
					<img
						class="h-14"
						alt=""
						src={item.image}
						on:error={() => {
							item.image =
								'https://cdn.cloudflare.steamstatic.com/steam/apps/2062550/capsule_231x87.jpg?t=1663297175';
						}}
					/>
				</div>
			</li>
		{/each}
	</ul>
</div>
