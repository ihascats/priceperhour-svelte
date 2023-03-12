<script>
	export let selectedSteamGameData;
</script>

<div class="px-2">
	<div class="border-b-2 border-b-orange-800">
		{#if selectedSteamGameData?.discount_percent}
			<h1 class="flex gap-1 text-orange-400 font-mono">
				Regular Price:{' '}
				<p class="text-neutral-50">{selectedSteamGameData?.initial_formatted}</p>
			</h1>
		{/if}
		<h1 class="flex gap-1 text-orange-400 font-mono">
			Current Price:{' '}
			{#if Object.keys(selectedSteamGameData).length}
				<p
					class={`${selectedSteamGameData?.discount_percent ? 'text-lime-400' : 'text-neutral-50'}`}
				>
					{selectedSteamGameData.final_formatted}
				</p>
			{/if}
			{#if selectedSteamGameData?.discount_percent}
				<p
					class={`text-xs ${
						selectedSteamGameData?.discount_percent ? 'text-lime-500/80' : 'text-neutral-400'
					}`}
				>
					-{selectedSteamGameData.discount_percent}%
				</p>
			{/if}
		</h1>
	</div>
</div>
