<script>
	import { tick } from 'svelte';
	import ErrorScreen from './components/ErrorScreen.svelte';
	import Exchange from './components/Exchange.svelte';
	import GamePlatforms from './components/GamePlatforms.svelte';
	import GamePrice from './components/GamePrice.svelte';
	import HistoryList from './components/HistoryList.svelte';
	import LoadingScreen from './components/LoadingScreen.svelte';
	import Selectors from './components/Selectors.svelte';
	import TimesToBeat from './components/TimesToBeat.svelte';
	import History from './icons/History.svelte';
	import Search from './icons/Search.svelte';

	export let arrayHowLongToBeatGames = [];
	export let arraySteamGames = [];
	export let selectedCurrency = 'USD';
	export let selectedCurrencyExchangeRates = {};
	export let selectedSteamTitle = {};
	export let selectedHowLongToBeatTitle = {};
	export let selectedSteamGameData = {};
	export let exchangeToCurrency = 'EUR';
	let searchHistory = [];

	function resetEverything() {
		arrayHowLongToBeatGames = [];
		arraySteamGames = [];
		selectedCurrencyExchangeRates = {};
		selectedSteamTitle = {};
		selectedHowLongToBeatTitle = {};
		selectedSteamGameData = {};
		isLoading = { loading: false };
	}

	async function apiExchange(exchangeToCurrency) {
		const response = await fetch(`/api/exchange/${exchangeToCurrency}`);
		const json = await response.json();
		return json.rates;
	}
	// Runs if a game has been selected and exchangeToCurrency has been changed
	$: if (selectedSteamTitle?.appid) {
		isLoading = { loading: true, message: 'Confirming exchange rates' };
		apiExchange(exchangeToCurrency).then((result) => {
			selectedCurrencyExchangeRates = result;
			isLoading = false;
		});
	}

	async function apiSteamGame(id, selectedCurrency) {
		const response = await fetch(
			`/api/steam/${id}/${selectedCurrency.toLowerCase().trim().slice(0, -1)}`
		);
		const json = await response.json();
		return json;
	}
	// Runs if a game has been selected and selectedCurrency has been changed
	$: if (selectedSteamTitle?.appid) {
		isLoading = { loading: true, message: 'Fetching new price from Steam' };
		apiSteamGame(selectedSteamTitle.appid, selectedCurrency).then((result) => {
			selectedSteamGameData = result;
			isLoading = false;
		});
	}

	let isError = { error: false };
	async function apiHowLongToBeat(title, interval) {
		const response = await fetch(`/api/howlongtobeat/${title}`);
		const titles = await response.json();
		try {
			if (!titles?.game_info.length) {
				updateErrorParameters({
					error: true,
					retry: false,
					message: 'HOW LONG TO BEAT 404: NO MATCHES FOUND'
				});
				return;
			}
			return [...titles.game_info].sort((a, b) => a.game_name.length - b.game_name.length);
		} catch (error) {
			updateErrorParameters({ error: true, retry: true, message: '500: Internal Server Error' });
			clearInterval(interval);
			resetEverything();
		}
	}

	async function apiSteamLibrary(title, interval) {
		const response = await fetch(`/api/steam/steamLibrary/${title}`);
		const titles = await response.json();
		try {
			if (!titles?.arrayGames.length) {
				updateErrorParameters({
					error: true,
					retry: false,
					message: 'STEAM 404: NO MATCHES FOUND'
				});
				return;
			}
			return [...titles.arrayGames];
		} catch (error) {
			updateErrorParameters({ error: true, retry: true, message: '500: Internal Server Error' });
			clearInterval(interval);
			resetEverything();
		}
	}

	let searchTerm = '';
	let isLoading = { loading: false };
	function updateLoadingBar() {
		const loadingBar = document.querySelector('.loading-bar');
		loadingBar.style.width = `${isLoading.completion}%`;
	}

	async function updateLoadingParameters({ loading, message, completion, maxCompletion }) {
		isLoading = {
			loading,
			message,
			completion,
			maxCompletion
		};
		await tick();
		updateLoadingBar();
	}

	async function updateErrorParameters({ error, retry, message }) {
		isError = {
			error,
			retry,
			message
		};
	}

	async function search() {
		if (isLoading.loading) return;
		const title = searchTerm.trim().toLowerCase();
		if (title.length <= 3) return;

		const indexOfHistoricMatch = searchHistory.findIndex((item) => item.searchedTerm === title);
		if (indexOfHistoricMatch > -1) {
			historyMatch(indexOfHistoricMatch);
			return;
		}

		updateLoadingParameters({
			loading: true,
			message: 'Searching for matches on Steam',
			completion: 1,
			maxCompletion: 74
		});

		const loadingBarInterval = setInterval(async () => {
			const addCompletion = 5;
			if (isLoading.completion + addCompletion <= isLoading.maxCompletion)
				isLoading.completion = isLoading.completion + addCompletion;
			await tick();
			updateLoadingBar();
		}, 1000);

		const steamTitles = await apiSteamLibrary(title, loadingBarInterval);

		if (!steamTitles?.length) {
			clearInterval(loadingBarInterval);
			resetEverything();
			return;
		}

		updateLoadingParameters({
			loading: true,
			message: 'Searching for matches on HowLongToBeat',
			completion: 75,
			maxCompletion: 94
		});

		const howLongToBeatTitles = await apiHowLongToBeat(title, loadingBarInterval);
		if (!howLongToBeatTitles?.length) {
			clearInterval(loadingBarInterval);
			resetEverything();
			return;
		}

		updateLoadingParameters({
			loading: true,
			message: 'Fetching price',
			completion: 95,
			maxCompletion: 100
		});

		//
		selectedCurrencyExchangeRates = await apiExchange(exchangeToCurrency);
		selectedSteamGameData = await apiSteamGame(steamTitles[0].appid, selectedCurrency);

		// set how long to beat selected game and array of all matches
		arrayHowLongToBeatGames = howLongToBeatTitles;
		selectedHowLongToBeatTitle = arrayHowLongToBeatGames[0];

		// set steam selected game and array of all matches
		arraySteamGames = steamTitles;
		selectedSteamTitle = arraySteamGames[0];

		clearInterval(loadingBarInterval);
		isLoading = { loading: false };

		if (!searchHistory.some((item) => item.searchedTerm === title)) {
			const latestItem = {
				// Save searched title so there are no duplicates in the history
				searchedTerm: title,

				// Steam Related Information
				arraySteamGames,
				selectedSteamTitle,
				selectedSteamGameData,

				// HowLongToBeat Related Information
				arrayHowLongToBeatGames,
				selectedHowLongToBeatTitle,
				image: `https://cdn.cloudflare.steamstatic.com/steam/apps/${selectedSteamTitle.appid}/header.jpg`
			};
			searchHistory.push(latestItem);
		}
	}
	let showHistory = false;

	function historyMatch(searchIndex) {
		const selected = searchHistory[searchIndex];
		arraySteamGames = selected.arraySteamGames;
		selectedSteamTitle = selected.selectedSteamTitle;
		selectedSteamGameData = selected.selectedSteamGameData;
		arrayHowLongToBeatGames = selected.arrayHowLongToBeatGames;
		selectedHowLongToBeatTitle = selected.selectedHowLongToBeatTitle;
	}
