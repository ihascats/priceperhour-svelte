<script>
	// export let selectedHowLongToBeatTitle = {};
	export let comp_main;
	export let comp_plus;
	export let comp_100;
	export let initial;
	// const { comp_main, comp_plus, comp_100 } = selectedHowLongToBeatTitle;
</script>

<div class="flex p-2 bg-neutral-800 border-b-2 border-b-neutral-500 text-neutral-50 font-mono">
	<div class="grid grid-cols-3 w-full whitespace-nowrap gap-x-2">
		<p class="text-red-400 w-fit">Main:</p>
		<p class="text-red-400">
			{comp_main ? `${Math.trunc(comp_main / 3600)}h` : 'N/A'}
		</p>
		<p class="text-red-400">
			{initial && comp_main
				? `${(initial / (Math.trunc(comp_main / 3600) * 100)).toFixed(2)}/h`
				: 'N/A'}
		</p>

		<p class="text-yellow-400 w-fit">Main+:</p>
		<p class="text-yellow-400">
			{comp_plus ? `${Math.trunc(comp_plus / 3600)}h` : 'N/A'}
		</p>
		<p class="text-yellow-400">
			{initial && comp_plus
				? `${(initial / (Math.trunc(comp_plus / 3600) * 100)).toFixed(2)}/h`
				: 'N/A'}
		</p>

		<p class="text-green-400 w-fit">100%:</p>
		<p class="text-green-400">
			{comp_100 ? `${Math.trunc(comp_100 / 3600)}h` : 'N/A'}
		</p>
		<p class="text-green-400">
			{initial && comp_100
				? `${(initial / (Math.trunc(comp_100 / 3600) * 100)).toFixed(2)}/h`
				: 'N/A'}
		</p>
	</div>
</div>
