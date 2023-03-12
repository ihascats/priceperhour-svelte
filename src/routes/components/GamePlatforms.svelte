<script>
	export let selectedHowLongToBeatTitle;
</script>

<div class="bg-neutral-800 text-neutral-400 p-2 font-mono text-sm border-b-2 border-b-neutral-500">
	Platforms:
	<div class="flex flex-wrap gap-1 text-neutral-300">
		{#if Object.keys(selectedHowLongToBeatTitle).length}
			{#each selectedHowLongToBeatTitle?.platforms.sort((a, b) => a.length - b.length) as platform}
				<div class="bg-neutral-700 px-2" key={platform}>
					{platform}
				</div>
			{/each}
		{/if}
	</div>
</div>