</script>

<div class="flex justify-center bg-neutral-700">
	{#if isLoading.loading}
		<LoadingScreen {isLoading} />
	{/if}
	{#if isError.error}
		<ErrorScreen {search} bind:isError />
	{/if}
	{#if showHistory}
		<HistoryList {searchHistory} {historyMatch} bind:showHistory />
	{/if}
	<div
		class="flex flex-col-reverse w-full max-w-[500px] min-h-screen bg-neutral-800 border-x-2 border-neutral-900 gap-2"
	>
		<form
			class="flex bg-neutral-900 p-2 pb-4 gap-2 items-center justify-center sticky bottom-0 z-50"
		>
			<input
				placeholder="At least 3 letters"
				class="border-b-2 border-neutral-400 text-neutral-400 bg-transparent outline-offset-4 px-1 w-full"
				bind:value={searchTerm}
				on:keyup={(event) => {
					if (event.key.toLowerCase() !== 'enter') return;
					search;
				}}
			/>
			<button on:click={search} class="text-neutral-400 fill-orange-400" aria-label="Search">
				<Search />
			</button>
			<button
				on:click={() => {
					showHistory = true;
				}}
				class="fill-orange-400"
				aria-label="History"><History /></button
			>
		</form>
		<Selectors
			{arrayHowLongToBeatGames}
			{arraySteamGames}
			bind:selectedCurrency
			bind:selectedSteamTitle
			bind:selectedHowLongToBeatTitle
		/>
		<Exchange bind:exchangeToCurrency {selectedCurrencyExchangeRates} {selectedSteamGameData} />
		<GamePrice {selectedSteamGameData} />
		{#if Object.keys(selectedHowLongToBeatTitle).length}
			<TimesToBeat {...selectedHowLongToBeatTitle} {...selectedSteamGameData} />
		{/if}
		<GamePlatforms {selectedHowLongToBeatTitle} />

		{#if Object.keys(selectedSteamTitle).length > 0}
			<div class="bg-neutral-800 font-mono text-neutral-50 p-2">
				<p>Steam Image:</p>
				<div class="max-h-[230px] grid justify-center bg-neutral-800">
					<img
						alt=""
						src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${selectedSteamTitle.appid}/header.jpg`}
						class=" bg-zinc-800 w-full"
						on:error={(event) => {
							event.target.src =
								'https://cdn.cloudflare.steamstatic.com/steam/apps/2062550/capsule_231x87.jpg?t=1663297175';
						}}
					/>
				</div>
			</div>
		{/if}
		{#if Object.keys(selectedHowLongToBeatTitle).length > 0}
			<div class="bg-neutral-800 font-mono text-neutral-50 p-2">
				<p>How Long To Beat Image:</p>
				<div class="max-h-[230px] grid justify-center bg-neutral-800">
					<img
						alt=""
						src={`https://howlongtobeat.com/games/${selectedHowLongToBeatTitle.game_image}`}
						class="bg-zinc-800 max-h-[230px]"
					/>
				</div>
			</div>
		{/if}
	</div>
</div>
