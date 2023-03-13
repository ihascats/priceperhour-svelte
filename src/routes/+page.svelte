<script>
	import { tick } from 'svelte';
	import ErrorScreen from './components/ErrorScreen.svelte';
	import Exchange from './components/Exchange.svelte';
	import GamePlatforms from './components/GamePlatforms.svelte';
	import GamePrice from './components/GamePrice.svelte';
	import LoadingScreen from './components/LoadingScreen.svelte';
	import Selectors from './components/Selectors.svelte';
	import TimesToBeat from './components/TimesToBeat.svelte';
	import Search from './icons/Search.svelte';

	export let arrayHowLongToBeatGames = [];
	export let arraySteamGames = [];
	export let selectedCurrency = 'USD';
	export let selectedCurrencyExchangeRates = {};
	export let selectedSteamTitle = {};
	export let selectedHowLongToBeatTitle = {};
	export let selectedSteamGameData = {};
	export let exchangeToCurrency = 'EUR';

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

	let isError = false;
	async function apiHowLongToBeat(title, interval) {
		const response = await fetch(`/api/howlongtobeat/${title}`);
		const titles = await response.json();
		try {
			return [...titles.response].sort((a, b) => a.name.length - b.name.length);
		} catch (error) {
			isError = true;
			clearInterval(interval);
			resetEverything();
		}
	}

	async function apiSteamLibrary(title, interval) {
		const response = await fetch(`/api/steam/steamLibrary/${title}`);
		const titles = await response.json();
		try {
			return [...titles.arrayGames];
		} catch (error) {
			isError = true;
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

	async function search() {
		if (isLoading.loading) return;
		const title = searchTerm.trim().toLowerCase();
		if (title.length <= 3) return;

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
	}
</script>

<svelte:head>
	<title>Price Per Hour</title>
	<meta
		name="Easily compare the cost of different games and make an informed decision about which ones are worth your time and money."
	/>
</svelte:head>

<div class="flex justify-center bg-neutral-700">
	{#if isLoading.loading}
		<LoadingScreen {isLoading} />
	{/if}
	{#if isError}
		<ErrorScreen {search} bind:isError />
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
				aria-label="Search"
			/>
			<button on:click={search} class="text-neutral-400 fill-orange-400">
				<Search />
			</button>
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

		{#if Object.keys(selectedHowLongToBeatTitle).length > 0}
			<div class="bg-neutral-800 font-mono text-neutral-50 p-2">
				<p>Steam Image:</p>
				<div class="max-h-[230px] grid justify-center bg-neutral-800">
					<img
						alt=""
						src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${selectedSteamTitle.appid}/header.jpg`}
						class=" bg-zinc-800 w-full"
					/>
				</div>
			</div>
		{/if}
		{#if Object.keys(selectedHowLongToBeatTitle).length > 0}
			<div class="bg-neutral-800 font-mono text-neutral-50 p-2">
				<p>How Long To Beat Image:</p>
				<div class="max-h-[230px] grid justify-center bg-neutral-800">
					<img alt="" src={selectedHowLongToBeatTitle.imageUrl} class="bg-zinc-800 max-h-[230px]" />
				</div>
			</div>
		{/if}
	</div>
</div>
