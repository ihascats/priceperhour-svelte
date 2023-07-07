<script>
	import { currencies } from '../currencies';
	import OpenInNewTab from '../icons/OpenInNewTab.svelte';
	export let arrayHowLongToBeatGames = [];
	export let arraySteamGames = [];
	export let selectedCurrency = 'USD';
	export let selectedSteamTitle;
	export let selectedHowLongToBeatTitle;
</script>

<div
	class="px-2 gap-2 items-center justify-center pb-4 bg-neutral-800 text-neutral-400 flex flex-col-reverse"
>
	<label class="flex flex-col w-full font-mono text-sm">
		Currency ({currencies.length})
		<select
			class="bg-transparent border-b-2 border-neutral-400 text-neutral-50 font-sans text-base"
			bind:value={selectedCurrency}
		>
			{#each currencies as currency, index}
				<option class="bg-neutral-900" value={currency} key={index}>{currency}</option>
			{/each}
		</select>
	</label>
	<label class="flex flex-col w-full font-mono text-sm">
		How long to beat ({arrayHowLongToBeatGames?.length || 0}):
		<div class="flex truncate w-full gap-2">
			<select
				class="bg-transparent truncate w-full border-b-2 border-neutral-400 text-neutral-50 font-sans text-base"
				on:change={(event) => {
					selectedHowLongToBeatTitle = arrayHowLongToBeatGames[event.target.value];
				}}
			>
				{#each arrayHowLongToBeatGames as game, index}
					<option class="bg-neutral-900" key={game.game_id} value={index}>
						{game.game_name} ({game.game_id})
					</option>
				{/each}
			</select>
			<a
				href={`https://howlongtobeat.com/game/${selectedHowLongToBeatTitle.game_id}`}
				target="_blank"
				rel="noreferrer"
				class=" flex self-center rounded fill-blue-500 bg-indigo-300/20 p-1"
				aria-label="Go to HowLongToBeat page"><OpenInNewTab /></a
			>
		</div>
	</label>

	<label class="flex flex-col w-full font-mono text-sm">
		Steam ({arraySteamGames?.length || 0}):
		<div class="flex truncate w-full gap-2">
			<select
				class="bg-transparent truncate w-full border-b-2 border-neutral-400 text-neutral-50 font-sans text-base"
				on:change={(event) => {
					selectedSteamTitle = arraySteamGames[event.target.value];
				}}
			>
				{#each arraySteamGames as game, index}
					<option class="bg-neutral-900" key={game.appid} value={index}>
						{game.name} ({game.appid})
					</option>
				{/each}
			</select>
			<a
				href={`https://store.steampowered.com/app/${selectedSteamTitle.appid}`}
				target="_blank"
				rel="noreferrer"
				class=" flex self-center rounded fill-blue-500 bg-indigo-300/20 p-1"
				aria-label="Go to Steam store page"><OpenInNewTab /></a
			>
		</div>
	</label>
</div>
