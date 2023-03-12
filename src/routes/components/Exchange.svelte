<script>
	import { currencies } from '../currencies';
	export let exchangeToCurrency = 'USD';
	export let selectedCurrencyExchangeRates = {};
	export let selectedSteamGameData;
</script>

<div
	class="flex text-orange-300 justify-end font-mono align-bottom w-full items-end pr-2 min-h-[26px]"
>
	{selectedSteamGameData?.currency && Object.keys(selectedCurrencyExchangeRates).length
		? `${selectedSteamGameData?.final_formatted} === ${(
				selectedSteamGameData.final /
				(selectedCurrencyExchangeRates[selectedSteamGameData?.currency.toLowerCase()] * 100)
		  ).toFixed(2)}`
		: ''}
	<label class="flex flex-col font-mono text-sm w-fit">
		<select
			class="bg-transparent border-b-2 border-indigo-200 text-indigo-200 font-sans text-base"
			bind:value={exchangeToCurrency}
		>
			{#each currencies as currency, index}
				<option class="bg-neutral-900" value={currency} key={index}>{currency}</option>
			{/each}
		</select>
	</label>
</div>
